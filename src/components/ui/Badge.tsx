import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type BadgeTone =
  | 'neutral'
  | 'brand'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'violet'
  | 'amber';

const tones: Record<BadgeTone, string> = {
  neutral: 'border-hairline/[0.12] bg-overlay-1/5 text-ink-200',
  brand: 'border-brand-500/30 bg-brand-500/10 text-brand-700 dark:text-brand-200',
  success: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300',
  warning: 'border-amber-400/30 bg-amber-400/10 text-amber-700 dark:text-amber-300',
  danger: 'border-rose-400/30 bg-rose-400/10 text-rose-700 dark:text-rose-300',
  info: 'border-cyan-400/25 bg-cyan-400/10 text-cyan-700 dark:text-cyan-300',
  violet: 'border-violet-400/25 bg-violet-400/10 text-violet-700 dark:text-violet-300',
  amber: 'border-amber-400/30 bg-amber-400/10 text-amber-700 dark:text-amber-300',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  dot?: boolean;
  icon?: ReactNode;
}

export function Badge({ tone = 'neutral', dot, icon, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider',
        tones[tone],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            tone === 'success' && 'bg-emerald-400 animate-pulseDot',
            tone === 'warning' && 'bg-amber-400 animate-pulseDot',
            tone === 'danger' && 'bg-rose-400 animate-pulseDot',
            tone === 'info' && 'bg-cyan-400 animate-pulseDot',
            tone === 'brand' && 'bg-brand-400 animate-pulseDot',
            tone === 'violet' && 'bg-violet-400 animate-pulseDot',
            tone === 'amber' && 'bg-amber-400 animate-pulseDot',
            tone === 'neutral' && 'bg-ink-300',
          )}
        />
      )}
      {icon}
      {children}
    </span>
  );
}
