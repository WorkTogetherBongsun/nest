import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { OmsApiService } from './oms-api.service';

@Controller()
export class OmsApiController {
  constructor(private readonly omsApiService: OmsApiService) {}

  @Get()
  @Redirect('/swagger', 302)
  @ApiExcludeEndpoint()
  getHello(): string {
    return this.omsApiService.getHello();
  }
}
