# Build stage
FROM node:22-alpine AS builder

# Install build dependencies for canvas
RUN apk add --no-cache \
    build-base \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    python3

WORKDIR /app

COPY package*.json prisma.config.js ./
COPY prisma ./prisma
RUN npm install
RUN npx prisma generate --schema=./prisma/schema.prisma

# Copy source files and configuration required for build
COPY src ./src
COPY tsconfig.json ./
RUN npm run build

# Production stage
FROM node:22-alpine

# Install runtime and build dependencies for canvas
RUN apk add --no-cache \
    build-base \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    python3

WORKDIR /app

COPY package*.json prisma.config.js ./
COPY prisma ./prisma
# Install only production dependencies
RUN npm install --production
# Generate Prisma Client explicitly
RUN npx prisma generate --schema=./prisma/schema.prisma

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/index.js"]
