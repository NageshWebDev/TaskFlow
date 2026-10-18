import type { DashboardStats, Project, Task, User } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export class ApiClientError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiClientError(
      res.status,
      body?.error?.message || 'Request failed'
    );
  }

  return body.data as T;
}

export const api = {
  register: (email: string, password: string) =>
    request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  login: (email: string, password: string) =>
    request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: (token: string) =>
    request<{ message: string }>('/auth/logout', { method: 'POST' }, token),

  getDashboard: (token: string) =>
    request<DashboardStats>('/dashboard', {}, token),

  listProjects: (token: string) => request<Project[]>('/projects', {}, token),

  getProject: (token: string, id: string) =>
    request<Project>(`/projects/${id}`, {}, token),

  createProject: (
    token: string,
    data: { name: string; description?: string }
  ) =>
    request<Project>(
      '/projects',
      { method: 'POST', body: JSON.stringify(data) },
      token
    ),

  updateProject: (
    token: string,
    id: string,
    data: { name?: string; description?: string }
  ) =>
    request<Project>(
      `/projects/${id}`,
      { method: 'PATCH', body: JSON.stringify(data) },
      token
    ),

  deleteProject: (token: string, id: string) =>
    request<{ message: string }>(`/projects/${id}`, { method: 'DELETE' }, token),

  listTasks: (
    token: string,
    projectId: string,
    params?: { status?: string; priority?: string; search?: string }
  ) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    if (params?.priority) qs.set('priority', params.priority);
    if (params?.search) qs.set('search', params.search);
    const query = qs.toString() ? `?${qs}` : '';
    return request<Task[]>(`/projects/${projectId}/tasks${query}`, {}, token);
  },

  createTask: (
    token: string,
    projectId: string,
    data: Record<string, unknown>
  ) =>
    request<Task>(
      `/projects/${projectId}/tasks`,
      { method: 'POST', body: JSON.stringify(data) },
      token
    ),

  updateTask: (
    token: string,
    projectId: string,
    taskId: string,
    data: Record<string, unknown>
  ) =>
    request<Task>(
      `/projects/${projectId}/tasks/${taskId}`,
      { method: 'PATCH', body: JSON.stringify(data) },
      token
    ),

  deleteTask: (token: string, projectId: string, taskId: string) =>
    request<{ message: string }>(
      `/projects/${projectId}/tasks/${taskId}`,
      { method: 'DELETE' },
      token
    ),
};
