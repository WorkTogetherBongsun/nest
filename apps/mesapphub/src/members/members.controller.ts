import { Controller, Get, Param } from '@nestjs/common';
import { MembersService } from './members.service';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get(':id')
  async getMember(@Param('id') id: string) {
    return await this.membersService.getMember(+id);
  }
}
