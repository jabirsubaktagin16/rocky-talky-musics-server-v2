import { model, Schema } from 'mongoose';
import { IReview, ReviewModel } from './review.interface';

export const ReviewSchema = new Schema<IReview, ReviewModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Products',
      required: true,
    },
    rating: {
      type: Number,
    },
    comment: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const Review = model<IReview, ReviewModel>('Review', ReviewSchema);
