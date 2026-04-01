import { Module } from '@nestjs/common';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { MembersRepository } from './members.repository';
import { IMemberRepositoryToken } from './interfaces/i-member.repository';

@Module({
  controllers: [MembersController],
  providers: [
    MembersService,
    {
      provide: IMemberRepositoryToken,
      useClass: MembersRepository,
    },
  ],
})
export class MembersModule {}
