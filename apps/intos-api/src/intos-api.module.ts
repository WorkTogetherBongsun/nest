import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IntosApiController } from './intos-api.controller';
import { IntosApiService } from './intos-api.service';
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
  controllers: [IntosApiController],
  providers: [IntosApiService],
})
export class IntosApiModule {}
