# =================================================================
# GCP Secret Manager Module
# Manages application secrets for Nomadly
# =================================================================

variable "name_prefix" {
  type = string
}

variable "environment" {
  type = string
}

# Database
variable "database_url" {
  type      = string
  sensitive = true
}

# JWT
variable "jwt_secret" {
  type      = string
  sensitive = true
}

# Google OAuth
variable "google_client_id" {
  type    = string
  default = ""
}

variable "google_client_secret" {
  type      = string
  sensitive = true
  default   = ""
}

# Apple OAuth
variable "apple_client_id" {
  type    = string
  default = ""
}

variable "apple_team_id" {
  type    = string
  default = ""
}

variable "apple_key_id" {
  type    = string
  default = ""
}

variable "apple_private_key" {
  type      = string
  sensitive = true
  default   = ""
}

variable "labels" {
  type    = map(string)
  default = {}
}

# -----------------------------------------------------
# Local Variables
# -----------------------------------------------------

locals {
  secrets = {
    database-url = {
      value       = var.database_url
      description = "PostgreSQL connection string"
    }
    jwt-secret = {
      value       = var.jwt_secret
      description = "JWT signing secret"
    }
    google-client-id = {
      value       = var.google_client_id
      description = "Google OAuth Client ID"
    }
    google-client-secret = {
      value       = var.google_client_secret
      description = "Google OAuth Client Secret"
    }
    apple-client-id = {
      value       = var.apple_client_id
      description = "Apple OAuth Client ID"
    }
    apple-team-id = {
      value       = var.apple_team_id
      description = "Apple OAuth Team ID"
    }
    apple-key-id = {
      value       = var.apple_key_id
      description = "Apple OAuth Key ID"
    }
    apple-private-key = {
      value       = var.apple_private_key
      description = "Apple OAuth Private Key"
    }
  }
}

# -----------------------------------------------------
# Secret Manager Secrets
# -----------------------------------------------------

resource "google_secret_manager_secret" "secrets" {
  for_each = local.secrets

  secret_id = "${var.name_prefix}-${each.key}"

  replication {
    auto {}
  }

  labels = merge(var.labels, {
    secret_type = each.key
  })
}

resource "google_secret_manager_secret_version" "secrets" {
  for_each = local.secrets

  secret      = google_secret_manager_secret.secrets[each.key].id
  secret_data = each.value.value

  # Only create version if value is not empty
  lifecycle {
    precondition {
      condition     = each.value.value != "" || contains(["google-client-id", "google-client-secret", "apple-client-id", "apple-team-id", "apple-key-id", "apple-private-key"], each.key)
      error_message = "Secret value for ${each.key} cannot be empty"
    }
  }
}

# -----------------------------------------------------
# Outputs
# -----------------------------------------------------

output "secret_ids" {
  description = "Map of secret IDs"
  value = {
    for k, v in google_secret_manager_secret.secrets : k => v.secret_id
  }
}

output "database_url_secret_id" {
  value = google_secret_manager_secret.secrets["database-url"].secret_id
}

output "jwt_secret_id" {
  value = google_secret_manager_secret.secrets["jwt-secret"].secret_id
}

output "google_client_id_secret_id" {
  value = google_secret_manager_secret.secrets["google-client-id"].secret_id
}

output "google_client_secret_secret_id" {
  value = google_secret_manager_secret.secrets["google-client-secret"].secret_id
}

output "apple_client_id_secret_id" {
  value = google_secret_manager_secret.secrets["apple-client-id"].secret_id
}

output "apple_team_id_secret_id" {
  value = google_secret_manager_secret.secrets["apple-team-id"].secret_id
}

output "apple_key_id_secret_id" {
  value = google_secret_manager_secret.secrets["apple-key-id"].secret_id
}

output "apple_private_key_secret_id" {
  value = google_secret_manager_secret.secrets["apple-private-key"].secret_id
}
