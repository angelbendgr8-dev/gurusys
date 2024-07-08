import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class MobileOtp {
  @Prop({ type: String })
  mobileNumber: string;

  @Prop({ type: String })
  otpCode: string;

  @Prop({ type: Boolean, default: false })
  default: boolean;

  @Prop({ type: Date, expires: '3m', default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const MobileOtpSchema = SchemaFactory.createForClass(MobileOtp);
