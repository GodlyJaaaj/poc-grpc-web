#!/usr/bin/env tsx

import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const PKG_ROOT = path.dirname(__filename);
const PROTO_DIR = path.join(PKG_ROOT, 'proto');
const OUT_BASE = path.relative(process.cwd(), './src');

function getProtocPath(): string {
  const bin = os.platform() === 'win32' ? '.cmd' : '';
  const local = path.resolve('node_modules/.bin/protoc' + bin);
  if (existsSync(local)) return local;
  return 'protoc' + bin;
}

function getAllProtoFiles(dir: string): string[] {
  const result: string[] = [];
  const walk = (folder: string) => {
    readdirSync(folder).forEach((name) => {
      const p = path.join(folder, name);
      if (statSync(p).isDirectory()) {
        walk(p);
      } else if (p.endsWith('.proto')) {
        result.push(p);
      }
    });
  };
  walk(dir);
  return result;
}

function cleanOutput(dir: string) {
  if (existsSync(dir)) rmSync(dir, {recursive: true, force: true});
  mkdirSync(dir, {recursive: true});
}

if (!existsSync(PROTO_DIR)) {
  console.error(`❌ Directory not found: ${PROTO_DIR}`);
  process.exit(1);
}

const protoFiles = getAllProtoFiles(PROTO_DIR);
if (!protoFiles.length) {
  console.error(`❌ No .proto files found under ${PROTO_DIR}`);
  process.exit(1);
}

cleanOutput(OUT_BASE);
console.log('⚙️  Generating protobuf-ts code → src');
const protoc = getProtocPath();
try {
  const cmd =   [
    protoc,
    `--proto_path=${PROTO_DIR}`,
    `--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts`,
    `--ts_out=${OUT_BASE}`,
    `--ts_opt=ts_nocheck,eslint_disable,generate_dependencies`,
    ...protoFiles,
  ].join(' ');
  execSync(cmd, { stdio: 'inherit' });
  } catch (error) {
  console.error(`❌ Error: ${error}`);
  process.exit(1);
}
console.log(`✅ Proto code generated in ${OUT_BASE}`);
