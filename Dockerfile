# Multi-stage build for RuralCart delivery app
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Development dependencies for building
FROM base AS dev-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build the application
FROM dev-deps AS builder
WORKDIR /app
COPY . .

# Build the frontend
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 ruralcart

# Copy built application
COPY --from=builder --chown=ruralcart:nodejs /app/dist ./dist
COPY --from=builder --chown=ruralcart:nodejs /app/server ./server
COPY --from=builder --chown=ruralcart:nodejs /app/shared ./shared
COPY --from=deps --chown=ruralcart:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=ruralcart:nodejs /app/package*.json ./

USER ruralcart

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/categories', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]