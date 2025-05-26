import { AppModule } from '@/app.module';
import { ReflectionService } from '@grpc/reflection';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';
import { dirname, join, resolve } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const basePath = resolve(dirname(require.resolve('@fullstack-monorepo/grpc/package.json')), 'proto');

function protoPath(packageName: string, protoName: string, splitPath: boolean = false): string {
  const segments = splitPath
    ? packageName.split('.')
    : [packageName];
  return join(basePath, ...segments, `${protoName}.proto`);
}

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: ['hello', 'grpc.health.v1'],
        protoPath: [
          protoPath('hello', 'hello'),
          protoPath('grpc.health.v1', 'health'),
        ],
        url: '0.0.0.0:50051',
        loader: {
          includeDirs: [basePath],
        },
        onLoadPackageDefinition: (pkg, server) => {
          new ReflectionService(pkg).addToServer(server);
        },
      },
    }
  );
  app.useLogger(process.env.NODE_ENV && process.env.NODE_ENV !== 'production'
    ? ['log', 'error', 'warn', 'debug', 'verbose', 'fatal']
    : ['log', 'error', 'fatal'])


  await app.listen();
}

bootstrap()
  .then(() => logger.log('App started and listening on: 0.0.0.0:50051'))
  .catch((e: Error) => logger.error(e.message));
