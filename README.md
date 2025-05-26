# Fullstack Monorepo

Example monorepo showcasing a Vue 3 frontend and a NestJS backend connected via gRPC, with Dockerized Envoy and Nginx proxies for both development and production.

---

## Table of Contents

* [Overview](#overview)
* [Tech Stack](#tech-stack)
* [Repository Structure](#repository-structure)
* [Development Setup](#development-setup)
* [Production Setup](#production-setup)
* [Author](#author)
* [License](#license)

---

## Overview

This repository is an example project demonstrating enterprise-grade API design using gRPC. It includes:

* A **NestJS** backend exposing gRPC services with reflection enabled.
* A **Vue 3 + Vite** frontend consuming those services via gRPC-Web.
* Shared **packages/grpc** containing `.proto` files and generated TypeScript clients.
* Dockerized **Envoy** and **Nginx** proxies with separate configs for development and production.

---

## Tech Stack

* **TypeScript**
* **Vue 3** (+ Vite)
* **NestJS**
* **gRPC** & **gRPC-Web** via `@protobuf-ts`
* **grpcurl** ([GitHub](https://github.com/fullstorydev/grpcurl)) for gRPC reflection and debugging
* **pnpm**
* **Docker** & **Docker Compose**
* **Envoy**
* **Nginx**

---

## Repository Structure

```bash
.
├── apps
│   ├── backend       # NestJS gRPC microservice
│   └── frontend      # Vue 3 gRPC-Web client
├── packages
│   └── grpc          # .proto definitions + TS codegen for client & server
├── docker
│   ├── compose.dev.yaml     # Dev Compose: only Envoy & Nginx
│   ├── compose.prod.yaml    # Prod Compose: frontend, backend, Envoy, Nginx
│   ├── envoy.dev.yaml       # Envoy config for development (uses host.docker.internal)
│   ├── envoy.prod.yaml      # Envoy config for production
│   ├── nginx.dev.conf       # Nginx config for development
│   └── nginx.prod.conf      # Nginx config for production
├── package.json      # Root workspace definitions & build scripts
├── pnpm-workspace.yaml
└── tsconfig*.json
```

---

## Development Setup

Run frontend and backend locally via pnpm, with Dockerized Envoy and Nginx proxies.

```bash
pnpm install
pnpm build:grpc
docker compose -f docker/compose.dev.yaml up -d
```

Then in separate terminals:

```bash
pnpm -F @fullstack-monorepo/backend start:dev   # Backend on localhost:50051
pnpm -F @fullstack-monorepo/frontend start:dev  # Frontend on localhost:4200 (HMR on 5173)
```

**Verify gRPC reflection** (health check):

```bash
grpcurl -plaintext localhost:50051 grpc.health.v1.Health/Check
```

Expected response:

```json
{
  "status": "SERVING"
}
```

Proxies:

* **Nginx** on `http://localhost:8080` serves the Vite frontend (running at localhost:4200, HMR on 5173).
* **Envoy** on `localhost:9100` proxies gRPC-Web (`/api/grpc`) to the backend.

> Envoy and Nginx configs in `docker/envoy.dev.yaml` and `docker/nginx.dev.conf` reference `host.docker.internal` to connect to local services.

---

## Production Setup

Start all services containerized:

```bash
docker compose -f docker/compose.prod.yaml up -d
```

No additional installation is required. Access the application at `http://localhost:8080`.

---

## Author

Serhii Mykhailovskyi [sergio@smounters.com](mailto:sergio@smounters.com)

---

## License

[MIT License](https://opensource.org/licenses/MIT)
