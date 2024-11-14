import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { IWishlist } from './wishlist.interface';
import { Wishlist } from './wishlist.model';

const addToWishlist = async (
  wishlist: IWishlist,
  userId: JwtPayload | null,
): Promise<IWishlist | null> => {
  const createdWishlist = (await Wishlist.create(wishlist)).populate(
    'productId',
  );

  if (!createdWishlist) {
    throw new Error('Failed to add in wishlist!');
  }
  return createdWishlist;
};

const getWishlistOfSingleUser = async (
  user: JwtPayload | null,
): Promise<IWishlist[]> => {
  const result = await Wishlist.find({ userId: user?._id.toString() }).populate(
    'productId',
  );

  if (!result)
    throw new ApiError(httpStatus.NOT_FOUND, 'Wishlist Not Found for the user');

  return result;
};

const deleteFromWishlist = async (
  id: string,
  userId: JwtPayload | null,
): Promise<IWishlist | null> => {
  const isExist = await Wishlist.findById(id).lean();

  if (!isExist)
    throw new ApiError(httpStatus.NOT_FOUND, 'Id not found in Wishlist');

  // Check if valid user tries to delete from wishlist
  if (userId && isExist.userId.toString() !== userId._id.toString()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid User');
  }

  const result = await Wishlist.findByIdAndDelete(id);
  return result;
};

export const WishlistService = {
  addToWishlist,
  getWishlistOfSingleUser,
  deleteFromWishlist,
};
