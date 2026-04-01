import { Injectable } from '@nestjs/common';
import { IMemberRepository } from './interfaces/i-member.repository';
import { Member } from './entities/member.entity';

@Injectable()
export class MembersRepository implements IMemberRepository {
  async findById(id: number): Promise<Member | null> {
    console.log(`DB에서 사원 정보를 조회합니다 (ID: ${id})`);
    return { id, name: 'Sample Company Member' };
  }

  async save(member: Member): Promise<Member> {
    console.log('DB에 사원 정보를 저장합니다');
    return member;
  }
}
