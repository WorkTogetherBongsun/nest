import { Injectable } from '@nestjs/common';
import { IUserRepository } from './interfaces/i-user.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository implements IUserRepository {
  async findById(id: number): Promise<User | null> {
    console.log(`DB에서 인토스 앱 유저를 조회합니다 (ID: ${id})`);
    return { id, name: '앱 인토스 유저' };
  }

  async save(user: User): Promise<User> {
    console.log('DB에 인토스 앱 유저를 저장합니다');
    return user;
  }
}
