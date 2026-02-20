import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IServiceStorageService } from '../services/i-service-storage.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly storageService: IServiceStorageService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      // 인증 헤더가 없는 경우 로직 (필요에 따라 에러 처리 혹은 통과)
      return next();
    }

    try {
      // 서비스 레이어를 통해 토큰 검증 및 유저 정보 추출
      const context = this.storageService.validateToken(authHeader as string);
      
      // 요청 객체(Request Context)에 인증 정보 첨부
      req['userContext'] = context;
      
      next();
    } catch (err) {
      throw new UnauthorizedException('인증에 실패했습니다.');
    }
  }
}
