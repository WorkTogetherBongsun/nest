import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IMemberRepository } from './interfaces/i-member.repository';
import { Member } from './entities/member.entity';

@Injectable()
export class MembersRepository implements IMemberRepository {
  constructor(
    @InjectRepository(Member)
    private readonly typeOrmRepository: Repository<Member>,
  ) {}

  async findById(id: number): Promise<Member | null> {
    const member = await this.typeOrmRepository.findOne({ where: { id } });
    console.log(`[Repository] DB에서 ID ${id} 조회 결과:`, member);
    return member;
  }

  async save(member: Member): Promise<Member> {
    const savedMember = await this.typeOrmRepository.save(member);
    console.log('[Repository] DB에 새 멤버 저장 성공:', savedMember);
    return savedMember;
  }
}
