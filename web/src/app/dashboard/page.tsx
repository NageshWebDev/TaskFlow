'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RequireAuth } from '@/components/RequireAuth';
import { api } from '@/lib/api';
import type { DashboardStats, Project } from '@/lib/types';
import { useAuthStore } from '@/store/authStore';

function DashboardContent() {
  const token = useAuthStore((s) => s.token)!;
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.getDashboard(token), api.listProjects(token)])
      .then(([s, p]) => {
        setStats(s);
        setProjects(p.slice(0, 5));
      })
      .catch((err) => setError(err.message));
  }, [token]);

  return (
    <main className="container">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Overview of your work.</p>
        </div>
        <Link className="btn btn-primary" href="/projects">
          View projects
        </Link>
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      {stats ? (
        <div className="stats-grid">
          <div className="stat-card">
            <span>Total projects</span>
            <strong>{stats.totalProjects}</strong>
          </div>
          <div className="stat-card">
            <span>Total tasks</span>
            <strong>{stats.totalTasks}</strong>
          </div>
          <div className="stat-card">
            <span>Completed</span>
            <strong>{stats.completedTasks}</strong>
          </div>
          <div className="stat-card">
            <span>Overdue</span>
            <strong>{stats.overdueTasks}</strong>
          </div>
        </div>
      ) : (
        <p className="muted">Loading stats…</p>
      )}

      <section className="card stack-gap">
        <div className="row">
          <h2 style={{ margin: 0 }}>Recent projects</h2>
        </div>
        {projects.length === 0 ? (
          <p className="muted">No projects yet. Create one from Projects.</p>
        ) : (
          <div className="project-list">
            {projects.map((p) => (
              <Link key={p.id} href={`/projects/${p.id}`} className="project-item">
                <div className="row">
                  <strong>{p.name}</strong>
                  <span className="badge">{p.completionPercent}% done</span>
                </div>
                <p className="muted" style={{ margin: 0 }}>
                  {p.taskCount} tasks
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
