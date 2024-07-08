import { ApiProperty } from '@nestjs/swagger';

export class OTPResponse {
  @ApiProperty()
  otpHash: string;
}
export class OTPVerifiedResponse {
  @ApiProperty()
  verified: string;
}
export class GeneralResponse<TData> {
  @ApiProperty()
  message: string;
  @ApiProperty()
  code: number;
  @ApiProperty()
  status: string;

  data: TData;
}
