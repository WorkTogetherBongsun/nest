import { Module } from '@nestjs/common';
import { IntosApiController } from './intos-api.controller';
import { IntosApiService } from './intos-api.service';

@Module({
  imports: [],
  controllers: [IntosApiController],
  providers: [IntosApiService],
})
export class IntosApiModule {}
