import { Member } from '../entities/member.entity';

export const IMemberRepositoryToken = Symbol('IMemberRepository');

export interface IMemberRepository {
  findById(id: number): Promise<Member | null>;
  save(member: Member): Promise<Member>;
}
