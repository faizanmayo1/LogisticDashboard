import { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div>
        {eyebrow && (
          <div className="mb-1.5 text-[11px] uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300/90 font-semibold">
            {eyebrow}
          </div>
        )}
        <h1 className="text-[22px] font-semibold tracking-tight text-ink-100">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-300 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

export function SubHeader({
  title,
  description,
  actions,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-end justify-between gap-3', className)}>
      <div>
        <h3 className="text-sm font-semibold tracking-tight text-ink-100">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-ink-400">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
