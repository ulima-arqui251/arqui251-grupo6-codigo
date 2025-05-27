# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Copy source code
COPY recommendation-service ./recommendation-service
COPY libs ./libs

# Install dependencies
RUN npm ci --only=production

# Build the application
RUN npx nx build recommendation-service --prod

# Production stage
FROM node:18-alpine AS production

# Install curl for healthcheck
RUN apk add --no-cache curl

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built application
COPY --from=builder /app/dist/apps/recommendation-service ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/libs ./libs

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3005

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3005/health || exit 1

# Start the application
CMD ["node", "main.js"]