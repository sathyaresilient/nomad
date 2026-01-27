# =================================================================
# Storage Module (GCP Cloud Storage + CDN)
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

variable "bucket_suffix" {
  type = string
}

variable "labels" {
  type    = map(string)
  default = {}
}

# -----------------------------------------------------
# Cloud Storage Bucket (Media)
# -----------------------------------------------------

resource "google_storage_bucket" "media" {
  name          = "${var.name_prefix}-media-${var.bucket_suffix}"
  location      = var.region
  storage_class = "STANDARD"

  uniform_bucket_level_access = true

  versioning {
    enabled = var.environment == "prod"
  }

  cors {
    origin          = ["*"]  # Restrict in production
    method          = ["GET", "PUT", "POST", "DELETE"]
    response_header = ["Content-Type", "Content-Length", "ETag"]
    max_age_seconds = 3600
  }

  lifecycle_rule {
    condition {
      age = 365
    }
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }
  }

  labels = var.labels
}

# -----------------------------------------------------
# Cloud Storage Bucket (Uploads - Temporary)
# -----------------------------------------------------

resource "google_storage_bucket" "uploads" {
  name          = "${var.name_prefix}-uploads-${var.bucket_suffix}"
  location      = var.region
  storage_class = "STANDARD"

  uniform_bucket_level_access = true

  lifecycle_rule {
    condition {
      age = 1
    }
    action {
      type = "Delete"
    }
  }

  labels = var.labels
}

# -----------------------------------------------------
# Backend Bucket for CDN
# -----------------------------------------------------

resource "google_compute_backend_bucket" "media_cdn" {
  name        = "${var.name_prefix}-media-cdn"
  bucket_name = google_storage_bucket.media.name
  enable_cdn  = true

  cdn_policy {
    cache_mode        = "CACHE_ALL_STATIC"
    default_ttl       = 86400    # 1 day
    max_ttl           = 31536000 # 1 year
    client_ttl        = 86400
    negative_caching  = true
    serve_while_stale = 86400
  }
}

# -----------------------------------------------------
# URL Map for CDN
# -----------------------------------------------------

resource "google_compute_url_map" "media_cdn" {
  name            = "${var.name_prefix}-media-cdn-url-map"
  default_service = google_compute_backend_bucket.media_cdn.id
}

# -----------------------------------------------------
# HTTPS Proxy (for CDN)
# -----------------------------------------------------

resource "google_compute_target_http_proxy" "media_cdn" {
  name    = "${var.name_prefix}-media-cdn-proxy"
  url_map = google_compute_url_map.media_cdn.id
}

# -----------------------------------------------------
# Global Forwarding Rule (CDN Entry Point)
# -----------------------------------------------------

resource "google_compute_global_address" "media_cdn" {
  name = "${var.name_prefix}-media-cdn-ip"
}

resource "google_compute_global_forwarding_rule" "media_cdn" {
  name                  = "${var.name_prefix}-media-cdn-forwarding"
  ip_protocol           = "TCP"
  load_balancing_scheme = "EXTERNAL"
  port_range            = "80"
  target                = google_compute_target_http_proxy.media_cdn.id
  ip_address            = google_compute_global_address.media_cdn.id
}

# -----------------------------------------------------
# IAM for Public Read (CDN)
# -----------------------------------------------------

resource "google_storage_bucket_iam_member" "media_public" {
  bucket = google_storage_bucket.media.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# -----------------------------------------------------
# Outputs
# -----------------------------------------------------

output "bucket_name" {
  value = google_storage_bucket.media.name
}

output "bucket_url" {
  value = google_storage_bucket.media.url
}

output "uploads_bucket_name" {
  value = google_storage_bucket.uploads.name
}

output "cdn_ip" {
  value = google_compute_global_address.media_cdn.address
}

output "cdn_url" {
  value = "http://${google_compute_global_address.media_cdn.address}"
}
