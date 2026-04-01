import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { OmsApiController } from './oms-api.controller';
import { OmsApiService } from './oms-api.service';
import {
  LoggerMiddleware,
  AuthMiddleware,
  RequestBufferingMiddleware,
  IServiceStorageService
} from '@app/shared-core';

@Module({
  imports: [],
  controllers: [OmsApiController],
  providers: [
    OmsApiService, 
    IServiceStorageService,
  ],
})
export class OmsApiModule implements NestModule {
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
