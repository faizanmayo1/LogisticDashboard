import { cn } from '@/lib/cn';

interface ProgressBarProps {
  value: number;
  max?: number;
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'violet' | 'neutral';
  label?: string;
  size?: 'sm' | 'md';
  showValue?: boolean;
  className?: string;
}

const toneBg: Record<NonNullable<ProgressBarProps['tone']>, string> = {
  brand: 'bg-brand-500',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger: 'bg-rose-400',
  violet: 'bg-violet-400',
  neutral: 'bg-ink-400',
};

export function ProgressBar({
  value,
  max = 100,
  tone = 'brand',
  label,
  size = 'md',
  showValue,
  className,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="mb-1 flex items-center justify-between text-[11px]">
          {label && <span className="text-ink-300">{label}</span>}
          {showValue && <span className="mono text-ink-400">{pct.toFixed(0)}%</span>}
        </div>
      )}
      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-overlay-1/5',
          size === 'sm' ? 'h-1.5' : 'h-2',
        )}
      >
        <div
          className={cn('h-full rounded-full transition-all', toneBg[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function StackBar({
  segments,
  className,
  height = 8,
}: {
  segments: { value: number; tone: NonNullable<ProgressBarProps['tone']>; label?: string }[];
  className?: string;
  height?: number;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div
      className={cn('w-full overflow-hidden rounded-full bg-overlay-1/5 flex', className)}
      style={{ height }}
    >
      {segments.map((s, i) => (
        <div
          key={i}
          className={cn('h-full', toneBg[s.tone])}
          style={{ width: `${(s.value / total) * 100}%` }}
          title={s.label}
        />
      ))}
    </div>
  );
}
