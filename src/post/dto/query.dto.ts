import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class QueryDto {
  @ApiProperty({
    type: Number,
    required: false,
    description: 'Page number for paginated results',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({
    type: Number,
    required: false,
    description: 'Number of items per page in paginated results',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  perPage?: number;

  @ApiProperty({
    type: String,
    required: false,
    description: 'name or keyword to search for',
  })
  @IsOptional()
  @IsString()
  keyword?: string;

}
