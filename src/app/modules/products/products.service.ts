import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { productsSearchableFields } from './products.constant';
import { IProducts, IProductsFilter } from './products.interface';
import { Products } from './products.model';

const createProduct = async (
  product: IProducts,
  addedBy: JwtPayload | null,
): Promise<IProducts | null> => {
  // Check If Admin or Not
  console.log(addedBy);
  if (addedBy && product.addedBy !== addedBy._id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Seller Account');
  }

  const createdProduct = (await Products.create(product)).populate('addedBy');

  if (!createdProduct) {
    throw new Error('Failed to create Product!');
  }
  return createdProduct;
};

const getAllProducts = async (
  filters: IProductsFilter,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IProducts[]>> => {
  const { searchTerm, minPrice, maxPrice, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: productsSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (minPrice !== undefined && maxPrice !== undefined) {
    andConditions.push({
      price: {
        $gte: minPrice,
        $lte: maxPrice,
      },
    });
  } else if (minPrice !== undefined) {
    andConditions.push({
      price: {
        $gte: minPrice,
      },
    });
  } else if (maxPrice !== undefined) {
    andConditions.push({
      price: {
        $lte: maxPrice,
      },
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Products.find(whereConditions)
    .populate('addedBy')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Products.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleProduct = async (id: string): Promise<IProducts | null> => {
  const result = await Products.findById(id).populate('addedBy');
  return result;
};

const updateProduct = async (
  id: string,
  payload: Partial<IProducts>,
  addedBy: JwtPayload | null,
): Promise<IProducts | null> => {
  const isExist = await Products.findById(id).lean();

  if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');

  const { ...productData } = payload;

  // Check Seller Account
  if (addedBy && isExist.addedBy.toString() !== addedBy._id.toString()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Seller Account');
  }

  const updatedProductData: Partial<IProducts> = { ...productData };

  const result = await Products.findOneAndUpdate(
    { _id: id },
    updatedProductData,
    {
      new: true,
    },
  ).populate('addedBy');
  return result;
};

const deleteProduct = async (
  id: string,
  addedBy: JwtPayload | null,
): Promise<IProducts | null> => {
  const isExist = await Products.findById(id).lean();

  if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');

  // Check Admin Account
  if (addedBy && isExist.addedBy.toString() !== addedBy._id.toString()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Admin');
  }

  const result = await Products.findByIdAndDelete(id);
  return result;
};

export const ProductsService = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
