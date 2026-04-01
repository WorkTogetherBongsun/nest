import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  // 1. Nest Application Create (with rawBody for signature verification)
  const app = await NestFactory.create(AppModule, { 
    rawBody: true,
    // HttpLogging & built-in logging
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // 2. Built-in: Forwarded Headers (Proxy trust)
  // Express instance access to set 'trust proxy'
  const server = app.getHttpAdapter().getInstance();
  server.set('trust proxy', 1);

  // 3. Built-in Middleware: CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // 4. Security & Performance Middleware
  app.use(helmet()); // Basic security headers
  app.use(compression()); // Response compression

  // 5. Built-in: Global Pipes (Validation / Serialization)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // 6. Swagger API Documentation (Built-in support)
  const config = new DocumentBuilder()
    .setTitle('Night Reading API')
    .setDescription('NestJS Backend learning project API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // 7. Start Server
  const port = process.env.PORT ?? 5107;
  await app.listen(port);
  
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger documentation: http://localhost:${port}/swagger`);
}
bootstrap();
