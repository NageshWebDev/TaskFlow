import Link from 'next/link';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type BreadcrumbItem = {
  label: string;
  href?: string;
  icon?: LucideIcon;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          const Icon = item.icon;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? (
                <ChevronRight
                  className="h-4 w-4 text-text-muted"
                  aria-hidden="true"
                />
              ) : null}
              {last || !item.href ? (
                <span
                  aria-current={last ? 'page' : undefined}
                  className="font-semibold text-primary underline underline-offset-2"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'inline-flex cursor-pointer items-center gap-1.5 !text-primary underline underline-offset-2',
                    'hover:!text-primary-hover',
                    'focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none',
                  )}
                >
                  {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
