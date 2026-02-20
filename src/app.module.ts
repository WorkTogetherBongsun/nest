import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { RequestBufferingMiddleware } from './common/middleware/request-buffering.middleware';
import { IServiceStorageService } from './common/services/i-service-storage.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService, 
    IServiceStorageService,
    // Exception Handler는 NestJS Global Filter로 자동 처리되거나 
    // 여기에 추가적인 필터를 등록할 수 있습니다.
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        LoggerMiddleware, 
        RequestBufferingMiddleware, 
        AuthMiddleware
      )
      .forRoutes('*');
  }
}
