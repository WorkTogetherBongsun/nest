import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { OmsApiController } from './oms-api.controller';
import { OmsApiService } from './oms-api.service';
import {
  LoggerMiddleware,
  AuthMiddleware,
  RequestBufferingMiddleware,
  IServiceStorageService
} from '@app/shared-core';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule],
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
