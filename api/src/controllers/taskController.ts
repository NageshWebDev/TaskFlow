import { NextFunction, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as taskService from '../services/taskService';

export async function list(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const tasks = await taskService.listTasks(req.userId!, req.params.projectId, {
      status: req.query.status as any,
      priority: req.query.priority as any,
      search: req.query.search as string | undefined,
    });
    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
}

export async function get(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const task = await taskService.getTask(
      req.userId!,
      req.params.projectId,
      req.params.taskId
    );
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const task = await taskService.createTask(
      req.userId!,
      req.params.projectId,
      req.body
    );
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const task = await taskService.updateTask(
      req.userId!,
      req.params.projectId,
      req.params.taskId,
      req.body
    );
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await taskService.deleteTask(
      req.userId!,
      req.params.projectId,
      req.params.taskId
    );
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
