import status from 'http-status';

import { Request, Response } from 'express';

import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from './user.interface';
import { UserService } from './user.service';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUser(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers();

  sendResponse<IUser[]>(res, {
    statusCode: status.OK,
    success: true,
    message: 'All users retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await UserService.getSingleUser(id);

  sendResponse<IUser>(res, {
    statusCode: status.OK,
    success: true,
    message: 'Single User retrieved successfully !',
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;

  const result = await UserService.updateUser(id, updatedData);

  sendResponse<IUser>(res, {
    statusCode: status.OK,
    success: true,
    message: 'User updated successfully!',
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await UserService.deleteUser(id);

  sendResponse<IUser>(res, {
    statusCode: status.OK,
    success: true,
    message: 'User Deleted successfully!',
    data: result,
  });
});

const myProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.myProfile(req?.user);

  sendResponse<IUser>(res, {
    statusCode: status.OK,
    success: true,
    message: 'My Profile Retrieved Successfully!',
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const updatedData = req.body;

  const result = await UserService.updateMyProfile(updatedData, req?.user);

  sendResponse<IUser>(res, {
    statusCode: status.OK,
    success: true,
    message: 'My Profile updated successfully!',
    data: result,
  });
});

export const UserController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  myProfile,
  updateMyProfile,
};
