import { Injectable } from '@nestjs/common';

@Injectable()
export class IntosApiService {
  getHello(): string {
    return 'Hello World!';
  }
}
