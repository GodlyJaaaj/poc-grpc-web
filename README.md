# Fullstack Monorepo

**Example monorepo** showcasing a Vue 3 frontend and a NestJS backend connected via gRPC, with a Dockerized environment featuring Envoy and Nginx.

---

## Table of Contents

* [Overview](#overview)
* [Tech Stack](#tech-stack)
* [Repository Structure](#repository-structure)
* [packages/grpc](#packagesgrpc)
* [apps/backend](#appsbackend)
* [apps/frontend](#appsfrontend)
* [Docker Setup](#docker-setup)
* [Local Development](#local-development)
* [Author](#author)
* [License](#license)

---

## Overview

This repository is an **example project** demonstrating enterprise-grade API design using gRPC. It contains:

* A **NestJS** backend exposing gRPC services.
* A **Vue 3 + Vite** frontend consuming those services via gRPC-Web.
* Shared `packages/grpc` holding **.proto** files and generated TypeScript clients.
* A Docker setup with **Envoy** (gRPC proxy) and **Nginx** (HTTP/gRPC-Web proxy) for seamless local deployment.

> 🚀 Future-minded architecture: easily extend to multiple services!

---

## Tech Stack

* **TypeScript** throughout
* **Vue 3** (+ Vite) for the frontend
* **NestJS** for the backend microservice
* **gRPC** & **gRPC-Web** via `@protobuf-ts`
* **Docker** & **Docker Compose** for container orchestration
* **Envoy** as HTTP/2 / gRPC proxy
* **Nginx** for static assets & gRPC-Web routing
* **pnpm** as the package manager

---

## Repository Structure

```bash
├── apps
│   ├── backend       # NestJS gRPC microservice
│   └── frontend      # Vue 3 gRPC-Web client
├── packages
│   └── grpc          # .proto files + TS codegen for both client & server
├── docker            # Compose + Envoy & Nginx configs
├── package.json      # Root workspace definitions & build scripts
├── pnpm-workspace.yaml
└── tsconfig*.json
```

---

## packages/grpc

Contains:

* `proto/` — original `.proto` definitions (`hello`, `grpc.health.v1`).
* `gen-proto.ts` — script to generate TypeScript clients via `@protobuf-ts/protoc`.
* `dist/cjs/` & `dist/esm/` — compiled modules for Node.js (CJS) and browser (ESM).

**Key script** (run from monorepo root):

```bash
pnpm build:grpc    # Runs `pnpm -F @fullstack-monorepo/grpc build`
```

---

## apps/backend

A NestJS-powered gRPC microservice:

* **Source**: `apps/backend/src`
* **Controllers**: `hello.controller.ts`, `health.controller.ts`
* **Config**: uses `dotenv` (no special vars required for example).

**Available scripts**:

```bash
pnpm -F @fullstack-monorepo/backend build      # Build production files
pnpm -F @fullstack-monorepo/backend start:dev  # Dev mode (watch + reload)
pnpm -F @fullstack-monorepo/backend start:prod # Run built code
```

This service listens on port **50051** (internal Docker network).

---

## apps/frontend

A Vue 3 client using gRPC-Web:

* **Entry**: `apps/frontend/src/main.ts`
* **gRPC setup**: `apps/frontend/src/grpc.ts` connects via Envoy & Nginx gateway.

**Scripts**:

```bash
pnpm -F @fullstack-monorepo/frontend start:dev  # Dev server
pnpm -F @fullstack-monorepo/frontend build      # Production build
```

Served on internal port **80** by its container.

---

## Docker Setup

All container definitions live in `docker/compose.yaml`:

* **envoy** (bitnami/envoy)

    * Listens on **9100** for HTTP/2 → proxies to backend at 50051
    * Admin interface on **9099** (no host mapping)
* **nginx** (nginx\:alpine)

    * Serves static frontend and proxies `/api/grpc` to Envoy
    * Exposes **8080** on host
* **backend**: built from `apps/backend/Dockerfile`
* **frontend**: built from `apps/frontend/Dockerfile`

**To start all services**:

```bash
cd docker
docker-compose up --build
```

Visit `http://localhost:8080` to access the frontend and exercise the gRPC-Web API.

---

## Local Development

Without Docker, ensure you have **pnpm** installed:

```bash
pnpm install             # Install dependencies
pnpm build               # Generate types & build packages
pnpm -F @fullstack-monorepo/backend start:dev   # Start backend in dev mode
pnpm -F @fullstack-monorepo/frontend start:dev  # Start frontend in dev mode
```

---

## Author

Serhii Mykhailovskyi [sergio@smounters.com](mailto:sergio@smounters.com)

---

## License

This project is licensed under the **MIT License**.
