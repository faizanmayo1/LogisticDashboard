import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ReactNode, useEffect } from 'react';
import { cn } from '@/lib/cn';
import { IconButton } from './Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
};

export function Modal({ open, onClose, title, subtitle, children, footer, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className={cn(
              'relative w-full rounded-2xl border border-hairline/[0.12] bg-ink-900 shadow-2xl flex flex-col max-h-[85vh]',
              sizes[size],
            )}
          >
            {(title || subtitle) && (
              <header className="flex items-start justify-between gap-4 border-b border-hairline/[0.08] px-6 py-4">
                <div>
                  {title && <h2 className="text-base font-semibold tracking-tight text-ink-100">{title}</h2>}
                  {subtitle && <p className="mt-0.5 text-xs text-ink-400">{subtitle}</p>}
                </div>
                <IconButton onClick={onClose} aria-label="Close">
                  <X className="h-4 w-4" />
                </IconButton>
              </header>
            )}
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
            {footer && (
              <footer className="border-t border-hairline/[0.08] px-6 py-4 flex items-center justify-end gap-2">
                {footer}
              </footer>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
