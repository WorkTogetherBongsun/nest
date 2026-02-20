import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

export interface AuthContext {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class IServiceStorageService {
  private readonly logger = new Logger(IServiceStorageService.name);

  // 실제 운영 환경에서는 jsonwebtoken 라이브러리 등을 사용하여 검증합니다.
  // 여기서는 학습을 위해 로직의 흐름을 구현합니다.
  validateToken(token: string): AuthContext {
    try {
      this.logger.log('JWT 토큰 검증 시도 중...');
      
      // Bearer 접두사 제거
      const pureToken = token.replace('Bearer ', '');
      
      // 간단한 디코딩 예시 (학습용 시뮬레이션)
      // 실제 구현 시: return jwt.verify(pureToken, secretKey);
      if (pureToken === 'expired-token') {
        throw new Error('Token expired');
      }

      // 임시 유저 정보 반환
      return {
        userId: 'user_12345',
        role: 'admin',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };
    } catch (err) {
      this.logger.error(`토큰 검증 실패: ${err.message}`);
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }
}
