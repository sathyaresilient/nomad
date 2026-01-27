# =================================================================
# VPC Module (GCP)
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

variable "labels" {
  type    = map(string)
  default = {}
}

# -----------------------------------------------------
# VPC Network
# -----------------------------------------------------

resource "google_compute_network" "main" {
  name                    = "${var.name_prefix}-vpc"
  auto_create_subnetworks = false
  routing_mode            = "REGIONAL"
}

# -----------------------------------------------------
# Subnets
# -----------------------------------------------------

resource "google_compute_subnetwork" "private" {
  name          = "${var.name_prefix}-private-subnet"
  ip_cidr_range = "10.0.0.0/20"
  region        = var.region
  network       = google_compute_network.main.id

  private_ip_google_access = true

  secondary_ip_range {
    range_name    = "pods"
    ip_cidr_range = "10.1.0.0/16"
  }

  secondary_ip_range {
    range_name    = "services"
    ip_cidr_range = "10.2.0.0/20"
  }
}

resource "google_compute_subnetwork" "public" {
  name          = "${var.name_prefix}-public-subnet"
  ip_cidr_range = "10.0.16.0/20"
  region        = var.region
  network       = google_compute_network.main.id
}

# -----------------------------------------------------
# Cloud NAT (for private subnet internet access)
# -----------------------------------------------------

resource "google_compute_router" "main" {
  name    = "${var.name_prefix}-router"
  region  = var.region
  network = google_compute_network.main.id
}

resource "google_compute_router_nat" "main" {
  name                               = "${var.name_prefix}-nat"
  router                             = google_compute_router.main.name
  region                             = var.region
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"

  log_config {
    enable = true
    filter = "ERRORS_ONLY"
  }
}

# -----------------------------------------------------
# VPC Connector (for Cloud Run to access VPC)
# -----------------------------------------------------

resource "google_vpc_access_connector" "main" {
  name          = "${var.name_prefix}-connector"
  region        = var.region
  network       = google_compute_network.main.name
  ip_cidr_range = "10.8.0.0/28"

  min_instances = 2
  max_instances = var.environment == "prod" ? 10 : 3
}

# -----------------------------------------------------
# Private Service Connection (for Cloud SQL)
# -----------------------------------------------------

resource "google_compute_global_address" "private_ip_range" {
  name          = "${var.name_prefix}-private-ip"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.main.id
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.main.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_range.name]
}

# -----------------------------------------------------
# Firewall Rules
# -----------------------------------------------------

resource "google_compute_firewall" "allow_internal" {
  name    = "${var.name_prefix}-allow-internal"
  network = google_compute_network.main.name

  allow {
    protocol = "icmp"
  }

  allow {
    protocol = "tcp"
    ports    = ["0-65535"]
  }

  allow {
    protocol = "udp"
    ports    = ["0-65535"]
  }

  source_ranges = ["10.0.0.0/8"]
}

resource "google_compute_firewall" "allow_health_checks" {
  name    = "${var.name_prefix}-allow-health-checks"
  network = google_compute_network.main.name

  allow {
    protocol = "tcp"
    ports    = ["80", "443", "3000"]
  }

  source_ranges = ["35.191.0.0/16", "130.211.0.0/22"]
  target_tags   = ["allow-health-check"]
}

# -----------------------------------------------------
# Outputs
# -----------------------------------------------------

output "vpc_id" {
  value = google_compute_network.main.id
}

output "vpc_name" {
  value = google_compute_network.main.name
}

output "private_subnet_id" {
  value = google_compute_subnetwork.private.id
}

output "public_subnet_id" {
  value = google_compute_subnetwork.public.id
}

output "vpc_connector_id" {
  value = google_vpc_access_connector.main.id
}

output "private_vpc_connection" {
  value = google_service_networking_connection.private_vpc_connection.id
}
