# =================================================================
# Nomadly Infrastructure - GCP Variables
# =================================================================

# -----------------------------------------------------
# General
# -----------------------------------------------------

variable "gcp_project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "gcp_region" {
  description = "GCP region to deploy resources"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod"
  }
}

# -----------------------------------------------------
# Database (Cloud SQL PostgreSQL)
# -----------------------------------------------------

variable "db_tier" {
  description = "Cloud SQL machine tier"
  type        = string
  default     = "db-f1-micro"
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "nomadly"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "nomadly_admin"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

# -----------------------------------------------------
# Redis (Memorystore)
# -----------------------------------------------------

variable "redis_memory_size_gb" {
  description = "Redis memory size in GB"
  type        = number
  default     = 1
}

# -----------------------------------------------------
# Cloud Run Configuration
# -----------------------------------------------------

variable "api_gateway_cpu" {
  description = "CPU for API Gateway container"
  type        = string
  default     = "1"
}

variable "api_gateway_memory" {
  description = "Memory for API Gateway container"
  type        = string
  default     = "512Mi"
}

# -----------------------------------------------------
# Domain Configuration
# -----------------------------------------------------

variable "domain_name" {
  description = "Primary domain name for the application"
  type        = string
  default     = ""
}

variable "api_subdomain" {
  description = "Subdomain for API"
  type        = string
  default     = "api"
}

# -----------------------------------------------------
# JWT Configuration
# -----------------------------------------------------

variable "jwt_secret" {
  description = "JWT signing secret"
  type        = string
  sensitive   = true
}

# -----------------------------------------------------
# Google OAuth Configuration
# -----------------------------------------------------

variable "google_oauth_client_id" {
  description = "Google OAuth Client ID"
  type        = string
  default     = ""
}

variable "google_oauth_client_secret" {
  description = "Google OAuth Client Secret"
  type        = string
  sensitive   = true
  default     = ""
}

variable "google_oauth_redirect_uri" {
  description = "Google OAuth Redirect URI"
  type        = string
  default     = ""
}

# -----------------------------------------------------
# Apple OAuth Configuration
# -----------------------------------------------------

variable "apple_oauth_client_id" {
  description = "Apple OAuth Client ID (Service ID)"
  type        = string
  default     = ""
}

variable "apple_oauth_team_id" {
  description = "Apple Developer Team ID"
  type        = string
  default     = ""
}

variable "apple_oauth_key_id" {
  description = "Apple OAuth Key ID"
  type        = string
  default     = ""
}

variable "apple_oauth_private_key" {
  description = "Apple OAuth Private Key (PEM format)"
  type        = string
  sensitive   = true
  default     = ""
}

variable "apple_oauth_redirect_uri" {
  description = "Apple OAuth Redirect URI"
  type        = string
  default     = ""
}

# -----------------------------------------------------
# Monitoring Configuration
# -----------------------------------------------------

variable "sentry_dsn" {
  description = "Sentry DSN for error tracking"
  type        = string
  default     = ""
}

