import { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface TimelineItem {
  id: string;
  time: string;
  title: ReactNode;
  description?: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'brand' | 'violet';
  icon?: ReactNode;
  meta?: ReactNode;
}

const toneBg: Record<NonNullable<TimelineItem['tone']>, string> = {
  neutral: 'bg-ink-500',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger: 'bg-rose-400',
  brand: 'bg-brand-400',
  violet: 'bg-violet-400',
};

export function Timeline({ items, className }: { items: TimelineItem[]; className?: string }) {
  return (
    <ol className={cn('relative', className)}>
      <div className="absolute left-[14px] top-1 bottom-1 w-px bg-overlay-1/5" aria-hidden />
      {items.map((it) => {
        const tone = it.tone ?? 'neutral';
        return (
          <li key={it.id} className="relative flex gap-3 pb-4 last:pb-0">
            <div className="relative z-10 mt-1">
              <div
                className={cn(
                  'flex h-[30px] w-[30px] items-center justify-center rounded-full border border-hairline/[0.12] bg-ink-900 text-ink-200',
                )}
              >
                {it.icon ?? <span className={cn('h-2 w-2 rounded-full', toneBg[tone])} />}
              </div>
            </div>
            <div className="flex-1 pt-1">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm text-ink-100 font-medium">{it.title}</div>
                <div className="text-[11px] font-mono text-ink-400 shrink-0">{it.time}</div>
              </div>
              {it.description && (
                <div className="mt-0.5 text-xs text-ink-400 leading-relaxed">{it.description}</div>
              )}
              {it.meta && <div className="mt-2">{it.meta}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
