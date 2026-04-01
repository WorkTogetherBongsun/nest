import { Test, TestingModule } from '@nestjs/testing';
import { OmsApiController } from './oms-api.controller';
import { OmsApiService } from './oms-api.service';

describe('OmsApiController', () => {
  let omsApiController: OmsApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OmsApiController],
      providers: [OmsApiService],
    }).compile();

    omsApiController = app.get<OmsApiController>(OmsApiController);
  });

  describe('root', () => {
    it('should return undefined because of redirect', () => {
      expect(omsApiController.getHello()).toBeUndefined();
    });
  });
});
