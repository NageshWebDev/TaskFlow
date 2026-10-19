import mongoose from 'mongoose';
import { Project } from '../models/Project';
import { Task } from '../models/Task';

/**
 * Dashboard stats via MongoDB aggregation.
 * Overdue = dueDate < now AND status != Done
 */
export async function getDashboardStats(userId: string) {
  const uid = new mongoose.Types.ObjectId(userId);
  const now = new Date();

  const [projectAgg, taskAgg] = await Promise.all([
    Project.aggregate([
      { $match: { userId: uid } },
      { $count: 'totalProjects' },
    ]),
    Task.aggregate([
      { $match: { userId: uid } },
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'Done'] }, 1, 0] },
          },
          inProgressTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] },
          },
          todoTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'To Do'] }, 1, 0] },
          },
          overdueTasks: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ['$dueDate', now] },
                    { $ne: ['$status', 'Done'] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]),
  ]);

  return {
    totalProjects: projectAgg[0]?.totalProjects ?? 0,
    totalTasks: taskAgg[0]?.totalTasks ?? 0,
    completedTasks: taskAgg[0]?.completedTasks ?? 0,
    inProgressTasks: taskAgg[0]?.inProgressTasks ?? 0,
    todoTasks: taskAgg[0]?.todoTasks ?? 0,
    overdueTasks: taskAgg[0]?.overdueTasks ?? 0,
  };
}
