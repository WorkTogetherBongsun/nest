import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true, // 엔티티 자동 스캔 (각 앱 단위로 분리)
        synchronize: configService.get<string>('NODE_ENV') !== 'production', // 운영에선 끄기
        logging: configService.get<string>('NODE_ENV') !== 'production', // 개발 모드에서 쿼리 콘솔 로깅
      }),
    }),
  ],
})
export class SharedDatabaseModule {}
