FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.base.json ./
COPY apps/frontend      ./apps/frontend
COPY packages/grpc      ./packages/grpc

RUN pnpm install --frozen-lockfile --shamefully-hoist \
    && pnpm build:grpc \
    && pnpm build:frontend


FROM nginx:alpine AS runtime

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/apps/frontend/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
