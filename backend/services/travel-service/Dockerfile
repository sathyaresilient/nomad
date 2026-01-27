FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production && npx prisma generate

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
COPY prisma ./prisma/
COPY src ./src/
RUN npm ci && npx prisma generate && npm run build

FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
RUN chown -R nodejs:nodejs /app
USER nodejs
ENV NODE_ENV=production PORT=3004
EXPOSE 3004
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q --spider http://localhost:3004/health || exit 1
CMD ["node", "dist/index.js"]
