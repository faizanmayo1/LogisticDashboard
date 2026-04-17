import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'subtle';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-500 hover:bg-brand-400 text-white border border-brand-400/40 shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_8px_24px_-8px_rgba(42,120,245,0.6)]',
  secondary:
    'bg-ink-800 hover:bg-ink-750 text-ink-100 border border-hairline/[0.12]',
  subtle:
    'bg-overlay-1/5 hover:bg-overlay-1/10 text-ink-100 border border-hairline/[0.08]',
  ghost:
    'bg-transparent hover:bg-overlay-1/5 text-ink-200 border border-transparent',
  danger:
    'bg-rose-500/90 hover:bg-rose-500 text-white border border-rose-400/40',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 text-xs px-3 gap-1.5',
  md: 'h-9 text-sm px-3.5 gap-2',
  lg: 'h-10 text-sm px-4 gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'secondary', size = 'md', icon, iconRight, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium tracking-tight transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  ),
);
Button.displayName = 'Button';

export function IconButton({
  className,
  variant = 'ghost',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  const sz = { sm: 'h-8 w-8', md: 'h-9 w-9', lg: 'h-10 w-10' }[size];
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg transition-colors focus-ring',
        variants[variant],
        sz,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
