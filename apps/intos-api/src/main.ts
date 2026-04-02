import { NestFactory } from '@nestjs/core';
import { IntosApiModule } from './intos-api.module';
import { configureSharedCore, getSharedLogger } from '@app/shared-core';

async function bootstrap() {
  const app = await NestFactory.create(IntosApiModule, {
    rawBody: true,
    logger: getSharedLogger('intos-api'),
  });

  await configureSharedCore(app, {
    title: 'Intos App API',
    description: '인토스 앱서비스 전용 API 문서',
    defaultPort: 5109,
  });
}
bootstrap();
