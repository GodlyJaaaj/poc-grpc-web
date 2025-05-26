FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.base.json ./
COPY apps/backend       ./apps/backend
COPY packages/grpc      ./packages/grpc

RUN pnpm install --frozen-lockfile --shamefully-hoist \
    && pnpm build:grpc \
    && pnpm build:backend \
    && pnpm prune --prod


FROM node:22-alpine AS production
RUN apk add --no-cache tree
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/grpc      ./packages/grpc
COPY apps/backend       ./apps/backend

RUN pnpm install \
      --frozen-lockfile \
      --prod \
      --shamefully-hoist \
      --filter=./apps/backend...


FROM node:22-alpine AS runtime
WORKDIR /app

COPY --from=production /app/node_modules ./node_modules
RUN rm -rf node_modules@fullstack-monorepo/grpc

COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/packages/grpc/package.json      ./node_modules/@fullstack-monorepo/grpc/
COPY --from=builder /app/packages/grpc/dist              ./node_modules/@fullstack-monorepo/grpc/dist/
COPY --from=builder /app/packages/grpc/proto             ./node_modules/@fullstack-monorepo/grpc/proto/

ENV NODE_ENV=production
EXPOSE 50051

CMD ["node", "dist/main.js"]
