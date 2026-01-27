# Nomadly Backend Infrastructure

Monorepo backend for the Nomadly travel social network.

## Architecture

```
backend/
├── services/           # Microservices
│   ├── api-gateway/    # API Gateway (Node.js/Express)
│   ├── user-service/   # Auth & profiles (Go)
│   ├── social-service/ # Friends & groups (Node.js)
│   ├── travel-service/ # Trips & matching (Python)
│   ├── chat-service/   # Real-time messaging (Go)
│   └── media-service/  # File uploads (Go)
├── shared/             # Shared libraries
│   ├── types/          # TypeScript types
│   ├── proto/          # gRPC protobuf definitions
│   └── utils/          # Common utilities
├── infrastructure/     # Terraform & K8s configs
│   ├── terraform/      # AWS infrastructure
│   ├── kubernetes/     # K8s manifests
│   └── docker/         # Docker configs
├── scripts/            # Build & deploy scripts
└── docs/               # API documentation
```

## Quick Start

### Prerequisites
- Node.js 20+
- Go 1.21+
- Python 3.11+
- Docker & Docker Compose
- Terraform 1.5+
- AWS CLI configured

### Local Development

```bash
# Install dependencies
npm install

# Start infrastructure (PostgreSQL, Redis, etc.)
docker-compose up -d

# Start API gateway
cd services/api-gateway && npm run dev

# Start all services
npm run dev:all
```

### Infrastructure Deployment

```bash
cd infrastructure/terraform

# Initialize Terraform
terraform init

# Plan changes
terraform plan -var-file=environments/dev.tfvars

# Apply changes
terraform apply -var-file=environments/dev.tfvars
```

## Services

| Service | Port | Tech Stack | Description |
|---------|------|------------|-------------|
| api-gateway | 3000 | Node.js/Fastify | API routing, auth, rate limiting |
| user-service | 3001 | Go/Fiber | Authentication & profiles |
| social-service | 3002 | Node.js/Express | Friends & groups |
| travel-service | 3003 | Python/FastAPI | Trips & matching |
| chat-service | 3004 | Go/WebSocket | Real-time messaging |
| media-service | 3005 | Go/Fiber | File uploads & processing |

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

## License

Proprietary - Nomadly Inc.
