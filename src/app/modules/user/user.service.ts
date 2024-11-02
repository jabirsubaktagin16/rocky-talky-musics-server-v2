import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { IGenericResponse } from '../../../interfaces/common';
import { IUser } from './user.interface';
import { User } from './user.model';

const createUser = async (user: IUser): Promise<IUser | null> => {
  const createdUser = await User.create(user);

  if (!createdUser) {
    throw new Error('Failed to create user!');
  }
  return createdUser;
};

const getAllUsers = async (): Promise<IGenericResponse<IUser[]>> => {
  const result = await User.find();

  return {
    data: result,
  };
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  return result;
};

const updateUser = async (
  id: string,
  payload: Partial<IUser>,
): Promise<IUser | null> => {
  const isExist = await User.findOne({ _id: id });

  if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  const { name, ...userData } = payload;

  const updatedUserData: Partial<IUser> = { ...userData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}`;
      (updatedUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await User.findOneAndUpdate({ _id: id }, updatedUserData, {
    new: true,
  });
  return result;
};

const deleteUser = async (id: string): Promise<IUser | null> => {
  const isExist = await User.findOne({ _id: id });

  if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  const result = await User.findByIdAndDelete(id);
  return result;
};

const myProfile = async (user: JwtPayload | null): Promise<IUser | null> => {
  const isUserExist = await User.findById(user?._id.toString());

  if (!isUserExist)
    throw new ApiError(httpStatus.NOT_FOUND, 'User Info Not Found');

  return isUserExist;
};

const updateMyProfile = async (
  payload: Partial<IUser>,
  user: JwtPayload | null,
): Promise<IUser | null> => {
  const userId = user?._id.toString();
  const isExist = await User.findOne({ _id: userId });

  if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  const { name, ...userData } = payload;

  const updatedUserData: Partial<IUser> = { ...userData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}`;
      (updatedUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await User.findOneAndUpdate({ _id: userId }, updatedUserData, {
    new: true,
  });
  return result;
};

export const UserService = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  myProfile,
  updateMyProfile,
};
