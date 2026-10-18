import { NextFunction, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as projectService from '../services/projectService';

export async function list(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const projects = await projectService.listProjects(req.userId!);
    res.status(200).json({ success: true, data: projects });
  } catch (err) {
    next(err);
  }
}

export async function get(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const project = await projectService.getProject(req.userId!, req.params.id);
    res.status(200).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
}

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const project = await projectService.createProject(req.userId!, req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const project = await projectService.updateProject(
      req.userId!,
      req.params.id,
      req.body
    );
    res.status(200).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await projectService.deleteProject(req.userId!, req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
