export type TaskStatus = 'To Do' | 'In Progress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface User {
  id: string;
  email: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  taskCount: number;
  completionPercent: number;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

export interface ApiError {
  success: false;
  error: { message: string; details?: unknown };
}
