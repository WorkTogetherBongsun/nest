import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { MembersRepository } from './members.repository';
import { IMemberRepositoryToken } from './interfaces/i-member.repository';
import { Member } from './entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
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
