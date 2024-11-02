import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { JWTHelper } from '../../../helpers/jwtHelper';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  // Check User Existence
  const isUserExist = await User.isUserExist(email);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // Check User Password
  const isPassMatched = await User.isPasswordMatched(
    password,
    isUserExist.password,
  );
  if (!isPassMatched) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password is incorrect!');
  }

  //create access & refresh token
  const { _id, role } = isUserExist;
  const accessToken = JWTHelper.createToken(
    { _id, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = JWTHelper.createToken(
    { _id, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  const userInfo = await User.findById(isUserExist._id)
    .select('-password')
    .lean();

  return {
    accessToken,
    refreshToken,
    userInfo: userInfo as ILoginUserResponse['userInfo'],
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  // Verify Token
  let verifiedToken = null;
  try {
    verifiedToken = JWTHelper.verifyToken(
      token,
      config.jwt.refresh_secret as Secret,
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { _id, role } = verifiedToken;

  const userExist = await User.findById(_id);

  if (!userExist)
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');

  const newAccessToken = JWTHelper.createToken(
    { _id: _id, role: userExist.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    accessToken: newAccessToken,
  };
};

const googleLogin = async (payload: IUser): Promise<ILoginUserResponse> => {
  const user = await User.findOne({ email: payload.email });

  if (user) {
    //create access & refresh token
    const { _id, role } = user;
    const accessToken = JWTHelper.createToken(
      { _id, role },
      config.jwt.secret as Secret,
      config.jwt.expires_in as string,
    );

    const refreshToken = JWTHelper.createToken(
      { _id, role },
      config.jwt.refresh_secret as Secret,
      config.jwt.refresh_expires_in as string,
    );

    const userInfo = await User.findById(_id).select('-password').lean();

    return {
      accessToken,
      refreshToken,
      userInfo: userInfo as ILoginUserResponse['userInfo'],
    };
  } else {
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashedPassword = bcrypt.hash(generatedPassword, 10);

    const newUser = new User({
      name: {
        firstName: payload.name.firstName,
        lastName: payload.name.lastName,
      },
      email: payload.email,
      password: hashedPassword,
      avatar: payload.avatar,
    });

    const savedUser = await newUser.save();

    const { _id, role } = savedUser;
    const accessToken = JWTHelper.createToken(
      { _id, role },
      config.jwt.secret as Secret,
      config.jwt.expires_in as string,
    );

    const refreshToken = JWTHelper.createToken(
      { _id, role },
      config.jwt.refresh_secret as Secret,
      config.jwt.refresh_expires_in as string,
    );

    const userInfo = await User.findById(_id).select('-password').lean();

    return {
      accessToken,
      refreshToken,
      userInfo: userInfo as ILoginUserResponse['userInfo'],
    };
  }
};

export const AuthService = {
  loginUser,
  refreshToken,
  googleLogin,
};
