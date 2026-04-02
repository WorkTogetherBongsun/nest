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

  // ✨ 테스트를 위해 멤버 생성(저장) 로직 추가
  async createMember(name: string): Promise<Member> {
    const newMember = new Member();
    newMember.name = name;
    
    // 비즈니스 로직(예: 중복 검사 등) 수행 후 레포지토리에 저장 요청
    return await this.memberRepository.save(newMember);
  }
}
