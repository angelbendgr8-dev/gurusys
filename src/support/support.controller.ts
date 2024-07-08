import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { GeneralResponse } from 'src/responses/general.responses';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('support')
@ApiTags('/support')
@ApiExtraModels(GeneralResponse)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  create(@Body() createSupportDto: CreateSupportDto, @Request() req) {
    const {user} = req;
    return this.supportService.create(createSupportDto,user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() query: any,@Request() req) {
    const {user} = req;
    return this.supportService.findAll(query,user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supportService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSupportDto: UpdateSupportDto) {
    return this.supportService.update(+id, updateSupportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supportService.remove(+id);
  }
}
