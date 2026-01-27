# =================================================================
# Nomadly Infrastructure - GCP Main Configuration
# =================================================================

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }

  # Backend configuration for state storage
  # Uncomment for production use
  # backend "gcs" {
  #   bucket = "nomadly-terraform-state"
  #   prefix = "infrastructure"
  # }
}

# =================================================================
# Provider Configuration
# =================================================================

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

provider "google-beta" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

# =================================================================
# Enable Required APIs
# =================================================================

resource "google_project_service" "required_apis" {
  for_each = toset([
    "compute.googleapis.com",
    "container.googleapis.com",
    "sqladmin.googleapis.com",
    "redis.googleapis.com",
    "run.googleapis.com",
    "cloudbuild.googleapis.com",
    "secretmanager.googleapis.com",
    "servicenetworking.googleapis.com",
    "cloudresourcemanager.googleapis.com",
  ])

  service            = each.key
  disable_on_destroy = false
}

# =================================================================
# Random Suffix for Unique Naming
# =================================================================

resource "random_id" "suffix" {
  byte_length = 4
}

# =================================================================
# Local Variables
# =================================================================

locals {
  name_prefix = "nomadly-${var.environment}"
  
  common_labels = {
    project     = "nomadly"
    environment = var.environment
    managed_by  = "terraform"
  }
}

# =================================================================
# VPC Network
# =================================================================

module "vpc" {
  source = "./modules/vpc"

  name_prefix = local.name_prefix
  environment = var.environment
  region      = var.gcp_region
  
  labels = local.common_labels

  depends_on = [google_project_service.required_apis]
}

# =================================================================
# Cloud SQL (PostgreSQL)
# =================================================================

module "database" {
  source = "./modules/database"

  name_prefix = local.name_prefix
  environment = var.environment
  region      = var.gcp_region
  
  vpc_id              = module.vpc.vpc_id
  private_vpc_connection = module.vpc.private_vpc_connection
  
  db_tier             = var.db_tier
  db_name             = var.db_name
  db_username         = var.db_username
  db_password         = var.db_password
  
  labels = local.common_labels

  depends_on = [module.vpc]
}

# =================================================================
# Memorystore (Redis)
# =================================================================

module "redis" {
  source = "./modules/redis"

  name_prefix = local.name_prefix
  environment = var.environment
  region      = var.gcp_region
  
  vpc_id     = module.vpc.vpc_id
  
  memory_size_gb = var.redis_memory_size_gb
  
  labels = local.common_labels

  depends_on = [module.vpc]
}

# =================================================================
# Cloud Storage (Media)
# =================================================================

module "storage" {
  source = "./modules/storage"

  name_prefix   = local.name_prefix
  environment   = var.environment
  region        = var.gcp_region
  bucket_suffix = random_id.suffix.hex
  
  labels = local.common_labels
}

# =================================================================
# Secrets (Secret Manager)
# =================================================================

module "secrets" {
  source = "./modules/secrets"

  name_prefix = local.name_prefix
  environment = var.environment

  # Core secrets
  database_url = module.database.connection_string
  jwt_secret   = var.jwt_secret

  # Google OAuth
  google_client_id     = var.google_oauth_client_id
  google_client_secret = var.google_oauth_client_secret

  # Apple OAuth
  apple_client_id   = var.apple_oauth_client_id
  apple_team_id     = var.apple_oauth_team_id
  apple_key_id      = var.apple_oauth_key_id
  apple_private_key = var.apple_oauth_private_key

  labels = local.common_labels

  depends_on = [module.database]
}

# =================================================================
# Cloud Run (API Services)
# =================================================================

module "cloud_run" {
  source = "./modules/cloud-run"

  name_prefix = local.name_prefix
  environment = var.environment
  region      = var.gcp_region
  
  vpc_connector_id = module.vpc.vpc_connector_id
  
  # Service configurations
  api_gateway_cpu    = var.api_gateway_cpu
  api_gateway_memory = var.api_gateway_memory
  
  # Database connection
  database_connection_name = module.database.connection_name
  database_url            = module.database.connection_string
  redis_host              = module.redis.host
  redis_port              = module.redis.port

  # Secret IDs for Secret Manager references
  database_url_secret_id         = module.secrets.database_url_secret_id
  jwt_secret_id                  = module.secrets.jwt_secret_id
  google_client_id_secret_id     = module.secrets.google_client_id_secret_id
  google_client_secret_secret_id = module.secrets.google_client_secret_secret_id
  apple_client_id_secret_id      = module.secrets.apple_client_id_secret_id
  apple_team_id_secret_id        = module.secrets.apple_team_id_secret_id
  apple_key_id_secret_id         = module.secrets.apple_key_id_secret_id
  apple_private_key_secret_id    = module.secrets.apple_private_key_secret_id

  # OAuth redirect URIs (non-sensitive)
  google_redirect_uri = var.google_oauth_redirect_uri
  apple_redirect_uri  = var.apple_oauth_redirect_uri

  # GCS bucket names from storage module
  gcs_media_bucket   = module.storage.bucket_name
  gcs_uploads_bucket = module.storage.uploads_bucket_name
  cdn_url            = module.storage.cdn_url

  # Monitoring
  sentry_dsn = var.sentry_dsn

  labels = local.common_labels

  depends_on = [module.vpc, module.database, module.redis, module.secrets, module.storage]
}

# =================================================================
# Outputs
# =================================================================

output "vpc_id" {
  description = "VPC Network ID"
  value       = module.vpc.vpc_id
}

output "database_connection_name" {
  description = "Cloud SQL connection name"
  value       = module.database.connection_name
}

output "database_private_ip" {
  description = "Cloud SQL private IP"
  value       = module.database.private_ip
  sensitive   = true
}

output "redis_host" {
  description = "Memorystore Redis host"
  value       = module.redis.host
}

output "storage_bucket" {
  description = "Cloud Storage bucket for media"
  value       = module.storage.bucket_name
}

output "api_gateway_url" {
  description = "Cloud Run API Gateway URL"
  value       = module.cloud_run.api_gateway_url
}

output "cdn_url" {
  description = "CDN URL for media"
  value       = module.storage.cdn_url
}
