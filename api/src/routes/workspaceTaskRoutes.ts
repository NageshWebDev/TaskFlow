import { Router } from 'express';
import { NextFunction, Response } from 'express';
import { AuthRequest, requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as taskService from '../services/taskService';
import { z } from 'zod';
import { TASK_PRIORITIES, TASK_STATUSES } from '../models/Task';

const querySchema = z.object({
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  search: z.string().optional(),
  projectId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, 'Invalid project id')
    .optional(),
});

const router = Router();

router.use(requireAuth);

router.get(
  '/',
  validate(querySchema, 'query'),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tasks = await taskService.listAllTasks(req.userId!, {
        status: req.query.status as any,
        priority: req.query.priority as any,
        search: req.query.search as string | undefined,
        projectId: req.query.projectId as string | undefined,
      });
      res.status(200).json({ success: true, data: tasks });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
