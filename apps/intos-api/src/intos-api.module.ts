import { Module } from '@nestjs/common';
import { IntosApiController } from './intos-api.controller';
import { IntosApiService } from './intos-api.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [IntosApiController],
  providers: [IntosApiService],
})
export class IntosApiModule {}
