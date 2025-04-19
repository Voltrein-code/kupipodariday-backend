import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Request } from 'express';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  create(@Req() req: Request, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(createWishDto, req.user);
  }

  @Get()
  findAll() {
    return this.wishesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }

  @Get('last')
  findLast() {
    return this.wishesService.findLast();
  }

  @Get('last')
  findFirst() {
    return this.wishesService.findFirst();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req: Request,
  ) {
    return this.wishesService.update(+id, updateWishDto, req.user);
  }

  @Post(':id/copy')
  copy(@Param('id') id: string, @Req() req: Request) {
    return this.wishesService.copy(+id, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.wishesService.remove(+id, req.user);
  }
}
