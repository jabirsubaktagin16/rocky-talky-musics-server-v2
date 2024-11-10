import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type IProducts = {
  name: string;
  description: string;
  price: number;
  allowedForDiscount: boolean;
  discountPercent: number;
  brand: string;
  category:
    | 'guitars'
    | 'keyboards'
    | 'drums'
    | 'violins'
    | 'flutes'
    | 'trumpets'
    | 'cellos'
    | 'ukuleles'
    | 'harmonicas'
    | 'banjos'
    | 'mandolins'
    | 'synthesizers'
    | 'saxophones';
  stock: number;
  images: Array<string>;
  addedBy: Types.ObjectId | IUser;
  createdAt: string;
};

export type ProductsModel = Model<IProducts, Record<string, unknown>>;

export type IProductsFilter = {
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  brand?: string;
};
