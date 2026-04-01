import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { IntosApiService } from './intos-api.service';

@Controller()
export class IntosApiController {
  constructor(private readonly intosApiService: IntosApiService) {}

  @Get()
  @Redirect('/swagger', 302)
  @ApiExcludeEndpoint()
  getHello() {
    return;
  }
}
