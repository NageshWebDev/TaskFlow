'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { EmptyState } from '@/components/EmptyState';
import { RequireAuth } from '@/components/RequireAuth';
import { TaskFilters, TaskFilterValues } from '@/components/TaskFilters';
import { api } from '@/lib/api';
import type { Project, Task, TaskPriority, TaskStatus } from '@/lib/types';
import { useAuthStore } from '@/store/authStore';

function ProjectDetailContent() {
  const params = useParams();
  const projectId = params.id as string;
  const token = useAuthStore((s) => s.token)!;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilterValues>({
    status: '',
    priority: '',
    search: '',
  });
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('To Do');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [dueDate, setDueDate] = useState('');

  const load = useCallback(async () => {
    try {
      const [p, t] = await Promise.all([
        api.getProject(token, projectId),
        api.listTasks(token, projectId, {
          status: filters.status || undefined,
          priority: filters.priority || undefined,
          search: filters.search || undefined,
        }),
      ]);
      setProject(p);
      setTasks(t);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    }
  }, [token, projectId, filters]);

  useEffect(() => {
    const handle = setTimeout(() => {
      load();
    }, 200);
    return () => clearTimeout(handle);
  }, [load]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    try {
      await api.createTask(token, projectId, {
        title,
        description,
        status,
        priority,
        dueDate: new Date(dueDate).toISOString(),
      });
      setTitle('');
      setDescription('');
      setStatus('To Do');
      setPriority('Medium');
      setDueDate('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed');
    }
  }

  async function onStatusChange(task: Task, next: TaskStatus) {
    await api.updateTask(token, projectId, task.id, { status: next });
    await load();
  }

  async function onDelete(taskId: string) {
    if (!confirm('Delete this task?')) return;
    await api.deleteTask(token, projectId, taskId);
    await load();
  }

  const now = Date.now();

  return (
    <main className="container">
      <p>
        <Link href="/projects" className="muted">
          ← Back to projects
        </Link>
      </p>

      {error ? <p className="form-error">{error}</p> : null}

      {project ? (
        <div className="page-header">
          <div>
            <h1>{project.name}</h1>
            <p className="muted">{project.description || 'No description'}</p>
            <div className="meta">
              <span>{project.taskCount} tasks</span>
              <span>{project.completionPercent}% complete</span>
            </div>
          </div>
        </div>
      ) : (
        <p className="muted">Loading project…</p>
      )}

      <section className="card" style={{ marginBottom: '1rem' }}>
        <h2 style={{ marginTop: 0 }}>Add task</h2>
        <form className="form-grid" onSubmit={onCreate}>
          <label>
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <div className="form-grid two">
            <label>
              Status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
              >
                <option>To Do</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </label>
            <label>
              Priority
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>
          </div>
          <label>
            Due date
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn btn-primary">
            Add task
          </button>
        </form>
      </section>

      <TaskFilters value={filters} onChange={setFilters} />

      {tasks.length === 0 ? (
        <EmptyState
          title="No matching tasks"
          message="Try clearing filters or create a new task above."
        />
      ) : (
        <div className="task-list">
          {tasks.map((task) => {
            const overdue =
              task.status !== 'Done' && new Date(task.dueDate).getTime() < now;
            return (
              <div key={task.id} className="task-item">
                <div className="row">
                  <strong>{task.title}</strong>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => onDelete(task.id)}
                  >
                    Delete
                  </button>
                </div>
                <p className="muted" style={{ margin: 0 }}>
                  {task.description || 'No description'}
                </p>
                <div className="meta">
                  <span
                    className={`badge ${task.status === 'Done' ? 'done' : ''}`}
                  >
                    {task.status}
                  </span>
                  <span
                    className={`badge ${task.priority === 'High' ? 'high' : ''}`}
                  >
                    {task.priority}
                  </span>
                  <span className={overdue ? 'badge overdue' : ''}>
                    Due {new Date(task.dueDate).toLocaleDateString()}
                    {overdue ? ' · Overdue' : ''}
                  </span>
                </div>
                <label>
                  Change status
                  <select
                    value={task.status}
                    onChange={(e) =>
                      onStatusChange(task, e.target.value as TaskStatus)
                    }
                  >
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                </label>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default function ProjectDetailPage() {
  return (
    <RequireAuth>
      <ProjectDetailContent />
    </RequireAuth>
  );
}
