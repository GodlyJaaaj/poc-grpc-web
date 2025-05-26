import { HealthController } from '@/health.controller';
import { HelloController } from '@/hello.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [HealthController, HelloController],
})
export class AppModule {}