import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middleware/auth';
import { ProductController } from './products.controller';

const router = express.Router();

router.get('/:id', ProductController.getSingleProduct);
router.post('', auth(ENUM_USER_ROLE.ADMIN), ProductController.createProduct);
router.get('', ProductController.getAllProducts);
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ProductController.updateProduct,
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ProductController.deleteProduct,
);

export const ProductRoutes = router;
