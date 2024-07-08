import { Body, Controller, Get, HttpStatus, Patch, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { formatedResponse } from 'src/utils/helpers';
import { User } from './schemas/user.schema';
import { ApiGeneralResponse } from 'src/common/dtos/createuser.response';
import { UpdateUserFcmTokenDto, UpdateUserInfoDto } from './dtos/profile.dto';
import { UserService } from './users.service';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('users')
@ApiBearerAuth()
@ApiTags('users')
export class UsersController {
  constructor(private userService: UserService) {}

  @Get('/get/info')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'fetches the data of the currently authenticated user',
  })
  @ApiGeneralResponse(User)
  async getUserInfo(@Req() req) {
    return formatedResponse(
      'User information fetched successfully',
      HttpStatus.OK,
      'success',
      req.user,
    );
  }

 
  @Post('/update/profile/pics')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'updates the profile picture of the currently authenticated user',
  })
  // @ApiGeneralResponse(User)
  // async updateProfilePics(@Body() data: UpdateUserPicsDto, @Req() req) {
  //   console.log(data.file);
  //   const { user } = req;
  //   return this.userService.updateUserProfilePics(data.file, user);
  // }
  @Post('/update/profile/info')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'updates the info of the current user',
  })
  @ApiGeneralResponse(User)
  async updateProfileInfo(@Body() data: UpdateUserInfoDto, @Req() req) {
    const { user } = req;
    return this.userService.updateUserProfileInfo(data, user);
  }

  @Post('/update/push/token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'updates the info of the current user',
  })
  @ApiGeneralResponse(User)
  async updatePushToken(@Body() data: UpdateUserFcmTokenDto, @Req() req) {
    const { user } = req;
    return this.userService.updateUserFCMToken(data, user);
  }

  @Patch('/deactivate/')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'disable user account',
  })
  @ApiGeneralResponse(User)
  async disableAccount(@Req() req) {
    const { user } = req;
    return this.userService.disableAccount(user);
  }
}
