import { IUser } from '../user/user.interface';

export type ILoginUser = { email: string; password: string };

export type ILoginUserResponse = {
  accessToken: string;
  refreshToken?: string;
  userInfo: Omit<IUser, 'password'>;
};

export type IRefreshTokenResponse = {
  accessToken: string;
};
