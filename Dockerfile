# ==========================================
# Build Stage
# ==========================================
FROM node:24-alpine AS builder

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /usr/src/app

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml ./

# Install ALL dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source code and configuration files
COPY . .

# Generate Prisma Client (if using Prisma)
# Set a dummy DATABASE_URL for build-time generation
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy?schema=public"
RUN pnpm prisma generate

# Build the application
RUN pnpm run build

# ==========================================
# Production Stage
# ==========================================
FROM node:24-alpine AS production

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Copy Prisma schema
COPY prisma ./prisma

# Install ONLY production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy Prisma Client generated in builder stage (custom output path)
COPY --from=builder /usr/src/app/generated ./generated

# Copy built application from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /usr/src/app

# Switch to non-root user
USER nestjs

# Expose the application port
EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "dist/main"]
