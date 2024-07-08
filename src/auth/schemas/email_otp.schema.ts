import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class EmailOtp {
  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  otpCode: string;

  @Prop({ type: Boolean, default: false })
  default: boolean;

  @Prop({ type: Date, expires: '3m', default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const EmailOtpSchema = SchemaFactory.createForClass(EmailOtp);
