import type { StringValue } from '@fullstack-monorepo/grpc/google/protobuf/wrappers';
import type { HelloMessage } from '@fullstack-monorepo/grpc/hello/hello';
import { GrpcMethod, GrpcService } from '@nestjs/microservices';

@GrpcService()
export class HelloController {

  @GrpcMethod('HelloService', 'SayMeHello')
  public async sayMeHello(data: StringValue): Promise<HelloMessage> {
    return {
      response: `Hello ${data.value}`,
    };
  }
}
