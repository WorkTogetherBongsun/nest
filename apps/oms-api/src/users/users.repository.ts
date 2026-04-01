import { Injectable } from '@nestjs/common';
import { IUserRepository } from './interfaces/i-user.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository implements IUserRepository {
  async findById(id: number): Promise<User | null> {
    console.log(`DB에서 OMS 유저를 조회합니다 (ID: ${id})`);
    return { id, name: '학회 OMS 담당자' };
  }

  async save(user: User): Promise<User> {
    console.log('DB에 OMS 유저를 저장합니다');
    return user;
  }
}
