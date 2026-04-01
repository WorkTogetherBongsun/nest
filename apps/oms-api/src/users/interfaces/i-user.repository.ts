import { User } from '../entities/user.entity';

export const IUserRepositoryToken = Symbol('IUserRepository');

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  save(user: User): Promise<User>;
}
