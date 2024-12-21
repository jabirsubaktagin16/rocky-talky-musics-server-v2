import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret, TokenExpiredError } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { JWTHelper } from '../../helpers/jwtHelper';

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'You are not authorized to access this',
        );
      }

      let verifiedUser = null;

      try {
        verifiedUser = JWTHelper.verifyToken(
          token,
          config.jwt.secret as Secret,
        );
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          throw new ApiError(httpStatus.UNAUTHORIZED, 'JWT token has expired');
        }
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid JWT token');
      }

      req.user = verifiedUser;

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden Credentials');
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
