import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { ReviewService } from './review.service';
// import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { IReview } from './review.interface';

const createReview: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user;
    const result = await ReviewService.createReview(req.body, userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Review created successfully',
      data: result,
    });
  },
);

const getReviewsOfSingleUser = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ReviewService.getReviewsOfSingleUser(req?.user);

    sendResponse<IReview[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Reviews of a user retrieved successfully !',
      data: result,
    });
  },
);

const getReviewsOfSingleProduct = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await ReviewService.getReviewsOfSingleProduct(id);

    sendResponse<IReview[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Reviews of a product retrieved successfully !',
      data: result,
    });
  },
);

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;
  const userId = req.user;

  const result = await ReviewService.updateReview(id, updatedData, userId);

  sendResponse<IReview>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review updated successfully!',
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = req.user;

  const result = await ReviewService.deleteReview(id, userId);

  sendResponse<IReview>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review Deleted successfully!',
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getReviewsOfSingleUser,
  getReviewsOfSingleProduct,
  updateReview,
  deleteReview,
};
