import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  PreconditionFailedException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  CreateUserDto,
  MobileOtpDto,
  PreAuthDto,
  ResetPasswordDto,
  SocialLoginDto,
  VerifyEmailOtpDto,
  VerifyMobileOtpDto,
  VerifyOtpDto,
} from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { isEmpty } from 'lodash';
import { MailService } from 'src/mail/mail.service';
import { formatedResponse } from 'src/utils/helpers';
import { EmailOtp } from './schemas/email_otp.schema';
import { MobileOtp } from './schemas/mobile_otp.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { otp_template } from 'src/mail/templates/otp.template';
import { UserService } from 'src/users/users.service';
import { User } from 'src/users/schemas/user.schema';
import { generateUsername } from 'unique-username-generator';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private mailService: MailService,
    @InjectModel(MobileOtp.name)
    private mobileOtpRepository: Model<MobileOtp>,
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(EmailOtp.name)
    private emailOtpRepository: Model<EmailOtp>,
  ) {}

  
  async login(user: any): Promise<any> {
    return this.signIn(user, 'Login successful');
  }

  generateJwt(payload) {
    return this.jwtService.sign(payload);
  }

  async validateUser(data: CreateUserDto): Promise<any> {
    let user;
    if (!isEmpty(data?.email)) {
      user = await this.userService.findUserByEmail(data.email);
      if (!isEmpty(user))
        throw new ConflictException(`User with ${data.email} already exists`);
    } else {
      user = await this.userService.findUserByMobileNumber(data.mobileNumber);
      if (!isEmpty(user))
        throw new ConflictException(
          `User with ${data.mobileNumber} already exists`,
        );
    }

    return;
  }

  async signIn(user, message: string) {
    const token = this.generateJwt({
      sub: user.id,
      email: user.email,
    });
    console.log('here')
    return formatedResponse(message, HttpStatus.CREATED, 'success', {
      user: user,
      token: token,
    });
  }
  async socialLogin(loginData: SocialLoginDto) {
    const user = await this.userService.validateUser(
      loginData.email,
      loginData.socialType,
    );

    return this.signIn(user, 'Login successful');
  }
  async validateUserWithPassword(
    username: string,
    password: string,
  ): Promise<any> {
    const user = await this.userModel.findOne({
      $or: [
        { email: username.trim().toLocaleLowerCase() },
        { mobileNumber: username.trim().toLocaleLowerCase() },
      ],
    });
    if (isEmpty(user)) throw new NotFoundException(`User does not exist`);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new UnauthorizedException('Invalid authentication credentials');
    const result = await this.userModel
      .findOne({
        $or: [
          { email: username.trim().toLocaleLowerCase() },
          { mobileNumber: username.trim().toLocaleLowerCase() },
        ],
      })
      .select('-password -authType');
    return result;
  }
  async generateHash(value: string): Promise<string> {
    const sPin = await bcrypt.hash(value, 10);
    return sPin;
  }
  async createUser(userInfo: CreateUserDto): Promise<any> {
    await this.validateUser(userInfo);
    const user = await this.userModel.create({
      ...userInfo,
      username: await this.generateUniqueUsername(),
      password: await this.userService.encryptPassword(userInfo.password)
    });

    const token = this.generateJwt({
      sub: user.id,
      email: user.email,
    });
    return formatedResponse(
      'User Created successfully',
      HttpStatus.CREATED,
      'success',
      {
        user: user,
        token: token,
      },
    );
  }
  async emailExist(email: string): Promise<any> {
    const userExists = await this.userService.findUserByEmail(email);
    if (userExists) {
      return userExists;
    }
    return null;
  }
  async mobileNumberExist(email: string): Promise<any> {
    const userExists = await this.userService.findUserByMobileNumber(email);
    if (userExists) {
      return userExists;
    }
    return false;
  }

  async sendEmailOtpToNewUser(email: string): Promise<any> {
    const { otpHash, otpCode } = await this.generateOtp(8);
    const otpData = {
      otpCode,
      email: email,
    };
    await this.emailOtpRepository.create(otpData);

    const messageData = {
      otpCode: otpCode,
    };
    await this.mailService.sendBulkEmails(
      otp_template,
      email,
      messageData,
      'One time verification code',
    );
    return formatedResponse('Otp sent successfully', 200, 'success', {
      otpHash,
    });
  }
  async sendEmailOtp(email: string): Promise<any> {
    const user = await this.emailExist(email);
    if (isEmpty(user)) {
      throw new NotFoundException('User with email ' + email + ' not found');
    }
    const { otpHash, otpCode } = await this.generateOtp(8);
    const messageData = {
      otpCode: otpCode,
    };

    const otpData = {
      otpCode,
      email: email,
    };
    await this.emailOtpRepository.create(otpData);

    await this.mailService.sendBulkEmails(
      otp_template,
      email,
      messageData,
      'One time verification code',
    );
    return formatedResponse('Otp sent successfully', 200, 'success', {
      otpHash,
    });
  }


  async generateOtp(
    number: number,
  ): Promise<{ otpHash: string; otpCode: string }> {
    const otpCode = Math.random().toString().substring(2, number);
    const otpHash = await bcrypt.hash(otpCode, 10);
    return { otpHash, otpCode };
  }

  async verifyOtp(data: VerifyOtpDto): Promise<any> {
    const isOptMatching = await bcrypt.compare(data.otpCode, data.otpHash);
    if (isOptMatching) {
      return formatedResponse(
        'Otp verified successfully',
        200,
        'success',
        true,
      );
    } else {
      throw new PreconditionFailedException(`verification failed`, {
        cause: new Error(),
        description: 'Invalid otp code',
      });
    }
  }
  async verifyMobileOtp(data: VerifyMobileOtpDto): Promise<any> {
    const otp = await this.mobileOtpRepository.findOne({
      mobileNumber: data.mobileNumber,
    });
    if (isEmpty(otp)) throw new NotAcceptableException('Otp token has expired');

    const isOptMatching = await bcrypt.compare(data.otpCode, data.otpHash);
    if (isOptMatching) {
      await this.mobileOtpRepository
        .findOneAndDelete()
        .where({ mobileNumber: data.mobileNumber });
      return formatedResponse(
        'Otp verified successfully',
        200,
        'success',
        true,
      );
    } else {
      throw new PreconditionFailedException(`verification failed`, {
        cause: new Error(),
        description: 'Invalid otp code',
      });
    }
  }
  async verifyEmailOtp(data: VerifyEmailOtpDto): Promise<any> {
    const otp = await this.emailOtpRepository.findOne({ email: data.email });
    if (isEmpty(otp)) throw new NotAcceptableException('Otp token has expired');

    const isOptMatching = await bcrypt.compare(data.otpCode, data.otpHash);
    if (isOptMatching) {
      await this.emailOtpRepository.findOneAndDelete({ email: data.email });
      return formatedResponse(
        'Otp verified successfully',
        200,
        'success',
        true,
      );
    } else {
      throw new PreconditionFailedException(`verification failed`, {
        cause: new Error(),
        description: 'Invalid otp code',
      });
    }
  }
  async changePassword(data: ResetPasswordDto): Promise<any> {
    const { username, type } = data;
    let user;
    if (type === 'email') {
      user = await this.emailExist(username);
    } else {
      user = await this.mobileNumberExist(username);
    }
    if (isEmpty(user)) throw new NotFoundException(`User does not exist`);

    user.password = await this.userService.encryptPassword(data.password);
    await user.save();
    return {
      message: 'password changed successful',
      data: true,
      status: 'success',
    };
  }
  private generateUniqueUsername = async () => {
    let username = await generateUsername('_');
    console.log(username);
    let found = await this.userModel.findOne({ username: username });
    while (!isEmpty(found)) {
      console.log(found);
      username = await generateUsername('_');
      found = await this.userModel.findOne({ username: username });
    }
    return username;
  };
}
