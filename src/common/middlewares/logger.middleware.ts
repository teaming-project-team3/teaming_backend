import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(
      `Connect || ${req.method} ${
        req.originalUrl
      } || ${new Date().toLocaleString('ko-KR')}`,
    );

    res.on('finish', () => {
      this.logger.log(
        `Finish || ${req.method} ${req.originalUrl} || ${res.statusCode} ||  ${req.ip} `,
      );
    });
    next();
  }
}
