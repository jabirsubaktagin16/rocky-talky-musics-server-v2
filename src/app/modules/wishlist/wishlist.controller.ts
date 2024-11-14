import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IWishlist } from './wishlist.interface';
import { WishlistService } from './wishlist.service';

const addToWishlist: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user;
    const result = await WishlistService.addToWishlist(req.body, userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Added to wishlist successfully',
      data: result,
    });
  },
);

const getWishlistOfSingleUser = catchAsync(
  async (req: Request, res: Response) => {
    const result = await WishlistService.getWishlistOfSingleUser(req?.user);

    sendResponse<IWishlist[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Wishlist of a user retrieved successfully !',
      data: result,
    });
  },
);

const deleteFromWishlist = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = req.user;

  const result = await WishlistService.deleteFromWishlist(id, userId);

  sendResponse<IWishlist>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Removed from Wishlist successfully!',
    data: result,
  });
});

export const WishlistController = {
  addToWishlist,
  getWishlistOfSingleUser,
  deleteFromWishlist,
};
