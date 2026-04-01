import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureSharedCore } from '@app/shared-core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  await configureSharedCore(app, {
    title: '사내 관리용 API',
    description: '회사 백엔드 전용 API 문서',
    defaultPort: 5107,
  });
}
bootstrap();
