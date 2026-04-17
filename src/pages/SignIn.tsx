import { useState, FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, AtSign, Lock } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Field } from '@/components/auth/AuthFields';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/Toast';

interface LocState {
  from?: string;
}

export default function SignIn() {
  const nav = useNavigate();
  const loc = useLocation();
  const { signIn, continueAsDemo, DEMO_EMAIL } = useAuth();
  const { show } = useToast();

  const from = (loc.state as LocState | null)?.from ?? '/';

  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState('demo1234');
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (!email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid work email';
    if (!password) next.password = 'Password is required';
    else if (password.length < 4) next.password = 'Password is too short';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      signIn(email);
      show({ tone: 'success', title: 'Welcome back', body: 'Loading your network…' });
      nav(from, { replace: true });
    }, 600);
  };

  const onGoogle = () => {
    continueAsDemo();
    show({ tone: 'success', title: 'Signed in with Google', body: 'Loading your network…' });
    nav(from, { replace: true });
  };

  return (
    <AuthLayout>
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight text-ink-100">Welcome back</h1>
        <p className="mt-1.5 text-sm text-ink-400">
          Sign in to your Meridian control tower.
        </p>

        <form onSubmit={onSubmit} className="mt-7 space-y-4">
          <Field
            label="Work email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            icon={<AtSign className="h-3.5 w-3.5" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <Field
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            icon={<Lock className="h-3.5 w-3.5" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-xs text-ink-300 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-brand-500"
              />
              Remember me for 30 days
            </label>
            <button
              type="button"
              onClick={() => show({ tone: 'info', title: 'Reset link sent', body: 'Check your inbox for instructions.' })}
              className="text-xs text-brand-700 dark:text-brand-300 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={submitting}
            iconRight={!submitting ? <ArrowRight className="h-3.5 w-3.5" /> : undefined}
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <div className="mt-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-ink-400">
          <span className="flex-1 h-px bg-hairline/[0.12]" />
          or continue with
          <span className="flex-1 h-px bg-hairline/[0.12]" />
        </div>

        <button
          type="button"
          onClick={onGoogle}
          className="mt-4 w-full inline-flex items-center justify-center gap-2.5 rounded-lg border border-hairline/[0.12] bg-ink-900 hover:bg-ink-850 h-10 text-sm font-medium text-ink-100 transition-colors focus-ring"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="mt-8 text-center text-sm text-ink-400">
          New to Meridian?{' '}
          <Link to="/signup" className="text-brand-700 dark:text-brand-300 font-medium hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" fill="#34A853" />
      <path d="M5.84 14.12A6.6 6.6 0 0 1 5.5 12c0-.74.13-1.46.34-2.12V7.04H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.96l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" fill="#EA4335" />
    </svg>
  );
}
