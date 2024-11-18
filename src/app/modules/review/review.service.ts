import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
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
  const result = await Review.aggregate([
    // Match the reviews for the specific product
    {
      $match: { productId: new mongoose.Types.ObjectId(id) },
    },
    // Lookup to populate userId with user data from users collection
    {
      $lookup: {
        from: 'users', // The users collection name
        localField: 'userId', // The field in reviews we want to match
        foreignField: '_id', // Match with the _id in the users collection
        as: 'userId', // Populated user details will replace userId
        pipeline: [
          {
            $project: {
              password: 0, // Exclude the password field
            },
          },
        ],
      },
    },

    // Unwind the reviews array to process individual reviews
    {
      $unwind: {
        path: '$userId', // Unwind user data into review
        preserveNullAndEmptyArrays: true, // This will preserve reviews that have no user data
      },
    },
    // Add fields to calculate star count, total reviews, and average rating
    {
      $group: {
        _id: '$productId', // Group by productId to get aggregates for that product
        totalReviews: { $sum: 1 },
        oneStarCount: {
          $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] },
        },
        twoStarCount: {
          $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] },
        },
        threeStarCount: {
          $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] },
        },
        fourStarCount: {
          $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] },
        },
        fiveStarCount: {
          $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] },
        },
        // Calculate the total sum of ratings to calculate average
        totalRating: { $sum: '$rating' },
        reviews: { $push: '$$ROOT' }, // Push the entire review document into the reviews array
      },
    },
    // Add average rating field
    {
      $addFields: {
        averageRating: {
          $cond: {
            if: { $eq: ['$totalReviews', 0] },
            then: 0,
            else: { $divide: ['$totalRating', '$totalReviews'] },
          },
        },
      },
    },
  ]);

  // If no reviews found, throw an error
  if (!result || result.length === 0) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Reviews Not Found for the product',
    );
  }

  // Return the review statistics and the list of reviews with populated userId
  return {
    reviews: result[0].reviews, // Reviews list with populated userId
    totalReviews: result[0].totalReviews,
    averageRating: result[0].averageRating,
    oneStarCount: result[0].oneStarCount,
    twoStarCount: result[0].twoStarCount,
    threeStarCount: result[0].threeStarCount,
    fourStarCount: result[0].fourStarCount,
    fiveStarCount: result[0].fiveStarCount,
  };
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
