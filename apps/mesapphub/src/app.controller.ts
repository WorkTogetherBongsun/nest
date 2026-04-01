import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect('/swagger', 302)
  @ApiExcludeEndpoint()
  getHello(): string {
    return this.appService.getHello();
  }
}
