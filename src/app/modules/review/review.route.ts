import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middleware/auth';
import { ReviewController } from './review.controller';

const router = express.Router();

/* router.get('/latest', ProductController.getNewProducts);
router.get('/:id', ProductController.getSingleProduct); */
router.post('', auth(ENUM_USER_ROLE.USER), ReviewController.createReview);
router.get('/product/:id', ReviewController.getReviewsOfSingleProduct);
// router.get('', ProductController.getAllProducts);

/* router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ProductController.updateProduct,
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ProductController.deleteProduct,
); */

export const ReviewRoutes = router;
