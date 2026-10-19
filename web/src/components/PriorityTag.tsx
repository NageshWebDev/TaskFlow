import { Flag } from 'lucide-react';
import type { TaskPriority } from '@/lib/types';
import { PRIORITY_FLAG } from '@/lib/statusTheme';
import { cn } from '@/lib/utils';

export function PriorityTag({ priority }: { priority: TaskPriority }) {
  const filled = priority === 'High';
  return (
    <span
      role="img"
      aria-label={`Priority: ${priority}`}
      className={cn('inline-flex shrink-0', PRIORITY_FLAG[priority])}
    >
      <Flag
        className={cn('size-3.5', filled ? 'fill-current' : 'fill-none')}
        strokeWidth={priority === 'Medium' ? 2.25 : 2}
        aria-hidden="true"
      />
    </span>
  );
}
