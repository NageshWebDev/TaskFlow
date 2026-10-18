import mongoose from 'mongoose';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { AppError } from '../utils/AppError';

async function withStats(userId: string, projectId?: string) {
  const match: Record<string, unknown> = {
    userId: new mongoose.Types.ObjectId(userId),
  };
  if (projectId) {
    match._id = new mongoose.Types.ObjectId(projectId);
  }

  const results = await Project.aggregate([
    { $match: match },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: 'tasks',
        localField: '_id',
        foreignField: 'projectId',
        as: 'tasks',
      },
    },
    {
      $addFields: {
        taskCount: { $size: '$tasks' },
        completedCount: {
          $size: {
            $filter: {
              input: '$tasks',
              as: 't',
              cond: { $eq: ['$$t.status', 'Done'] },
            },
          },
        },
      },
    },
    {
      $addFields: {
        completionPercent: {
          $cond: [
            { $eq: ['$taskCount', 0] },
            0,
            {
              $round: [
                {
                  $multiply: [
                    { $divide: ['$completedCount', '$taskCount'] },
                    100,
                  ],
                },
                0,
              ],
            },
          ],
        },
      },
    },
    {
      $project: {
        tasks: 0,
        completedCount: 0,
        __v: 0,
      },
    },
  ]);

  return results.map((p) => ({
    id: p._id.toString(),
    userId: p.userId.toString(),
    name: p.name,
    description: p.description,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    taskCount: p.taskCount,
    completionPercent: p.completionPercent,
  }));
}

export async function listProjects(userId: string) {
  return withStats(userId);
}

export async function getProject(userId: string, projectId: string) {
  const [project] = await withStats(userId, projectId);
  if (!project) {
    throw new AppError(404, 'Project not found');
  }
  return project;
}

export async function createProject(
  userId: string,
  data: { name: string; description?: string }
) {
  const project = await Project.create({
    userId,
    name: data.name,
    description: data.description ?? '',
  });

  return {
    id: project.id,
    userId: project.userId.toString(),
    name: project.name,
    description: project.description,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    taskCount: 0,
    completionPercent: 0,
  };
}

export async function updateProject(
  userId: string,
  projectId: string,
  data: { name?: string; description?: string }
) {
  const project = await Project.findOneAndUpdate(
    { _id: projectId, userId },
    { $set: data },
    { new: true }
  );
  if (!project) {
    throw new AppError(404, 'Project not found');
  }
  return getProject(userId, projectId);
}

export async function deleteProject(userId: string, projectId: string) {
  const project = await Project.findOneAndDelete({ _id: projectId, userId });
  if (!project) {
    throw new AppError(404, 'Project not found');
  }
  await Task.deleteMany({ projectId, userId });
  return { message: 'Project deleted' };
}

/** Ensures the project belongs to the user; throws 404 otherwise */
export async function assertProjectOwnership(userId: string, projectId: string) {
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) {
    throw new AppError(404, 'Project not found');
  }
  return project;
}
