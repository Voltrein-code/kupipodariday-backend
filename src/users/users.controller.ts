import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';

import { Request } from 'express';
import safeUserSelect from 'src/utils/safeUserSelect';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('find')
  @HttpCode(201)
  findMany(@Body() findUserDto: FindUserDto) {
    const { email, username } = findUserDto;
    return this.usersService.findMany({
      where: [{ email }, { username }],
    });
  }

  @Get('me')
  findMe(@Req() req: Request) {
    return this.usersService.findOne({
      where: { id: req.user.id },
      select: safeUserSelect,
    });
  }

  @Get('me/wishes')
  async getMeWishes(@Req() req: Request) {
    return (
      await this.usersService.findOne({
        where: { id: req.user.id },
        relations: ['wishes'],
      })
    ).wishes;
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findOne({ where: { username } });
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string) {
    return (
      await this.usersService.findOne({
        where: { username },
        relations: ['wishes'],
      })
    ).wishes;
  }

  @Patch('me')
  async update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(req.user, updateUserDto);
    delete user.password;

    return user;
  }
}
