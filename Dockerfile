# Stage 1: Install dependencies
FROM node:22-alpine AS deps
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 2: Build the app with standalone output
FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules
ENV NODE_ENV=production

# Build with standalone output
RUN pnpm build

# Stage 3: Final image
FROM node:22-alpine AS runner
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
RUN adduser -S app && mkdir -p /app && chown -R app /app
USER app
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public


EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
