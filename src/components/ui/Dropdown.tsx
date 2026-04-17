import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

export interface DropdownOption {
  label: string;
  value: string;
  description?: string;
}

interface DropdownProps {
  label?: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  icon?: ReactNode;
  className?: string;
  align?: 'left' | 'right';
  placeholder?: string;
}

export function Dropdown({
  label,
  value,
  options,
  onChange,
  icon,
  className,
  align = 'left',
  placeholder,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onEsc);
    return () => {
      window.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'group inline-flex items-center gap-2 rounded-lg border border-hairline/[0.08] bg-ink-900 px-3 h-9 text-xs transition-colors hover:bg-ink-850 focus-ring',
          open && 'bg-ink-850',
        )}
      >
        {icon && <span className="text-ink-400">{icon}</span>}
        {label && <span className="text-ink-400">{label}:</span>}
        <span className="font-medium text-ink-100">{current?.label ?? placeholder ?? 'Select'}</span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 text-ink-400 transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className={cn(
              'absolute z-30 mt-1.5 min-w-[220px] rounded-xl border border-hairline/[0.12] bg-ink-900 shadow-card backdrop-blur p-1',
              align === 'right' ? 'right-0' : 'left-0',
            )}
          >
            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
                    active ? 'bg-overlay-1/[0.06] text-ink-100' : 'text-ink-200 hover:bg-overlay-1/[0.04]',
                  )}
                >
                  <Check
                    className={cn('h-3.5 w-3.5 shrink-0', active ? 'text-brand-500' : 'opacity-0')}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate">{opt.label}</div>
                    {opt.description && (
                      <div className="text-[11px] text-ink-400 truncate">{opt.description}</div>
                    )}
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
