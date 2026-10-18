import { z } from 'zod';
import { TASK_PRIORITIES, TASK_STATUSES } from '../models/Task';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional().default(''),
  status: z.enum(TASK_STATUSES).optional().default('To Do'),
  priority: z.enum(TASK_PRIORITIES).optional().default('Medium'),
  dueDate: z.coerce.date(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  dueDate: z.coerce.date().optional(),
});

export const taskQuerySchema = z.object({
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  search: z.string().optional(),
});

export const projectIdParamSchema = z.object({
  projectId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid project id'),
});

export const taskIdParamSchema = z.object({
  projectId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid project id'),
  taskId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid task id'),
});
