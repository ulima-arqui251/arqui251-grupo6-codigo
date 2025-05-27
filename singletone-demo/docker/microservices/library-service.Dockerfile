# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

RUN npm ci

COPY library-service ./library-service
COPY libs ./libs

RUN npx nx build library-service --prod --outputPath=dist

# Production stage
FROM node:18-alpine AS production
RUN apk add --no-cache curl
WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/dist ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/libs ./libs

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3004

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3004/health || exit 1

CMD ["node", "main.js"]