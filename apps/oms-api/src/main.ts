import { NestFactory } from '@nestjs/core';
import { OmsApiModule } from './oms-api.module';
import { configureSharedCore } from '@app/shared-core';

async function bootstrap() {
  const app = await NestFactory.create(OmsApiModule, {
    rawBody: true,
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  await configureSharedCore(app, {
    title: '학회 OMS API',
    description: '학회 통합 주문 관리 시스템 API 문서',
    defaultPort: 5108,
  });
}
bootstrap();
