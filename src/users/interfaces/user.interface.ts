import { Types } from 'mongoose';
import { User } from 'src/common/interfaces/user.interface';

export interface UserType {
  _id: string | Types.ObjectId;
  name: string;
  email: number;
  mobileNumber?: string;
  emailVerified?: boolean;
  mobileVerified?: boolean;
}

export interface RequestWithUser extends Request {
  user: User;
}

