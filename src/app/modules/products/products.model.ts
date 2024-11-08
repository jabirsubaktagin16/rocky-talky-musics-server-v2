import httpStatus from 'http-status';
import { model, Schema } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { productsCategory } from './products.constant';
import { IProducts, ProductsModel } from './products.interface';

export const ProductsSchema = new Schema<IProducts, ProductsModel>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    allowedForDiscount: {
      type: Boolean,
      required: true,
      default: false,
    },
    discountPercent: {
      type: Number,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: productsCategory,
    },
    stock: {
      type: Number,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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

/* Handling Checking Added By Id */
ProductsSchema.pre('save', async function (next) {
  const adminId = this.addedBy;

  const checkAddedBy = await User.findOne({ _id: adminId, role: 'admin' });

  if (!checkAddedBy) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Requested Seller not found');
  }
  next();
});

export const Products = model<IProducts, ProductsModel>(
  'Product',
  ProductsSchema,
);
