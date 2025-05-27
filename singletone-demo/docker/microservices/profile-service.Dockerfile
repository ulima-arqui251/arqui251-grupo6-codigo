# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Copy source code
COPY profile-service ./profile-service
COPY libs ./libs

# Install dependencies (including dev dependencies for nx build)
RUN npm ci

# Build the application
RUN npx nx build profile-service --prod --outputPath=dist

# Production stage
FROM node:18-alpine AS production

# Install curl for healthcheck
RUN apk add --no-cache curl

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S profileservice -u 1001

# Copy built application and production node_modules
COPY --from=builder /app/dist ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/libs ./libs

# Change ownership
RUN chown -R profileservice:nodejs /app
USER profileservice

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3002/health || exit 1

# Start the application
CMD ["node", "main.js"]