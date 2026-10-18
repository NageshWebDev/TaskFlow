import { NextFunction, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as dashboardService from '../services/dashboardService';

export async function getStats(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const stats = await dashboardService.getDashboardStats(req.userId!);
    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}
