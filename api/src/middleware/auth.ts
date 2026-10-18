import { NextFunction, Request, Response } from 'express';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  userId?: string;
}

export async function requireAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new AppError(401, 'Authentication required');
    }

    const token = header.slice(7);
    const payload = verifyToken(token);

    const user = await User.findById(payload.userId);
    if (!user) {
      throw new AppError(401, 'Invalid token');
    }

    // Logout bumps tokenVersion so previously issued JWTs stop working
    if (user.tokenVersion !== payload.tokenVersion) {
      throw new AppError(401, 'Token has been invalidated');
    }

    req.userId = user.id;
    next();
  } catch (err) {
    if (err instanceof AppError) {
      next(err);
      return;
    }
    next(new AppError(401, 'Invalid or expired token'));
  }
}
