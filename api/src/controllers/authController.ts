import { NextFunction, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as authService from '../services/authService';

export async function register(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await authService.register(req.body.email, req.body.password);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function login(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await authService.logout(req.userId!);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
