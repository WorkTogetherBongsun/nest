import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export function getSharedLogger(appName: string) {
  // 사용자가 요청한 최상위 LOG 폴더
  const logDir = 'LOG';

  return WinstonModule.createLogger({
    transports: [
      // 1. 콘솔 출력 포맷 설정 (개발용)
      new winston.transports.Console({
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, context, ms }) => {
            return `[${appName}] ${process.pid}  - ${timestamp}   ${level} [${context}] ${message} ${ms}`;
          }),
        ),
      }),
      
      // 2. Info 레벨 이상의 기본 로그 파일 (매일 1개씩 생성, 압축)
      new DailyRotateFile({
        level: 'info',
        dirname: `${logDir}/${appName}/info`,
        filename: `%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,      // 지난 로그 압축
        maxSize: '20m',           // 파일 1개당 최대 20MB
        maxFiles: '14d',          // 14일치만 보관
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),

      // 3. Error 로그만 따로 모아두는 별도 파일
      new DailyRotateFile({
        level: 'error',
        dirname: `${logDir}/${appName}/error`,
        filename: `%DATE%.error.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '30d',          // 에러 로그는 30일 보관
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
    ],
  });
}
