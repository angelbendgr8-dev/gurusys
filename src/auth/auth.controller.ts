import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  EmailOtpDto,
  LoginUserDto,
  MobileOtpDto,
  PreAuthDto,
  ResetPasswordDto,
  SocialLoginDto,
  VerifyEmailOtpDto,
  VerifyMobileOtpDto,
  VerifyOtpDto,
} from './dto/auth.dto';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOperation,
  ApiPreconditionFailedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiGeneralCreatedResponse,
  ApiGeneralResponse,
  CreateResponse,
} from '../common/dtos/createuser.response';
import {
  GeneralResponse,
  OTPResponse,
  OTPVerifiedResponse,
} from '../common/dtos/otpgen.response';
import { LocalAuthGuard } from './local-auth.guard';
@ApiTags('auth')
@Controller('auth')
@ApiExtraModels(GeneralResponse)
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Log's user in",
  })
  @Post('/login')
  @ApiGeneralResponse(CreateResponse)
  login(@Body() loginDto: LoginUserDto, @Req() req) {
    const { user } = req;
    console.log(user);
    return this.authService.login(user);
  }

  @Post('social/login')
  @ApiGeneralResponse(CreateResponse)
  socialLogin(@Body() loginDto: SocialLoginDto, @Req() req) {
    return this.authService.socialLogin(loginDto);
  }

  @ApiOperation({
    summary: 'Login user in using social login',
  })
  @ApiGeneralCreatedResponse(CreateResponse)
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @Post('/create/account')
  async createAccount(
    @Body() data: CreateUserDto,
  ): Promise<GeneralResponse<CreateResponse>> {
    // console.log(data);
    return await this.authService.createUser(data);
  }


  @Post('change/password')
  @ApiGeneralResponse(GeneralResponse)
  @ApiPreconditionFailedResponse({
    description: 'Unable to verify otp code',
    type: String,
  })
  changePassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.changePassword(resetPasswordDto);
  }
}
