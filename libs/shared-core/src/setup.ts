import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';

export interface SharedCoreOptions {
  title: string;
  description: string;
  defaultPort: number;
}

export async function configureSharedCore(
  app: INestApplication,
  options: SharedCoreOptions,
) {
  const logger = new Logger('Bootstrap');

  // 1. Built-in: Forwarded Headers (Proxy trust)
  const server = app.getHttpAdapter().getInstance();
  server.set('trust proxy', 1);

  // 2. Built-in Middleware: CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // 3. Security & Performance Middleware
  app.use(helmet());
  app.use(compression());

  // 4. Built-in: Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 5. Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle(options.title)
    .setDescription(options.description)
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // 6. Start Server
  const port = process.env.PORT ?? options.defaultPort;
  await app.listen(port);

  // 7. Log Environment Information
  const env = process.env.NODE_ENV || 'development';
  logger.log(`===============================================`);
  logger.log(`🌱 Environment     : ${env.toUpperCase()}`);
  logger.log(`🗄️  Database Target: [${process.env.DB_USER}]@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
  logger.log(`🚀 Application Port: http://localhost:${port}`);
  logger.log(`📖 Swagger API Docs: http://localhost:${port}/swagger`);
  logger.log(`===============================================`);
}
