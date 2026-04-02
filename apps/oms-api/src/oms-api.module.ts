import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      ignoreEnvFile: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging',
    }),
    UsersModule,
  ],
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
