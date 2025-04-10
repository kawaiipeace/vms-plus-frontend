# Build Stage
FROM registry.pea.co.th/developer/vms-plus/web/frontend/base:stable AS builder

USER root

# Copy application source code
COPY . . 

# Run production build using pnpm
RUN pnpm run build

############################

# Production Stage
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy built files from builder stage
COPY --chown=65532:65532 --from=builder /app/public ./public
COPY --chown=65532:65532 --from=builder /app/.next ./.next
COPY --chown=65532:65532 --from=builder /app/node_modules ./node_modules
COPY --chown=65532:65532 --from=builder /app/package.json ./package.json
COPY --chown=65532:65532 --from=builder /app/entrypoint.sh /app/entrypoint.sh

# Ensure the entrypoint script is executable
RUN chmod +x /app/entrypoint.sh

USER 65532

EXPOSE 3000
ENV PORT=3000

ENTRYPOINT ["/bin/sh", "/app/entrypoint.sh"]
