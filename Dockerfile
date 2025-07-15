# Stage 1: Install dependencies
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 2: Build the app with standalone output
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules
ENV NODE_ENV=production

RUN pnpm build

# Stage 3: Final image with sharp dependencies
FROM node:22-alpine AS runner

# Required for sharp
RUN apk add --no-cache libc6-compat

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

RUN adduser -S app && mkdir -p /app && chown -R app /app
USER app
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_SHARP_PATH=/app/sharp

COPY --from=builder /app/node_modules/sharp ./sharp

COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public

COPY next.config.ts .

EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
