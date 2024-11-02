import express from 'express';
import { UserController } from '../user/user.controller';
import { AuthController } from './auth.controller';

const router = express.Router();

router.post('/signup', UserController.createUser);

router.post('/login', AuthController.loginUser);

router.post('/refresh-token', AuthController.refreshToken);

router.post('/google', AuthController.googleLoginUser);

export const AuthRoutes = router;
