import { Test, TestingModule } from '@nestjs/testing';
import { IntosApiController } from './intos-api.controller';
import { IntosApiService } from './intos-api.service';

describe('IntosApiController', () => {
  let intosApiController: IntosApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [IntosApiController],
      providers: [IntosApiService],
    }).compile();

    intosApiController = app.get<IntosApiController>(IntosApiController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(intosApiController.getHello()).toBe('Hello World!');
    });
  });
});
