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

const getReviewsOfSingleProduct = async (id: string): Promise<any> => {
  const result = await Review.aggregate([
    // Match the reviews for the specific product
    {
      $match: { productId: new mongoose.Types.ObjectId(id) },
    },
    // Lookup to populate userId with user data from the users collection
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
        preserveNullAndEmptyArrays: true, // Preserve reviews even if user data is not found
      },
    },
    // Group to calculate aggregates for the product
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
        // Calculate the total sum of ratings to compute the average
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

  // Check if result is empty and return default values
  if (result.length === 0) {
    return {
      reviews: [],
      totalReviews: 0,
      averageRating: 0,
      oneStarCount: 0,
      twoStarCount: 0,
      threeStarCount: 0,
      fourStarCount: 0,
      fiveStarCount: 0,
    };
  }

  // Return the review statistics and the list of reviews with populated userId
  return {
    reviews: result[0].reviews || [],
    totalReviews: result[0].totalReviews || 0,
    averageRating: result[0].averageRating || 0,
    oneStarCount: result[0].oneStarCount || 0,
    twoStarCount: result[0].twoStarCount || 0,
    threeStarCount: result[0].threeStarCount || 0,
    fourStarCount: result[0].fourStarCount || 0,
    fiveStarCount: result[0].fiveStarCount || 0,
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
