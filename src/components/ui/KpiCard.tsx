import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  deltaPct?: number;
  deltaLabel?: string;
  icon?: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'brand' | 'violet';
  spark?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

const accents: Record<NonNullable<KpiCardProps['tone']>, string> = {
  neutral: 'text-ink-300',
  success: 'text-emerald-400',
  warning: 'text-amber-400',
  danger: 'text-rose-400',
  brand: 'text-brand-400',
  violet: 'text-violet-400',
};

export function KpiCard({
  label,
  value,
  sub,
  deltaPct,
  deltaLabel,
  icon,
  tone = 'neutral',
  spark,
  footer,
  className,
}: KpiCardProps) {
  const deltaPositive = (deltaPct ?? 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-hairline/[0.08] bg-gradient-to-b from-ink-850 to-ink-900 p-5 shadow-card',
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-60 blur-2xl transition-opacity group-hover:opacity-90"
        style={{
          background:
            tone === 'brand'
              ? 'radial-gradient(circle, rgba(42,120,245,0.22), transparent 70%)'
              : tone === 'success'
                ? 'radial-gradient(circle, rgba(52,211,153,0.18), transparent 70%)'
                : tone === 'warning'
                  ? 'radial-gradient(circle, rgba(251,191,36,0.16), transparent 70%)'
                  : tone === 'danger'
                    ? 'radial-gradient(circle, rgba(251,113,133,0.18), transparent 70%)'
                    : tone === 'violet'
                      ? 'radial-gradient(circle, rgba(167,139,250,0.2), transparent 70%)'
                      : 'radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)',
        }}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-ink-400 font-medium">
            {label}
          </div>
          <div className="mt-2 text-[28px] font-semibold tracking-tight leading-none text-ink-100">
            {value}
          </div>
          {sub && <div className="mt-1.5 text-xs text-ink-400">{sub}</div>}
        </div>
        {icon && (
          <div
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg border border-hairline/[0.08] bg-overlay-1/5',
              accents[tone],
            )}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="relative mt-4 flex items-end justify-between gap-3">
        <div className="flex items-center gap-2">
          {typeof deltaPct === 'number' && (
            <div
              className={cn(
                'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold',
                deltaPositive
                  ? 'bg-emerald-400/10 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-400/10 text-rose-700 dark:text-rose-300',
              )}
            >
              {deltaPositive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {Math.abs(deltaPct).toFixed(1)}%
            </div>
          )}
          {deltaLabel && <span className="text-[11px] text-ink-400">{deltaLabel}</span>}
        </div>
        {spark && <div className="h-10 w-28 shrink-0 opacity-90">{spark}</div>}
      </div>

      {footer && <div className="relative mt-4 border-t border-hairline/[0.08] pt-3 text-xs text-ink-400">{footer}</div>}
    </motion.div>
  );
}
