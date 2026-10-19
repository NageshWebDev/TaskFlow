'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EmptyState } from '@/components/EmptyState';
import { RequireAuth } from '@/components/RequireAuth';
import { FilterSearch, FilterSelect } from '@/components/FilterControl';
import { ProjectCard } from '@/components/ProjectCard';
import { api } from '@/lib/api';
import type { Project } from '@/lib/types';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const SORT_OPTIONS = [
  { value: 'recent', label: 'Sort: Recently updated' },
  { value: 'name', label: 'Sort: Name' },
  { value: 'progress', label: 'Sort: Progress' },
];

function ProjectsContent() {
  const token = useAuthStore((s) => s.token)!;
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [renameProject, setRenameProject] = useState<Project | null>(null);
  const [renameName, setRenameName] = useState('');
  const [error, setError] = useState('');
  const [renameError, setRenameError] = useState('');
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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = projects;
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    const copy = [...list];
    if (sort === 'name') copy.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'progress') copy.sort((a, b) => b.completionPercent - a.completionPercent);
    if (sort === 'recent') {
      copy.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return copy;
  }, [projects, search, sort]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await api.createProject(token, { name, description });
      setName('');
      setDescription('');
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed');
    }
  }

  async function onDelete() {
    if (!deleteId) return;
    await api.deleteProject(token, deleteId);
    setDeleteId(null);
    await load();
  }

  async function onRename(e: FormEvent) {
    e.preventDefault();
    if (!renameProject) return;
    setRenameError('');
    try {
      await api.updateProject(token, renameProject.id, { name: renameName.trim() });
      setRenameProject(null);
      setRenameName('');
      await load();
    } catch (err) {
      setRenameError(err instanceof Error ? err.message : 'Rename failed');
    }
  }

  return (
    <AppShell>
      <PageHeader
        title="Projects"
        subtitle="Manage your projects and track progress."
        action={
          <Button
            className="h-[var(--control-h)] min-w-0 rounded-[var(--radius-control)]"
            onClick={() => setShowForm(true)}
          >
            <Plus data-icon="inline-start" />
            New project
          </Button>
        }
      />
      <div className="space-y-4">
        <div className="flex flex-wrap items-stretch gap-[var(--space-3)]">
          <FilterSearch
            placeholder="Search projects..."
            aria-label="Search projects"
            value={search}
            onChange={setSearch}
          />
          <div className="w-full sm:w-[var(--filter-select-w)] sm:min-w-[14rem] sm:shrink-0">
            <FilterSelect
              aria-label="Sort projects"
              value={sort}
              onValueChange={setSort}
              items={SORT_OPTIONS}
            />
          </div>
        </div>

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>New project</DialogTitle>
              <DialogDescription>
                Add a workspace to start tracking tasks.
              </DialogDescription>
            </DialogHeader>
            <form className="grid gap-4" onSubmit={onCreate}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="project-name">Name</FieldLabel>
                  <Input
                    id="project-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-10"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="project-desc">Description</FieldLabel>
                  <Textarea
                    id="project-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Field>
                {error ? <FieldError>{error}</FieldError> : null}
              </FieldGroup>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create project
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog
          open={Boolean(renameProject)}
          onOpenChange={(open) => {
            if (!open) {
              setRenameProject(null);
              setRenameError('');
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Rename project</DialogTitle>
              <DialogDescription>Update the project name.</DialogDescription>
            </DialogHeader>
            <form className="grid gap-4" onSubmit={onRename}>
              <Field>
                <FieldLabel htmlFor="rename-project">Name</FieldLabel>
                <Input
                  id="rename-project"
                  value={renameName}
                  onChange={(e) => setRenameName(e.target.value)}
                  required
                  className="h-[var(--control-h)]"
                />
                {renameError ? <FieldError>{renameError}</FieldError> : null}
              </Field>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRenameProject(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={Boolean(deleteId)}
          onOpenChange={(open) => {
            if (!open) setDeleteId(null);
          }}
          title="Delete project?"
          description="This will permanently delete the project and all of its tasks."
          onConfirm={onDelete}
        />

        {loading ? <p className="text-base text-muted-foreground">Loading…</p> : null}

        {!loading && filtered.length === 0 ? (
          <EmptyState
            title="No projects yet"
            message="Create your first project to start adding tasks."
          />
        ) : (
          <div className="grid gap-[var(--space-4)] md:grid-cols-2">
            {filtered.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onRename={(project) => {
                  setRenameProject(project);
                  setRenameName(project.name);
                  setRenameError('');
                }}
                onDelete={(project) => setDeleteId(project.id)}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function ProjectsPage() {
  return (
    <RequireAuth>
      <ProjectsContent />
    </RequireAuth>
  );
}
