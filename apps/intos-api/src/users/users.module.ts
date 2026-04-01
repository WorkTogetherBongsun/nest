import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { IUserRepositoryToken } from './interfaces/i-user.repository';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: IUserRepositoryToken,
      useClass: UsersRepository,
    },
  ],
})
export class UsersModule {}
