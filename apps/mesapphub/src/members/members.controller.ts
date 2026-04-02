import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MembersService } from './members.service';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  // POST /members
  @Post()
  async createMember(@Body('name') name: string) {
    return await this.membersService.createMember(name);
  }

  // GET /members/:id
  @Get(':id')
  async getMember(@Param('id') id: string) {
    return await this.membersService.getMember(+id);
  }
}
