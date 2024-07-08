import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { PageMetaDto } from './page_meta.dto';

export class PageDto<T> {
  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsNumber()
  code: number;

  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto;

  constructor(message: string, code: number, data: T[], meta: PageMetaDto) {
    this.message = message;
    this.code = code;
    this.data = data;
    this.meta = meta;
  }
}
