import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middleware/auth';
import { ReviewController } from './review.controller';

const router = express.Router();

router.post('', auth(ENUM_USER_ROLE.USER), ReviewController.createReview);

router.get('/product/:id', ReviewController.getReviewsOfSingleProduct);

router.get('/user/:id', auth(ENUM_USER_ROLE.USER),ReviewController.getReviewsOfSingleUser);

router.patch('/:id', auth(ENUM_USER_ROLE.USER),ReviewController.updateReview);

router.delete('/:id', auth(ENUM_USER_ROLE.USER),ReviewController.deleteReview);

export const ReviewRoutes = router;
