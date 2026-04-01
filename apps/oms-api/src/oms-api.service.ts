import { Injectable } from '@nestjs/common';

@Injectable()
export class OmsApiService {
  getHello(): string {
    return 'Hello World!';
  }
}
