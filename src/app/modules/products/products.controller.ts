import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { productsFilterableFields } from './products.constant';
import { IProducts } from './products.interface';
import { ProductsService } from './products.service';

const createProduct: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const addedBy = req.user;
    const result = await ProductsService.createProduct(req.body, addedBy);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Product created successfully',
      data: result,
    });
  },
);

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, productsFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ProductsService.getAllProducts(
    filters,
    paginationOptions,
  );

  sendResponse<IProducts[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ProductsService.getSingleProduct(id);

  sendResponse<IProducts>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product retrieved successfully !',
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;
  const addedBy = req.user;

  const result = await ProductsService.updateProduct(id, updatedData, addedBy);

  sendResponse<IProducts>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product updated successfully!',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const addedBy = req.user;

  const result = await ProductsService.deleteProduct(id, addedBy);

  sendResponse<IProducts>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product Deleted successfully!',
    data: result,
  });
});

export const ProductController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
