import { Model, Types } from "mongoose";
import { IProducts } from "../products/products.interface";
import { IUser } from "../user/user.interface";

export type IWishlist = {
    userId: Types.ObjectId|IUser;
    productId: Types.ObjectId|IProducts;
};
  
export type WishlistModel = Model<IWishlist, Record<string, unknown>>;