import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface ChartCardProps {
  title: ReactNode;
  subtitle?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  height?: number | string;
}

export function ChartCard({
  title,
  subtitle,
  right,
  children,
  footer,
  className,
  height,
}: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'relative flex flex-col rounded-2xl border border-hairline/[0.08] bg-gradient-to-b from-ink-850/80 to-ink-900/80 shadow-card overflow-hidden',
        className,
      )}
    >
      <header className="flex items-start justify-between gap-3 px-5 pt-4 pb-2">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-ink-100">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-ink-400">{subtitle}</p>}
        </div>
        {right && <div className="flex items-center gap-2">{right}</div>}
      </header>
      <div className="flex-1 px-3 pb-2" style={{ height }}>
        {children}
      </div>
      {footer && <div className="border-t border-hairline/[0.08] px-5 py-2.5 text-xs text-ink-400">{footer}</div>}
    </motion.div>
  );
}

export function ChartLegend({
  items,
  className,
}: {
  items: { label: string; color: string; value?: string }[];
  className?: string;
}) {
  return (
    <div className={cn('flex flex-wrap items-center gap-4 text-xs', className)}>
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: it.color }} />
          <span className="text-ink-300">{it.label}</span>
          {it.value && <span className="mono text-ink-400">{it.value}</span>}
        </div>
      ))}
    </div>
  );
}
