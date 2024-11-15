import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { IReview } from './review.interface';
import { Review } from './review.model';

const createReview = async (
  review: IReview,
  userId: JwtPayload | null,
): Promise<IReview | null> => {
  const createdReview = (await Review.create(review)).populate(
    'userId',
    'productId',
  );

  if (!createdReview) {
    throw new Error('Failed to create Review!');
  }
  return createdReview;
};

const getReviewsOfSingleUser = async (
  user: JwtPayload | null,
): Promise<IReview[]> => {
  const result = await Review.find({
    userId: user?._id.toString(),
  }).populate('productId', 'userId');

  if (!result)
    throw new ApiError(httpStatus.NOT_FOUND, 'Reviews Not Found for the user');

  return result;
};

const getReviewsOfSingleProduct = async (id: string): Promise<IReview[]> => {
  const result = await Review.find({
    productId: id,
  }).populate('productId', 'userId');

  if (!result)
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Reviews Not Found for the product',
    );

  return result;
};

const updateReview = async (
  id: string,
  payload: Partial<IReview>,
  userId: JwtPayload | null,
): Promise<IReview | null> => {
  const isExist = await Review.findById(id).lean();

  if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');

  const { ...reviewData } = payload;

  // Check User Account
  if (userId && isExist.userId.toString() !== userId._id.toString()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid User');
  }

  const updatedReviewData: Partial<IReview> = {
    ...reviewData,
  };

  const result = await Review.findOneAndUpdate(
    {
      _id: id,
    },
    updatedReviewData,
    {
      new: true,
    },
  ).populate('userId', 'productId');
  return result;
};

const deleteReview = async (
  id: string,
  userId: JwtPayload | null,
): Promise<IReview | null> => {
  const isExist = await Review.findById(id).lean();

  if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');

  // Check User Account
  if (userId && isExist.userId.toString() !== userId._id.toString()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid User');
  }

  const result = await Review.findByIdAndDelete(id);
  return result;
};

export const ReviewService = {
  createReview,
  getReviewsOfSingleUser,
  getReviewsOfSingleProduct,
  updateReview,
  deleteReview,
};
