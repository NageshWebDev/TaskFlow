import { FilterQuery } from 'mongoose';
import { ITask, Task, TaskPriority, TaskStatus } from '../models/Task';
import { AppError } from '../utils/AppError';
import { assertProjectOwnership } from './projectService';

function serialize(task: ITask) {
  return {
    id: task.id,
    projectId: task.projectId.toString(),
    userId: task.userId.toString(),
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

export async function listTasks(
  userId: string,
  projectId: string,
  filters: { status?: TaskStatus; priority?: TaskPriority; search?: string }
) {
  await assertProjectOwnership(userId, projectId);

  const query: FilterQuery<ITask> = { userId, projectId };
  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;
  if (filters.search?.trim()) {
    query.title = { $regex: filters.search.trim(), $options: 'i' };
  }

  const tasks = await Task.find(query).sort({ createdAt: -1 });
  return tasks.map(serialize);
}

export async function getTask(userId: string, projectId: string, taskId: string) {
  await assertProjectOwnership(userId, projectId);
  const task = await Task.findOne({ _id: taskId, projectId, userId });
  if (!task) {
    throw new AppError(404, 'Task not found');
  }
  return serialize(task);
}

export async function createTask(
  userId: string,
  projectId: string,
  data: {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate: Date;
  }
) {
  await assertProjectOwnership(userId, projectId);
  const task = await Task.create({
    userId,
    projectId,
    title: data.title,
    description: data.description ?? '',
    status: data.status ?? 'To Do',
    priority: data.priority ?? 'Medium',
    dueDate: data.dueDate,
  });
  return serialize(task);
}

export async function updateTask(
  userId: string,
  projectId: string,
  taskId: string,
  data: Partial<{
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: Date;
  }>
) {
  await assertProjectOwnership(userId, projectId);
  const task = await Task.findOneAndUpdate(
    { _id: taskId, projectId, userId },
    { $set: data },
    { new: true }
  );
  if (!task) {
    throw new AppError(404, 'Task not found');
  }
  return serialize(task);
}

export async function deleteTask(userId: string, projectId: string, taskId: string) {
  await assertProjectOwnership(userId, projectId);
  const task = await Task.findOneAndDelete({ _id: taskId, projectId, userId });
  if (!task) {
    throw new AppError(404, 'Task not found');
  }
  return { message: 'Task deleted' };
}
