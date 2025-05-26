import { HelloServiceClient } from '@fullstack-monorepo/grpc/hello/hello.client';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import type { MethodInfo, NextUnaryFn, RpcOptions } from '@protobuf-ts/runtime-rpc';

const transport = new GrpcWebFetchTransport({
  baseUrl: 'http://localhost:8080/api/grpc',
  fetchInit: { credentials: 'include' },
  format: 'binary',
  timeout: 10000,
  interceptors: [
    {
      interceptUnary: (
        next: NextUnaryFn,
        method: MethodInfo,
        input: object,
        options: RpcOptions
      ) => {
        console.log(`REQUEST: ${method.name}`, input);
        const call = next(method, input, options);
        call
          .then((finishedCall) => {
            console.log(`RESPONSE: ${method.name}`, finishedCall.response);
          })
          .catch((e) => {
            const message = (e instanceof Error) ? e.message : (typeof e === 'string') ? decodeURIComponent(e) : 'Unknown error';
            console.error(`ERROR: ${method.name}: ${message}`);
          });
        return call;
      },
    },
  ],
});

export const HelloService = new HelloServiceClient(transport);
