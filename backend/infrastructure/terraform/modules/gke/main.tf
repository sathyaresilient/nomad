# =================================================================
# GKE Cluster Module
# Google Kubernetes Engine cluster for microservices
# =================================================================

variable "project_id" {
  type        = string
  description = "GCP Project ID"
}

variable "region" {
  type        = string
  description = "GCP Region"
}

variable "name_prefix" {
  type        = string
  description = "Prefix for resource names"
}

variable "environment" {
  type        = string
  description = "Environment (dev, staging, prod)"
}

variable "network_id" {
  type        = string
  description = "VPC Network ID"
}

variable "subnet_id" {
  type        = string
  description = "Subnet ID for nodes"
}

variable "node_machine_type" {
  type        = string
  description = "Machine type for nodes"
  default     = "e2-standard-2"
}

variable "min_node_count" {
  type        = number
  description = "Minimum nodes per zone"
  default     = 1
}

variable "max_node_count" {
  type        = number
  description = "Maximum nodes per zone"
  default     = 5
}

variable "labels" {
  type    = map(string)
  default = {}
}

# -----------------------------------------------------
# GKE Cluster
# -----------------------------------------------------

resource "google_container_cluster" "primary" {
  name     = "${var.name_prefix}-gke"
  location = var.region

  # We can't create a cluster with no node pool, but we want to use
  # separately managed node pools. So we create the smallest possible
  # default pool and immediately delete it.
  remove_default_node_pool = true
  initial_node_count       = 1

  network    = var.network_id
  subnetwork = var.subnet_id

  # Enable Workload Identity
  workload_identity_config {
    workload_pool = "${var.project_id}.svc.id.goog"
  }

  # Enable network policy
  network_policy {
    enabled  = true
    provider = "CALICO"
  }

  # Private cluster config
  private_cluster_config {
    enable_private_nodes    = true
    enable_private_endpoint = false
    master_ipv4_cidr_block  = "172.16.0.0/28"
  }

  # IP allocation policy for VPC-native cluster
  ip_allocation_policy {
    cluster_secondary_range_name  = "pods"
    services_secondary_range_name = "services"
  }

  # Maintenance window
  maintenance_policy {
    recurring_window {
      start_time = "2026-01-01T09:00:00Z"
      end_time   = "2026-01-01T17:00:00Z"
      recurrence = "FREQ=WEEKLY;BYDAY=SA,SU"
    }
  }

  # Logging and monitoring
  logging_config {
    enable_components = ["SYSTEM_COMPONENTS", "WORKLOADS"]
  }

  monitoring_config {
    enable_components = ["SYSTEM_COMPONENTS"]
    managed_prometheus {
      enabled = true
    }
  }

  # Release channel
  release_channel {
    channel = var.environment == "prod" ? "STABLE" : "REGULAR"
  }

  # Addons
  addons_config {
    http_load_balancing {
      disabled = false
    }
    horizontal_pod_autoscaling {
      disabled = false
    }
    gce_persistent_disk_csi_driver_config {
      enabled = true
    }
  }

  resource_labels = var.labels
}

# -----------------------------------------------------
# Node Pool - General Purpose
# -----------------------------------------------------

resource "google_container_node_pool" "general" {
  name       = "${var.name_prefix}-general-pool"
  location   = var.region
  cluster    = google_container_cluster.primary.name
  node_count = var.min_node_count

  autoscaling {
    min_node_count = var.min_node_count
    max_node_count = var.max_node_count
  }

  management {
    auto_repair  = true
    auto_upgrade = true
  }

  node_config {
    machine_type = var.node_machine_type
    disk_size_gb = 50
    disk_type    = "pd-ssd"

    # Google recommends custom service accounts with minimal permissions
    service_account = google_service_account.gke_nodes.email
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]

    # Enable workload identity on nodes
    workload_metadata_config {
      mode = "GKE_METADATA"
    }

    labels = merge(var.labels, {
      node-type = "general"
    })

    # Shielded instance config
    shielded_instance_config {
      enable_secure_boot          = true
      enable_integrity_monitoring = true
    }

    metadata = {
      disable-legacy-endpoints = "true"
    }
  }
}

# -----------------------------------------------------
# Service Account for GKE Nodes
# -----------------------------------------------------

resource "google_service_account" "gke_nodes" {
  account_id   = "${var.name_prefix}-gke-nodes"
  display_name = "GKE Node Service Account"
}

resource "google_project_iam_member" "gke_nodes_log_writer" {
  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.gke_nodes.email}"
}

resource "google_project_iam_member" "gke_nodes_metric_writer" {
  project = var.project_id
  role    = "roles/monitoring.metricWriter"
  member  = "serviceAccount:${google_service_account.gke_nodes.email}"
}

resource "google_project_iam_member" "gke_nodes_artifact_reader" {
  project = var.project_id
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:${google_service_account.gke_nodes.email}"
}

# -----------------------------------------------------
# Service Account for User Service (Workload Identity)
# -----------------------------------------------------

resource "google_service_account" "user_service" {
  account_id   = "user-service"
  display_name = "User Service Workload Identity"
}

resource "google_service_account_iam_member" "user_service_workload_identity" {
  service_account_id = google_service_account.user_service.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "serviceAccount:${var.project_id}.svc.id.goog[nomadly/user-service]"
}

resource "google_project_iam_member" "user_service_sql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.user_service.email}"
}

resource "google_project_iam_member" "user_service_secret_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.user_service.email}"
}

# -----------------------------------------------------
# Outputs
# -----------------------------------------------------

output "cluster_name" {
  value = google_container_cluster.primary.name
}

output "cluster_endpoint" {
  value     = google_container_cluster.primary.endpoint
  sensitive = true
}

output "cluster_ca_certificate" {
  value     = google_container_cluster.primary.master_auth[0].cluster_ca_certificate
  sensitive = true
}

output "node_pool_name" {
  value = google_container_node_pool.general.name
}

output "user_service_sa_email" {
  value = google_service_account.user_service.email
}
