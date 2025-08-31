# @my/grpc

A minimal, standalone package containing protobuf definitions and generated TypeScript clients using protobuf-ts, intended to be used by the minimal Vite frontend (web) without relying on the repo’s existing @fullstack-monorepo/grpc package.

## Structure
- `proto/` – source `.proto` files (edit these)
- `gen-proto.ts` – script to generate TS from proto using protobuf-ts
- `src/` – generated TS files (overwritten by generator)
- `dist/` – compiled JS and type declarations (CJS and ESM)

## Prerequisites
- `pnpm` and Node.js
- `protoc` available. The script tries `node_modules/.bin/protoc` (provided by `@protobuf-ts/protoc`) first, then falls back to a global `protoc`.

## Commands
From the monorepo root or inside this package folder:

- Generate code from proto
  pnpm -F @my/grpc run proto:generate

- Build (generate + compile)
  pnpm -F @my/grpc run build

This will:
1. Clean and regenerate `src/` from `proto/`
2. Compile to `dist/cjs` and `dist/esm`

## Usage
You can import via deep paths or via the package root:

- Deep path
  import { HelloServiceClient } from '@my/grpc/hello/hello.client';

- Root entry
  import { HelloServiceClient } from '@my/grpc';

Ensure that your consumer app installs peer dependencies `@protobuf-ts/runtime` and `@protobuf-ts/runtime-rpc`.
