import { Model, Types } from 'mongoose';
import { IProducts } from '../products/products.interface';
import { IUser } from '../user/user.interface';

export type IReview = {
  userId: Types.ObjectId | IUser;
  productId: Types.ObjectId | IProducts;
  rating: number;
  comment: string;
};

export type ReviewModel = Model<IReview, Record<string, unknown>>;
