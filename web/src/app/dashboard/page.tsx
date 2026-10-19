'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Folder, ListChecks, CircleCheck, CircleAlert, Clock } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { StatCard } from '@/components/StatCard';
import { RequireAuth } from '@/components/RequireAuth';
import { api } from '@/lib/api';
import type { DashboardStats, Project, Task } from '@/lib/types';
import { isOverdue, partitionTaskStatus } from '@/lib/overdue';
import { useAuthStore } from '@/store/authStore';
import { firstNameFromEmail } from '@/lib/displayName';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { OVERDUE_CSS, STATUS_CSS } from '@/lib/statusTheme';

const barColors = [
  '[&_[data-slot=progress-indicator]]:bg-primary',
  '[&_[data-slot=progress-indicator]]:bg-violet',
  '[&_[data-slot=progress-indicator]]:bg-success',
  '[&_[data-slot=progress-indicator]]:bg-orange',
] as const;
const pctColors = [
  'text-primary',
  'text-violet',
  'text-success',
  'text-orange',
] as const;

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function DashboardContent() {
  const token = useAuthStore((s) => s.token)!;
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.getDashboard(token),
      api.listProjects(token),
      api.listAllTasks(token),
    ])
      .then(([s, p, t]) => {
        setStats(s);
        setProjects(p.slice(0, 3));
        setTasks(t);
      })
      .catch((err) => setError(err.message));
  }, [token]);

  const overdueCount = useMemo(() => tasks.filter((task) => isOverdue(task)).length, [tasks]);

  const donut = useMemo(() => {
    const slices = partitionTaskStatus(tasks);
    const total = tasks.length;
    const pct = total === 0 ? 0 : Math.round((slices.done / total) * 100);
    return { pct, ...slices };
  }, [tasks]);

  const firstName = firstNameFromEmail(user?.email);

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {greeting()}, {firstName}!
          </h1>
          <p className="mt-1 text-base text-muted-foreground">
            Here&apos;s what&apos;s happening with your projects today.
          </p>
        </div>

        {error ? <p className="text-base text-destructive">{error}</p> : null}

        {stats ? (
          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(var(--stat-min),1fr))] gap-[var(--space-stat)]">
            <StatCard
              label="Total Projects"
              value={stats.totalProjects}
              secondary={`${stats.totalProjects.toLocaleString()} active`}
              icon={Folder}
              groupLabel={`Total Projects: ${stats.totalProjects.toLocaleString()}`}
            />
            <StatCard
              label="Total Tasks"
              value={stats.totalTasks}
              secondary={
                stats.inProgressTasks == null
                  ? undefined
                  : `${stats.inProgressTasks.toLocaleString()} in progress`
              }
              icon={ListChecks}
              groupLabel={`Total Tasks: ${stats.totalTasks.toLocaleString()}`}
            />
            <StatCard
              label="Completed"
              value={stats.completedTasks}
              secondary={`${
                stats.totalTasks === 0
                  ? 0
                  : Math.round((stats.completedTasks / stats.totalTasks) * 100)
              }% of all tasks`}
              icon={CircleCheck}
              groupLabel={`Completed: ${stats.completedTasks.toLocaleString()}`}
            />
            <StatCard
              label="Overdue"
              value={overdueCount}
              secondary={
                overdueCount > 0 ? 'Needs attention' : 'All on track'
              }
              secondaryTone={overdueCount > 0 ? 'danger' : 'success'}
              icon={overdueCount > 0 ? CircleAlert : Clock}
              iconTone="neutral"
              variant={overdueCount > 0 ? 'danger' : 'default'}
              groupLabel={`Overdue: ${overdueCount.toLocaleString()} ${
                overdueCount === 1 ? 'task' : 'tasks'
              }`}
            />
          </div>
        ) : (
          <p className="text-base text-muted-foreground">Loading stats…</p>
        )}

        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Card className="min-h-[340px]">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Project progress</CardTitle>
              <CardDescription>Completion across active projects</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-5">
              {projects.length === 0 ? (
                <p className="text-base text-muted-foreground">
                  No projects yet.{' '}
                  <Button
                    variant="link"
                    className="h-auto p-0"
                    render={<Link href="/projects" />}
                  >
                    Create one
                  </Button>
                </p>
              ) : (
                projects.map((p, i) => {
                  const done = Math.round(
                    (p.completionPercent / 100) * p.taskCount
                  );
                  return (
                    <Link key={p.id} href={`/projects/${p.id}`} className="block">
                      <p className="font-semibold text-foreground">{p.name}</p>
                      <div className="mb-2 mt-1 flex items-center justify-between text-base text-muted-foreground">
                        <span>
                          {done} of {p.taskCount} tasks
                        </span>
                        <span className={`font-semibold ${pctColors[i % pctColors.length]}`}>
                          {p.completionPercent}%
                        </span>
                      </div>
                      <Progress
                        value={p.completionPercent}
                        className={`w-full ${barColors[i % barColors.length]}`}
                      />
                    </Link>
                  );
                })
              )}
            </CardContent>
          </Card>

          <Card className="min-h-[340px]">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Tasks by status</CardTitle>
              <CardDescription>Distribution across your workspace</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col items-center justify-center gap-5">
              <StatusDonut
                done={donut.done}
                progress={donut.progress}
                todo={donut.todo}
                overdue={donut.overdue}
                pct={donut.pct}
              />
              <div className="grid w-full max-w-[220px] gap-2 text-base text-muted-foreground">
                <LegendRow color={STATUS_CSS.Done} label="Completed" value={donut.done} />
                <LegendRow color={STATUS_CSS['In Progress']} label="In Progress" value={donut.progress} />
                <LegendRow color={STATUS_CSS['To Do']} label="To Do" value={donut.todo} />
                <LegendRow color={OVERDUE_CSS} label="Overdue" value={donut.overdue} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function StatusDonut({
  done,
  progress,
  todo,
  overdue,
  pct,
}: {
  done: number;
  progress: number;
  todo: number;
  overdue: number;
  pct: number;
}) {
  const size = 176;
  const stroke = 22;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const total = done + progress + todo + overdue;
  const raw = [
    { key: 'done', value: done, color: STATUS_CSS.Done },
    { key: 'progress', value: progress, color: STATUS_CSS['In Progress'] },
    { key: 'todo', value: todo, color: STATUS_CSS['To Do'] },
    { key: 'overdue', value: overdue, color: OVERDUE_CSS },
  ].filter((s) => s.value > 0);

  // Round caps extend stroke/2 past each end. Leave more than that so they don't meet.
  const gap = raw.length > 1 ? stroke + 4 : 0;

  let cursor = 0;
  const arcs = raw.map((s) => {
    const share = (s.value / total) * c;
    const len = raw.length === 1 ? c : Math.max(share - gap, 0.01);
    const dashOffset = -(cursor + gap / 2);
    cursor += share;
    return { ...s, len, dashOffset };
  });

  return (
    <div className="relative size-44">
      <svg viewBox={`0 0 ${size} ${size}`} className="size-full -rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--line)"
          strokeWidth={stroke}
        />
        {arcs.map((arc) => (
          <circle
            key={arc.key}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={arc.color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${arc.len} ${c}`}
            strokeDashoffset={arc.dashOffset}
          />
        ))}
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-2xl font-bold leading-none">{pct}%</p>
          <p className="mt-1 text-xs text-muted-foreground">complete</p>
        </div>
      </div>
    </div>
  );
}

function LegendRow({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="inline-flex items-center gap-2">
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        {label}
      </span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
