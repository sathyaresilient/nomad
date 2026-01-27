# =================================================================
# Database Module (GCP Cloud SQL PostgreSQL)
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

variable "vpc_id" {
  type = string
}

variable "private_vpc_connection" {
  type = string
}

variable "db_tier" {
  type = string
}

variable "db_name" {
  type = string
}

variable "db_username" {
  type = string
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "labels" {
  type    = map(string)
  default = {}
}

# -----------------------------------------------------
# Cloud SQL Instance
# -----------------------------------------------------

resource "google_sql_database_instance" "main" {
  name             = "${var.name_prefix}-postgres"
  database_version = "POSTGRES_16"
  region           = var.region

  deletion_protection = var.environment == "prod"

  settings {
    tier              = var.db_tier
    availability_type = var.environment == "prod" ? "REGIONAL" : "ZONAL"
    disk_type         = "PD_SSD"
    disk_size         = var.environment == "prod" ? 100 : 20
    disk_autoresize   = true

    ip_configuration {
      ipv4_enabled    = false
      private_network = var.vpc_id
    }

    backup_configuration {
      enabled                        = true
      start_time                     = "03:00"
      point_in_time_recovery_enabled = var.environment == "prod"
      backup_retention_settings {
        retained_backups = var.environment == "prod" ? 7 : 1
      }
    }

    maintenance_window {
      day          = 7  # Sunday
      hour         = 4
      update_track = "stable"
    }

    insights_config {
      query_insights_enabled  = var.environment == "prod"
      query_string_length     = 1024
      record_application_tags = true
      record_client_address   = true
    }

    database_flags {
      name  = "log_connections"
      value = "on"
    }

    database_flags {
      name  = "log_disconnections"
      value = "on"
    }

    user_labels = var.labels
  }

  depends_on = [var.private_vpc_connection]
}

# -----------------------------------------------------
# Database
# -----------------------------------------------------

resource "google_sql_database" "main" {
  name     = var.db_name
  instance = google_sql_database_instance.main.name
}

# -----------------------------------------------------
# Database User
# -----------------------------------------------------

resource "google_sql_user" "main" {
  name     = var.db_username
  instance = google_sql_database_instance.main.name
  password = var.db_password
}

# -----------------------------------------------------
# Outputs
# -----------------------------------------------------

output "instance_name" {
  value = google_sql_database_instance.main.name
}

output "connection_name" {
  value = google_sql_database_instance.main.connection_name
}

output "private_ip" {
  value     = google_sql_database_instance.main.private_ip_address
  sensitive = true
}

output "connection_string" {
  value     = "postgresql://${var.db_username}:${var.db_password}@${google_sql_database_instance.main.private_ip_address}:5432/${var.db_name}"
  sensitive = true
}
