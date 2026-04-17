import { ReactNode, createContext, useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

type TabsCtx = { value: string; setValue: (v: string) => void };
const Ctx = createContext<TabsCtx | null>(null);

interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (v: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({ defaultValue, value, onValueChange, children, className }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue);
  const v = value ?? internal;
  const set = (nv: string) => {
    setInternal(nv);
    onValueChange?.(nv);
  };
  return (
    <Ctx.Provider value={{ value: v, setValue: set }}>
      <div className={className}>{children}</div>
    </Ctx.Provider>
  );
}

export function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-xl border border-hairline/[0.08] bg-ink-900/80 p-1 backdrop-blur',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
  const ctx = useContext(Ctx)!;
  const active = ctx.value === value;
  return (
    <button
      onClick={() => ctx.setValue(value)}
      className={cn(
        'relative rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-ring',
        active ? 'text-ink-100' : 'text-ink-400 hover:text-ink-200',
      )}
    >
      {active && (
        <motion.span
          layoutId="tab-pill"
          className="absolute inset-0 rounded-lg bg-overlay-1/[0.08] border border-hairline/[0.12]"
          transition={{ type: 'spring', stiffness: 500, damping: 36 }}
        />
      )}
      <span className="relative">{children}</span>
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const ctx = useContext(Ctx)!;
  if (ctx.value !== value) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
