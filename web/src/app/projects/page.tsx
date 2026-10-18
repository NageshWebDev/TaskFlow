'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { EmptyState } from '@/components/EmptyState';
import { RequireAuth } from '@/components/RequireAuth';
import { api } from '@/lib/api';
import type { Project } from '@/lib/types';
import { useAuthStore } from '@/store/authStore';

function ProjectsContent() {
  const token = useAuthStore((s) => s.token)!;
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setProjects(await api.listProjects(token));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await api.createProject(token, { name, description });
      setName('');
      setDescription('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed');
    }
  }

  async function onDelete(id: string) {
    if (!confirm('Delete this project and all its tasks?')) return;
    await api.deleteProject(token, id);
    await load();
  }

  return (
    <main className="container">
      <div className="page-header">
        <div>
          <h1>Projects</h1>
          <p className="muted">Create and manage your projects.</p>
        </div>
      </div>

      <section className="card" style={{ marginBottom: '1rem' }}>
        <h2 style={{ marginTop: 0 }}>New project</h2>
        <form className="form-grid" onSubmit={onCreate}>
          <label>
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
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
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" className="btn btn-primary">
            Create project
          </button>
        </form>
      </section>

      {loading ? <p className="muted">Loading…</p> : null}

      {!loading && projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          message="Create your first project to start adding tasks."
        />
      ) : (
        <div className="project-list">
          {projects.map((p) => (
            <div key={p.id} className="project-item">
              <div className="row">
                <Link href={`/projects/${p.id}`}>
                  <strong>{p.name}</strong>
                </Link>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => onDelete(p.id)}
                >
                  Delete
                </button>
              </div>
              <p className="muted" style={{ margin: 0 }}>
                {p.description || 'No description'}
              </p>
              <div className="meta">
                <span>{p.taskCount} tasks</span>
                <span>{p.completionPercent}% complete</span>
                <span>
                  Created {new Date(p.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="progress" aria-hidden>
                <span style={{ width: `${p.completionPercent}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default function ProjectsPage() {
  return (
    <RequireAuth>
      <ProjectsContent />
    </RequireAuth>
  );
}
