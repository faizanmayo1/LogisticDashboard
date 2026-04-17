import { ReactNode } from 'react';
import { AlertTriangle, Info, Sparkles, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/cn';

type Tone = 'ai' | 'warning' | 'danger' | 'info' | 'success';

const styles: Record<Tone, { wrap: string; icon: ReactNode; label: string }> = {
  ai: {
    wrap: 'from-brand-500/10 via-violet-500/10 to-transparent border-brand-400/20',
    icon: <Sparkles className="h-4 w-4" />,
    label: 'AI Recommendation',
  },
  warning: {
    wrap: 'from-amber-400/10 via-amber-400/5 to-transparent border-amber-400/25',
    icon: <AlertTriangle className="h-4 w-4" />,
    label: 'Attention',
  },
  danger: {
    wrap: 'from-rose-500/12 via-rose-500/6 to-transparent border-rose-400/25',
    icon: <ShieldAlert className="h-4 w-4" />,
    label: 'Critical',
  },
  info: {
    wrap: 'from-cyan-400/10 via-cyan-400/5 to-transparent border-cyan-400/20',
    icon: <Info className="h-4 w-4" />,
    label: 'Info',
  },
  success: {
    wrap: 'from-emerald-400/10 via-emerald-400/5 to-transparent border-emerald-400/20',
    icon: <CheckCircle2 className="h-4 w-4" />,
    label: 'Resolved',
  },
};

const toneText: Record<Tone, string> = {
  ai: 'text-brand-700 dark:text-brand-200',
  warning: 'text-amber-700 dark:text-amber-200',
  danger: 'text-rose-700 dark:text-rose-200',
  info: 'text-cyan-700 dark:text-cyan-200',
  success: 'text-emerald-700 dark:text-emerald-200',
};

interface AlertBannerProps {
  tone?: Tone;
  label?: string;
  title: ReactNode;
  body?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function AlertBanner({
  tone = 'ai',
  label,
  title,
  body,
  actions,
  className,
}: AlertBannerProps) {
  const s = styles[tone];
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border bg-gradient-to-r p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4',
        s.wrap,
        className,
      )}
    >
      <div className="flex items-start gap-3 flex-1">
        <div
          className={cn(
            'mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg border border-hairline/[0.12] bg-overlay-1/5',
            toneText[tone],
          )}
        >
          {s.icon}
        </div>
        <div className="flex-1">
          <div className={cn('text-[11px] font-semibold uppercase tracking-[0.14em]', toneText[tone])}>
            {label ?? s.label}
          </div>
          <div className="mt-0.5 text-sm font-medium text-ink-100">{title}</div>
          {body && <div className="mt-1 text-xs text-ink-300 leading-relaxed">{body}</div>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
