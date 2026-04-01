import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger('HTTP');

    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl, rawBody } = req as any;

        if (rawBody) {
            this.logger.log(`[Request] ${method} ${originalUrl} - Body: ${rawBody.toString('utf-8')}`);
        } else {
            this.logger.log(`[Request] ${method} ${originalUrl} - No rawBody found`);
        }

        next();
    }
}
