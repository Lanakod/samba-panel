# Stage 1: Base image with yarn
FROM node:22-alpine AS base
WORKDIR /usr/src/app

# Stage 2: Install dependencies (with devDependencies)
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json yarn.lock tsconfig.json /temp/dev/
RUN cd /temp/dev && yarn install --frozen-lockfile

# Stage 3: Install only production dependencies
RUN mkdir -p /temp/prod
COPY package.json yarn.lock /temp/prod/
RUN cd /temp/prod && yarn install --frozen-lockfile --production

# Stage 4: Build the Next.js app
FROM base AS build
WORKDIR /usr/src/app
COPY --from=install /temp/dev/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN yarn build

# Stage 5: Final production image
FROM base AS release
WORKDIR /usr/src/app

# Copy production dependencies and built files
COPY --from=build /usr/src/app/.next .next
COPY --from=build /usr/src/app/public ./public
COPY --from=build /usr/src/app/next.config.ts ./next.config.ts
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/node_modules ./node_modules

EXPOSE 3000
USER node

# Start Next.js server
CMD ["yarn", "start"]
