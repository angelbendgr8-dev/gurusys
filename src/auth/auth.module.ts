import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from 'src/mail/mail.module';
import { EmailOtp, EmailOtpSchema } from './schemas/email_otp.schema';
import { MobileOtp, MobileOtpSchema } from './schemas/mobile_otp.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { LocalStrategy } from './local.auth';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailOtp.name, schema: EmailOtpSchema },
      { name: MobileOtp.name, schema: MobileOtpSchema },
      { name: User.name, schema: UserSchema },
    ]),
    UsersModule,
    PassportModule,
    ConfigModule.forRoot(),
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
