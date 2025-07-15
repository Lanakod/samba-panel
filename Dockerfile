# Stage 1: Install dependencies (including devDeps)
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn config set network-timeout 600000 -g \
  && yarn install --frozen-lockfile

# Stage 2: Build app
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
RUN yarn build

# Stage 3: Final production image (with only prod deps)
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Reinstall only production dependencies
COPY package.json yarn.lock ./
RUN yarn config set network-timeout 600000 -g \
  && yarn install --frozen-lockfile --production

COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public

# Add entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000
USER node
ENTRYPOINT ["/entrypoint.sh"]
