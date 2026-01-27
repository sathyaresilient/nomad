# API Gateway Dockerfile
# Using Debian slim for better Prisma/OpenSSL compatibility
FROM node:20-slim AS base

# Force cache invalidation
ENV BUILD_DATE="2026-01-26-12-55-DEBIAN-DEBUG"

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Install dependencies (use npm install since this is a workspace)
COPY package.json ./
COPY prisma ./prisma/
RUN npm install && npx prisma generate

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 fastify

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

USER fastify

EXPOSE 3000

ENV PORT=3000
ENV HOST=0.0.0.0

CMD ["/bin/sh", "-c", "npx prisma db push && node dist/index.js"]
