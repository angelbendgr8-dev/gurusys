import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { HasMimeType, IsFile, MemoryStoredFile } from 'nestjs-form-data';

export class UpdateUserInfoDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  dateOfBirth: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  username: string;
}
export class UpdateUserFcmTokenDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  fcm_token: string;
}
export class UpdateUserPicsDto {
  @ApiProperty()
  @IsFile()
  @HasMimeType(['image/jpeg', 'image/png', 'image/jpg'])
  file: MemoryStoredFile;
}
export class updateTransactionPinDto {
  @ApiProperty()
  @IsString()
  oldPin: string;

  @ApiProperty()
  @IsString()
  newPin: string;
}
export class CardIdDto {
  @ApiProperty()
  @IsString()
  cardId: string;
}
