'use client';

import { FormEvent, useEffect, useState } from 'react';
import type { TaskPriority, TaskStatus } from '@/lib/types';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '@/lib/taskOptions';
import { FilterSelect } from '@/components/FilterControl';
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

export type TaskFormValues = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
};

const EMPTY: TaskFormValues = {
  title: '',
  description: '',
  status: 'To Do',
  priority: 'Medium',
  dueDate: '',
};

export function TaskFormDialog({
  open,
  onOpenChange,
  mode,
  error,
  initial,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  error?: string;
  initial?: TaskFormValues;
  onSubmit: (values: TaskFormValues) => void | Promise<void>;
}) {
  const [values, setValues] = useState<TaskFormValues>(EMPTY);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!open) return;
    setValues(initial ?? EMPTY);
    // Snapshot when the dialog opens; ignore later parent re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      await onSubmit(values);
    } finally {
      setPending(false);
    }
  }

  const isEdit = mode === 'edit';

  return (
    <Dialog open={open} onOpenChange={onOpenChange} disablePointerDismissal>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Update task' : 'Add task'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Edit the details for this task.' : 'Create a task for this project.'}
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-[var(--space-4)]" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="task-title">Title</FieldLabel>
              <Input
                id="task-title"
                value={values.title}
                onChange={(e) => setValues((next) => ({ ...next, title: e.target.value }))}
                required
                className="h-[var(--control-h)]"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="task-desc">Description</FieldLabel>
              <Textarea
                id="task-desc"
                value={values.description}
                onChange={(e) =>
                  setValues((next) => ({ ...next, description: e.target.value }))
                }
              />
            </Field>
            <div className="grid gap-[var(--space-4)] md:grid-cols-2">
              <Field>
                <FieldLabel>Status</FieldLabel>
                <FilterSelect
                  aria-label="Status"
                  value={values.status}
                  onValueChange={(v) =>
                    setValues((next) => ({ ...next, status: v as TaskStatus }))
                  }
                  items={STATUS_OPTIONS}
                />
              </Field>
              <Field>
                <FieldLabel>Priority</FieldLabel>
                <FilterSelect
                  aria-label="Priority"
                  value={values.priority}
                  onValueChange={(v) =>
                    setValues((next) => ({ ...next, priority: v as TaskPriority }))
                  }
                  items={PRIORITY_OPTIONS}
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="task-due">Due date</FieldLabel>
              <Input
                id="task-due"
                type="date"
                value={values.dueDate}
                onChange={(e) => setValues((next) => ({ ...next, dueDate: e.target.value }))}
                required
                className="h-[var(--control-h)]"
              />
            </Field>
            {error ? <FieldError>{error}</FieldError> : null}
          </FieldGroup>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {isEdit ? 'Save changes' : 'Add task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
