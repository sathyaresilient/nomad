# Multi-stage Dockerfile for User Service
# Optimized for production with minimal image size

# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS deps

WORKDIR /app

# Install dependencies only
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production && \
    npx prisma generate

# ============================================
# Stage 2: Builder
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/
COPY src ./src/

RUN npm ci && \
    npx prisma generate && \
    npm run build

# ============================================
# Stage 3: Production
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Set ownership
RUN chown -R nodejs:nodejs /app

USER nodejs

# Environment
ENV NODE_ENV=production
ENV PORT=3001
ENV GRPC_PORT=50051

EXPOSE 3001 50051

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

CMD ["node", "dist/index.js"]
