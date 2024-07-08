export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: number;
  mobileNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  emailVerified?: boolean;
  mobileVerified?: boolean;
  transPin?: string;
  authType: string;
  postalAddress?: string;
  username?: string;
  profilePics?: string;
  isVerified?: boolean;
  isActive?: boolean;
}
