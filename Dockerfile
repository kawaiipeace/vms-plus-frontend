# syntax=docker/dockerfile:1.4
ARG NODE_VERSION=20.11-slim

FROM node:${NODE_VERSION} AS deps
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies with caching
RUN --mount=type=cache,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile

FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# We don't need the build stage for CI, but including it for completeness
RUN pnpm build
