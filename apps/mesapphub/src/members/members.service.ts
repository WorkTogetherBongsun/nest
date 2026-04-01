import { Injectable, Inject } from '@nestjs/common';
import { type IMemberRepository, IMemberRepositoryToken } from './interfaces/i-member.repository';
import { Member } from './entities/member.entity';

@Injectable()
export class MembersService {
  constructor(
    @Inject(IMemberRepositoryToken)
    private readonly memberRepository: IMemberRepository,
  ) {}

  async getMember(id: number): Promise<Member> {
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new Error('사원을 찾을 수 없습니다.');
    }
    return member;
  }
}
