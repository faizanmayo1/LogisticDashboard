import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative rounded-2xl border border-hairline/[0.08] bg-gradient-to-b from-ink-850/80 to-ink-900/80 shadow-card backdrop-blur-sm',
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

export const CardHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex items-start justify-between gap-4 p-5 pb-3', className)} {...props} />
);

export const CardTitle = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('text-sm font-semibold tracking-tight text-ink-100', className)} {...props} />
);

export const CardSubtitle = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-xs text-ink-400 mt-0.5', className)} {...props} />
);

export const CardContent = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('px-5 pb-5', className)} {...props} />
);

export const CardFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'px-5 py-3 border-t border-hairline/[0.08] flex items-center justify-between text-xs text-ink-400',
      className,
    )}
    {...props}
  />
);
