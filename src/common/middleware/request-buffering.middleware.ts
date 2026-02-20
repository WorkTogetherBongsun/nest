import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestBufferingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // NestJS의 rawBody: true 설정으로 이미 req['rawBody']에 버퍼가 담겨있을 수 있습니다.
    // 만약 그렇지 않은 환경을 대비하여 명시적으로 버퍼링 로직을 구현합니다.
    if (req.body && Object.keys(req.body).length > 0) {
      // 이미 body-parser 등에 의해 파싱된 경우, 다시 버퍼로 변환하여 보관
      req['bufferedBody'] = Buffer.from(JSON.stringify(req.body));
    }
    
    // 원본 rawBody가 있다면 이를 활용할 수 있게 연결
    if (req['rawBody']) {
      req['bufferedBody'] = req['rawBody'];
    }

    next();
  }
}
