import {
  ConflictException,
  Injectable, NotFoundException
} from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { isEmpty } from 'lodash';
// import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { formatedResponse } from 'src/utils/helpers';

import * as bcrypt from 'bcrypt';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PaginatorService } from 'src/paginator/paginator.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private usersRepository: Model<UserDocument>,
    private cloudinaryService: CloudinaryService,
    private paginator: PaginatorService
  ) {}

  async findUserById(userId: string): Promise<UserDocument> {
    return await this.usersRepository.findOne({ _id: userId });
  }
  
  async findUserByEmail(email: string): Promise<UserDocument> {
    return await this.usersRepository.findOne({ email: email });
  }
  async findUserByMobileNumber(mobileNumber: string): Promise<UserDocument> {
    return await this.usersRepository.findOne({ mobileNumber: mobileNumber });
  }
  async createUser(userInfo: any): Promise<UserDocument> {
    const user = await this.usersRepository.findOne({
      email: userInfo.email,
    });
    if (isEmpty(user)) {
      const user = {
        ...userInfo,
        email: userInfo.email.toLocaleLowerCase(),
        password: await this.encryptPassword(userInfo.password),
      };
      const newUser = await this.usersRepository.create(user);
      return newUser;
    } else {
      throw new ConflictException('user with email already exists');
    }
  }
  async validateUser(username: string, authType: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      email: username.trim().toLocaleLowerCase(),
    });
    if (!isEmpty(user))
      throw new NotFoundException(
        `A user already exists with this email address`,
      );
    return formatedResponse('Email available', 200, 'success', {});
  }

  async updateUserProfileInfo(data: any, user: any) {
    const userInfo = await this.usersRepository
      .findOne({ _id: user._id })
      .select('-password');
    console.log(data);

    const updatedUserInfo = await this.usersRepository
      .findOneAndUpdate({ _id: user._id }, { ...data }, { new: true })
      .select('-password');
    return formatedResponse(
      'User profile details updated successfully',
      200,
      'success',
      updatedUserInfo,
    );
  }
  async updateUserFCMToken(data: any, user: any) {
    const userInfo = await this.usersRepository
      .findOne({ _id: user._id })
      .select('-password');
    console.log(data);

   await this.usersRepository
      .findOneAndUpdate({ _id: user._id }, { fcmToken: data.fcm_token }, { new: true })
      .select('-password');
    return formatedResponse(
      'User token updated successfully',
      200,
      'success',{}
    );
  }
  // async updateUserProfilePics(file: any, user: any) {
  //   const uploadResponse = await this.cloudinaryService.uploadImage(
  //     file,
  //     'userProfiles',
  //   );
  //   const { secure_url } = uploadResponse;
  //   const userInfo = await this.usersRepository
  //     .findOne({ _id: user.id })
  //     .select('-password');
  //   userInfo.profilePics = secure_url;
  //   await userInfo.save();
  //   const updatedUser = await this.usersRepository
  //     .findOne({ _id: user.id })
  //     .select('-password');
  //   return formatedResponse(
  //     'User profile picture updated successfully',
  //     200,
  //     'success',
  //     updatedUser,
  //   );
  // }

  
  async disableAccount(user: any) {
    const userInfo = this.usersRepository.findOneAndUpdate(
      user?._id,
      { isActive: false },
      { new: true },
    );

    return formatedResponse(
      'User account deactivated successfully',
      200,
      'success',
      {},
    );
  }
  async encryptPassword(password): Promise<string> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    return hash;
  }
}
