import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  @Transform(params => params.value.toLocaleLowerCase())
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  mobileNumber: string;

  @ApiProperty()
  @IsString()
  password: string;
}
export class SocialLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
  @ApiProperty({ type: String, enum: ['normal', 'google', 'facebook'] })
  @IsEnum(['normal', 'google', 'facebook'])
  @IsNotEmpty()
  socialType: string;
}
export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}
export class PreAuthDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Transform(params => params.value.toLocaleLowerCase())
  username: string;

  @IsString()
  @ApiProperty()
  type: string;
}
export class MobileOtpDto {
  @ApiProperty()
  @IsString()
  mobileNumber: string;

  @ApiProperty()
  @IsString()
  country: string;
}
export class EmailOtpDto {
  @ApiProperty()
  @IsString()
  @Transform(params => params.value.toLocaleLowerCase())
  email: string;
}
export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  otpCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  otpHash: string;
}
export class VerifyEmailOtpDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Transform(params => params.value.toLocaleLowerCase())
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  otpCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  otpHash: string;
}
export class VerifyMobileOtpDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  mobileNumber: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  otpCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  otpHash: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @Transform(params => params.value.toLocaleLowerCase())
  username: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}
