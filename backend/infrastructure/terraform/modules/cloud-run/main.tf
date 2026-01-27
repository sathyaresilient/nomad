# =================================================================
# Cloud Run Module (GCP)
# =================================================================

variable "name_prefix" {
  type = string
}

variable "environment" {
  type = string
}

variable "region" {
  type = string
}

variable "vpc_connector_id" {
  type = string
}

variable "api_gateway_cpu" {
  type = string
}

variable "api_gateway_memory" {
  type = string
}

variable "database_connection_name" {
  type = string
}

variable "database_url" {
  type      = string
  sensitive = true
}

variable "redis_host" {
  type = string
}

variable "redis_port" {
  type = number
}

# Secret Manager Secret IDs
variable "database_url_secret_id" {
  type = string
}

variable "jwt_secret_id" {
  type = string
}

variable "google_client_id_secret_id" {
  type = string
}

variable "google_client_secret_secret_id" {
  type = string
}

variable "apple_client_id_secret_id" {
  type = string
}

variable "apple_team_id_secret_id" {
  type = string
}

variable "apple_key_id_secret_id" {
  type = string
}

variable "apple_private_key_secret_id" {
  type = string
}

# OAuth Redirect URIs (non-sensitive)
variable "google_redirect_uri" {
  type    = string
  default = ""
}

variable "apple_redirect_uri" {
  type    = string
  default = ""
}

# GCS Configuration
variable "gcs_media_bucket" {
  type        = string
  description = "GCS bucket for permanent media storage"
}

variable "gcs_uploads_bucket" {
  type        = string
  description = "GCS bucket for temporary uploads"
}

variable "cdn_url" {
  type        = string
  description = "CDN URL for media delivery"
  default     = ""
}

# Monitoring
variable "sentry_dsn" {
  type        = string
  description = "Sentry DSN for error tracking"
  default     = ""
}

variable "labels" {
  type    = map(string)
  default = {}
}

# -----------------------------------------------------
# Service Account
# -----------------------------------------------------

resource "google_service_account" "cloud_run" {
  account_id   = "${var.name_prefix}-cloud-run"
  display_name = "Cloud Run Service Account"
}

resource "google_project_iam_member" "cloud_run_sql" {
  project = data.google_project.current.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.cloud_run.email}"
}

resource "google_project_iam_member" "cloud_run_secrets" {
  project = data.google_project.current.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.cloud_run.email}"
}

resource "google_project_iam_member" "cloud_run_storage" {
  project = data.google_project.current.project_id
  role    = "roles/storage.objectAdmin"
  member  = "serviceAccount:${google_service_account.cloud_run.email}"
}

data "google_project" "current" {}

# -----------------------------------------------------
# API Gateway Cloud Run Service
# -----------------------------------------------------

resource "google_cloud_run_v2_service" "api_gateway" {
  name     = "${var.name_prefix}-api-gateway"
  location = var.region

  template {
    service_account = google_service_account.cloud_run.email

    scaling {
      min_instance_count = var.environment == "prod" ? 2 : 0
      max_instance_count = var.environment == "prod" ? 100 : 10
    }

    vpc_access {
      connector = var.vpc_connector_id
      egress    = "ALL_TRAFFIC"
    }

    containers {
      image = "gcr.io/cloudrun/hello"  # Placeholder - replace with actual image

      ports {
        container_port = 3000
      }

      resources {
        limits = {
          cpu    = var.api_gateway_cpu
          memory = var.api_gateway_memory
        }
        cpu_idle = var.environment != "prod"
      }

      # Non-sensitive environment variables
      env {
        name  = "NODE_ENV"
        value = var.environment == "prod" ? "production" : "development"
      }

      env {
        name  = "PORT"
        value = "3000"
      }

      env {
        name  = "REDIS_URL"
        value = "redis://${var.redis_host}:${var.redis_port}"
      }

      env {
        name  = "GOOGLE_REDIRECT_URI"
        value = var.google_redirect_uri
      }

      env {
        name  = "APPLE_REDIRECT_URI"
        value = var.apple_redirect_uri
      }

      # GCS Bucket Names
      env {
        name  = "GCS_MEDIA_BUCKET"
        value = var.gcs_media_bucket
      }

      env {
        name  = "GCS_UPLOADS_BUCKET"
        value = var.gcs_uploads_bucket
      }

      env {
        name  = "CDN_URL"
        value = var.cdn_url
      }

      # Sentry Error Tracking
      env {
        name  = "SENTRY_DSN"
        value = var.sentry_dsn
      }

      # Secrets from Secret Manager
      env {
        name = "DATABASE_URL"
        value_source {
          secret_key_ref {
            secret  = var.database_url_secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "JWT_SECRET"
        value_source {
          secret_key_ref {
            secret  = var.jwt_secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "GOOGLE_CLIENT_ID"
        value_source {
          secret_key_ref {
            secret  = var.google_client_id_secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "GOOGLE_CLIENT_SECRET"
        value_source {
          secret_key_ref {
            secret  = var.google_client_secret_secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "APPLE_CLIENT_ID"
        value_source {
          secret_key_ref {
            secret  = var.apple_client_id_secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "APPLE_TEAM_ID"
        value_source {
          secret_key_ref {
            secret  = var.apple_team_id_secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "APPLE_KEY_ID"
        value_source {
          secret_key_ref {
            secret  = var.apple_key_id_secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "APPLE_PRIVATE_KEY"
        value_source {
          secret_key_ref {
            secret  = var.apple_private_key_secret_id
            version = "latest"
          }
        }
      }

      startup_probe {
        http_get {
          path = "/health"
          port = 3000
        }
        initial_delay_seconds = 10
        timeout_seconds       = 3
        period_seconds        = 3
        failure_threshold     = 3
      }

      liveness_probe {
        http_get {
          path = "/health/live"
          port = 3000
        }
        initial_delay_seconds = 30
        timeout_seconds       = 3
        period_seconds        = 30
        failure_threshold     = 3
      }
    }

    labels = var.labels
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  lifecycle {
    ignore_changes = [
      template[0].containers[0].image,  # Allow CI/CD to update image
    ]
  }
}

# -----------------------------------------------------
# Allow Unauthenticated Access (Public API)
# -----------------------------------------------------

resource "google_cloud_run_v2_service_iam_member" "api_gateway_public" {
  location = google_cloud_run_v2_service.api_gateway.location
  name     = google_cloud_run_v2_service.api_gateway.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# -----------------------------------------------------
# Outputs
# -----------------------------------------------------

output "api_gateway_url" {
  value = google_cloud_run_v2_service.api_gateway.uri
}

output "api_gateway_service_name" {
  value = google_cloud_run_v2_service.api_gateway.name
}

output "service_account_email" {
  value = google_service_account.cloud_run.email
}
