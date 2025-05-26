import {
  type HealthCheckRequest,
  type HealthCheckResponse,
  HealthCheckResponse_ServingStatus,
} from '@fullstack-monorepo/grpc/grpc.health.v1/health';
import { GrpcMethod, GrpcService } from '@nestjs/microservices';

@GrpcService()
export class HealthController {
  @GrpcMethod('Health', 'Check')
  check(
    data: HealthCheckRequest,
  ): HealthCheckResponse {
    // Можно проверять DB, очереди и т.п.
    return { status: HealthCheckResponse_ServingStatus.SERVING };
  }

  @GrpcMethod('Health', 'Watch')
  watch(
    data: HealthCheckRequest,
  ): HealthCheckResponse {
    // Для Watch можно просто вернуть один ответ или реализовать поток.
    return { status: HealthCheckResponse_ServingStatus.SERVING };
  }
}
