import { Injectable, Inject } from '@nestjs/common';
import { type IUserRepository, IUserRepositoryToken } from './interfaces/i-user.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
  ) {}

  async getUser(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('유저를 찾을 수 없습니다.');
    }
    return user;
  }
}
