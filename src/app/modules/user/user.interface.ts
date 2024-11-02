import { Model } from 'mongoose';
import { ENUM_USER_ROLE } from '../../../enums/user';

export type UserName = {
  firstName: string;
  lastName: string;
};

export type IUser = {
  _id: string;
  role: ENUM_USER_ROLE.USER | ENUM_USER_ROLE.ADMIN;
  password: string;
  name: UserName;
  phoneNumber: string;
  email: string;
  address: string;
  avatar: string;
};

// export type UserModel = Model<IUser, Record<string, unknown>>;

export type UserModel = {
  isUserExist(email: string): Pick<IUser, '_id' | 'password' | 'role'>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<IUser>;
