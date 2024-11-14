import { model, Schema } from "mongoose";
import { IWishlist, WishlistModel } from "./wishlist.interface";

export const WishlistSchema = new Schema<IWishlist, WishlistModel>(
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
    },
    {
      timestamps: true,
      toJSON: {
        virtuals: true,
      },
    },
  );

  export const Wishlist = model<IWishlist, WishlistModel>(
    'Wishlist',
    WishlistSchema,
  );