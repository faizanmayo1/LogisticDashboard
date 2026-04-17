import { useState, FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, AtSign, Lock, Sparkles } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Field, SsoButton } from '@/components/auth/AuthFields';
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

  const onDemo = () => {
    continueAsDemo();
    show({ tone: 'ai', title: 'Signed in as demo user', body: 'Ava Rahman · VP Operations · Halcyon Retail Group' });
    nav('/', { replace: true });
  };

  return (
    <AuthLayout>
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight text-ink-100">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-ink-400">
          Sign in to your Meridian control tower.
        </p>

        {/* Demo bypass — top of page so it's impossible to miss on a live call */}
        <button
          type="button"
          onClick={onDemo}
          className="mt-6 w-full group relative overflow-hidden rounded-xl border border-brand-400/30 bg-gradient-to-r from-brand-500/15 via-violet-500/10 to-brand-500/15 p-3.5 text-left transition-colors hover:from-brand-500/25 hover:to-brand-500/25 focus-ring"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-500 text-white shadow-glow">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-ink-100">Continue as demo user</div>
              <div className="text-[11px] text-ink-400">Skip the form — load Ava's executive view instantly.</div>
            </div>
            <ArrowRight className="h-4 w-4 text-brand-700 dark:text-brand-300 transition-transform group-hover:translate-x-0.5" />
          </div>
        </button>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <SsoButton provider="google" onClick={onDemo} />
          <SsoButton provider="microsoft" onClick={onDemo} />
          <SsoButton provider="sso" onClick={onDemo} />
        </div>

        <div className="mt-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-ink-400">
          <span className="flex-1 h-px bg-hairline/[0.12]" />
          or sign in with email
          <span className="flex-1 h-px bg-hairline/[0.12]" />
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
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

        <div className="mt-6 text-center text-sm text-ink-400">
          New to Meridian?{' '}
          <Link to="/signup" className="text-brand-700 dark:text-brand-300 font-medium hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
