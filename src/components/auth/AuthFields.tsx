import { InputHTMLAttributes, ReactNode, forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/cn';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, error, hint, icon, className, type, ...props }, ref) => {
    const [show, setShow] = useState(false);
    const isPassword = type === 'password';
    const effectiveType = isPassword && show ? 'text' : type;
    return (
      <label className="block">
        <span className="text-[12px] font-medium text-ink-200">{label}</span>
        <div
          className={cn(
            'mt-1.5 relative flex items-center rounded-lg border bg-ink-900 transition-colors',
            error
              ? 'border-rose-400/50 focus-within:border-rose-400'
              : 'border-hairline/[0.12] focus-within:border-brand-400/60',
          )}
        >
          {icon && (
            <span className="pl-3 text-ink-400 pointer-events-none">{icon}</span>
          )}
          <input
            ref={ref}
            type={effectiveType}
            className={cn(
              'w-full h-10 bg-transparent px-3 text-sm text-ink-100 placeholder-ink-400 outline-none',
              icon && 'pl-2',
              isPassword && 'pr-10',
              className,
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-md text-ink-400 hover:text-ink-100 hover:bg-overlay-1/[0.06] transition-colors"
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
        {error ? (
          <span className="mt-1 block text-[11px] text-rose-700 dark:text-rose-300">{error}</span>
        ) : hint ? (
          <span className="mt-1 block text-[11px] text-ink-400">{hint}</span>
        ) : null}
      </label>
    );
  },
);
Field.displayName = 'Field';

export function SsoButton({
  provider,
  onClick,
}: {
  provider: 'google' | 'microsoft' | 'sso';
  onClick?: () => void;
}) {
  const meta = {
    google: { label: 'Continue with Google', icon: <GoogleIcon /> },
    microsoft: { label: 'Continue with Microsoft', icon: <MicrosoftIcon /> },
    sso: { label: 'Continue with SAML SSO', icon: <SsoIcon /> },
  }[provider];

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-hairline/[0.12] bg-ink-900 hover:bg-ink-850 h-10 text-sm font-medium text-ink-100 transition-colors focus-ring"
    >
      <span className="h-4 w-4 inline-flex items-center justify-center">{meta.icon}</span>
      {meta.label}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.12A6.6 6.6 0 0 1 5.5 12c0-.74.13-1.46.34-2.12V7.04H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.96l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
        fill="#EA4335"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <rect x="2" y="2" width="9.5" height="9.5" fill="#F35325" />
      <rect x="12.5" y="2" width="9.5" height="9.5" fill="#81BC06" />
      <rect x="2" y="12.5" width="9.5" height="9.5" fill="#05A6F0" />
      <rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#FFBA08" />
    </svg>
  );
}

function SsoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2 4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
