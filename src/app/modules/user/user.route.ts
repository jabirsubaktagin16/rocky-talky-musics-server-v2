import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middleware/auth';
import { WishlistController } from '../wishlist/wishlist.controller';
import { UserController } from './user.controller';

const router = express.Router();

router.get(
  '/my-profile',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  UserController.myProfile,
);

router.get('/:id', auth(ENUM_USER_ROLE.ADMIN), UserController.getSingleUser);

router.get('', auth(ENUM_USER_ROLE.ADMIN), UserController.getAllUsers);

router.patch(
  '/my-profile',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  UserController.updateMyProfile,
);

router.patch('/:id', auth(ENUM_USER_ROLE.ADMIN), UserController.updateUser);

router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), UserController.deleteUser);

router.post('/wishlist', auth(ENUM_USER_ROLE.USER), WishlistController.addToWishlist);

router.get('/wishlist', auth(ENUM_USER_ROLE.USER), WishlistController.getWishlistOfSingleUser);

router.delete('/wishlist/delete/:id', auth(ENUM_USER_ROLE.USER), WishlistController.deleteFromWishlist);

export const UserRoutes = router;
