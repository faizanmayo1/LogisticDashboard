import { ReactNode, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { IconButton } from './Button';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  width?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  width = 'w-[560px]',
  children,
  footer,
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.aside
            className={cn(
              'fixed right-0 top-0 z-50 h-full border-l border-hairline/[0.08] bg-ink-900 shadow-2xl flex flex-col',
              width,
            )}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 36 }}
          >
            <header className="flex items-start justify-between gap-4 border-b border-hairline/[0.08] px-6 py-4">
              <div>
                {title && (
                  <h2 className="text-base font-semibold tracking-tight text-ink-100">{title}</h2>
                )}
                {subtitle && <p className="mt-0.5 text-xs text-ink-400">{subtitle}</p>}
              </div>
              <IconButton onClick={onClose} aria-label="Close">
                <X className="h-4 w-4" />
              </IconButton>
            </header>
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
            {footer && (
              <footer className="border-t border-hairline/[0.08] px-6 py-4 flex items-center justify-end gap-2">
                {footer}
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
