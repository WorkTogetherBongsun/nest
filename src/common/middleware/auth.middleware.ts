import { Injectable, NestMiddleware, Logger, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    private readonly logger = new Logger('Auth');

    use(req: Request, res: Response, next: NextFunction) {
        const { rawBody } = req as any;

        // 예시: 특정 헤더가 없거나 바디를 읽는 인증 로직
        this.logger.log('AuthMiddleware working... Reading rawBody for signature verification');

        if (rawBody) {
            const bodyString = rawBody.toString('utf-8');
            // 실제로는 여기서 HMAC 검증 등을 수행할 수 있습니다.
            this.logger.log(`Secondary read of body (length: ${bodyString.length})`);
        }

        next();
    }
}
