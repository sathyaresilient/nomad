# =================================================================
# Redis Module (GCP Memorystore)
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

variable "memory_size_gb" {
  type = number
}

variable "labels" {
  type    = map(string)
  default = {}
}

# -----------------------------------------------------
# Memorystore Redis Instance
# -----------------------------------------------------

resource "google_redis_instance" "main" {
  name           = "${var.name_prefix}-redis"
  tier           = var.environment == "prod" ? "STANDARD_HA" : "BASIC"
  memory_size_gb = var.memory_size_gb
  region         = var.region

  authorized_network = var.vpc_id

  redis_version = "REDIS_7_0"
  display_name  = "${var.name_prefix} Redis"

  redis_configs = {
    maxmemory-policy = "volatile-lru"
  }

  maintenance_policy {
    weekly_maintenance_window {
      day = "SUNDAY"
      start_time {
        hours   = 5
        minutes = 0
      }
    }
  }

  labels = var.labels
}

# -----------------------------------------------------
# Outputs
# -----------------------------------------------------

output "host" {
  value = google_redis_instance.main.host
}

output "port" {
  value = google_redis_instance.main.port
}

output "current_location_id" {
  value = google_redis_instance.main.current_location_id
}
