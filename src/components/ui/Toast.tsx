import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, Sparkles, X } from 'lucide-react';
import { ReactNode, createContext, useCallback, useContext, useState } from 'react';
import { cn } from '@/lib/cn';

type ToastTone = 'success' | 'info' | 'ai';
interface Toast {
  id: string;
  tone: ToastTone;
  title: string;
  body?: string;
}

interface Ctx {
  show: (t: Omit<Toast, 'id'>) => void;
}

const ToastCtx = createContext<Ctx>({ show: () => {} });

export function useToast() {
  return useContext(ToastCtx);
}

const styles: Record<ToastTone, { wrap: string; icon: ReactNode; label: string }> = {
  success: {
    wrap: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-700 dark:text-emerald-200',
    icon: <CheckCircle2 className="h-4 w-4" />,
    label: 'Done',
  },
  info: {
    wrap: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-700 dark:text-cyan-200',
    icon: <Info className="h-4 w-4" />,
    label: 'Info',
  },
  ai: {
    wrap: 'border-brand-400/30 bg-brand-500/10 text-brand-700 dark:text-brand-200',
    icon: <Sparkles className="h-4 w-4" />,
    label: 'AI',
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((cur) => [...cur, { ...t, id }]);
    setTimeout(() => setToasts((cur) => cur.filter((x) => x.id !== id)), 4200);
  }, []);

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[60] flex flex-col gap-2 w-[360px] max-w-[calc(100vw-2rem)]">
        <AnimatePresence>
          {toasts.map((t) => {
            const s = styles[t.tone];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                className={cn(
                  'pointer-events-auto rounded-xl border bg-ink-900 shadow-card backdrop-blur p-3.5 flex items-start gap-3',
                  s.wrap,
                )}
              >
                <div className="mt-0.5 shrink-0">{s.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-ink-100 leading-tight">{t.title}</div>
                  {t.body && <div className="mt-0.5 text-xs text-ink-300 leading-relaxed">{t.body}</div>}
                </div>
                <button
                  className="text-ink-400 hover:text-ink-200 transition-colors"
                  onClick={() => setToasts((cur) => cur.filter((x) => x.id !== t.id))}
                  aria-label="Dismiss"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}
