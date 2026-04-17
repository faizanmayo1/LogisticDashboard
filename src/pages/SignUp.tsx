import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, AtSign, Building2, Lock, User } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Field } from '@/components/auth/AuthFields';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/Toast';

const ROLE_OPTIONS = [
  { value: 'vp-ops', label: 'VP / Director of Operations' },
  { value: 'logistics-mgr', label: 'Logistics Manager' },
  { value: 'supply-chain', label: 'Supply Chain Lead' },
  { value: 'cfo', label: 'CFO / Finance' },
  { value: 'ceo', label: 'CEO / Founder' },
  { value: 'analyst', label: 'Analyst' },
  { value: 'other', label: 'Other' },
];

export default function SignUp() {
  const nav = useNavigate();
  const { signUp, continueAsDemo } = useAuth();
  const { show } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('vp-ops');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const validate = () => {
    const next: typeof errors = {};
    if (!name.trim() || name.trim().split(/\s+/).length < 2) next.name = 'Enter your full name';
    if (!email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid work email';
    if (!company.trim()) next.company = 'Company is required';
    if (!password || password.length < 8) next.password = 'Use 8+ characters';
    if (!agree) next.agree = 'You must accept the terms';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      const roleLabel = ROLE_OPTIONS.find((r) => r.value === role)?.label;
      signUp({ name, email, company, role: roleLabel });
      show({
        tone: 'success',
        title: 'Account created',
        body: `Welcome, ${name.split(' ')[0]} — your workspace is ready.`,
      });
      nav('/', { replace: true });
    }, 700);
  };

  const onGoogle = () => {
    continueAsDemo();
    show({ tone: 'success', title: 'Workspace created via Google', body: 'Loading your network…' });
    nav('/', { replace: true });
  };

  return (
    <AuthLayout>
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight text-ink-100">Start your trial</h1>
        <p className="mt-1.5 text-sm text-ink-400">
          14 days, full platform, no credit card required.
        </p>

        <form onSubmit={onSubmit} className="mt-7 space-y-4">
          <Field
            label="Full name"
            placeholder="Ava Rahman"
            icon={<User className="h-3.5 w-3.5" />}
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            autoComplete="name"
          />
          <Field
            label="Work email"
            type="email"
            placeholder="you@company.com"
            icon={<AtSign className="h-3.5 w-3.5" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="email"
          />
          <Field
            label="Company"
            placeholder="Acme Logistics"
            icon={<Building2 className="h-3.5 w-3.5" />}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            error={errors.company}
            autoComplete="organization"
          />
          <div>
            <span className="text-[12px] font-medium text-ink-200">Your role</span>
            <div className="mt-1.5">
              <Dropdown
                value={role}
                options={ROLE_OPTIONS}
                onChange={setRole}
                className="w-full [&>button]:w-full [&>button]:h-10 [&>button]:rounded-lg"
              />
            </div>
          </div>
          <Field
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            icon={<Lock className="h-3.5 w-3.5" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            hint="Mix of letters, numbers, and symbols recommended."
            autoComplete="new-password"
          />

          <label className="flex items-start gap-2 text-xs text-ink-300 cursor-pointer">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 accent-brand-500"
            />
            <span>
              I agree to the{' '}
              <a className="text-brand-700 dark:text-brand-300 hover:underline" href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>
              {' '}and{' '}
              <a className="text-brand-700 dark:text-brand-300 hover:underline" href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.
            </span>
          </label>
          {errors.agree && (
            <div className="text-[11px] text-rose-700 dark:text-rose-300 -mt-2">{errors.agree}</div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={submitting}
            iconRight={!submitting ? <ArrowRight className="h-3.5 w-3.5" /> : undefined}
          >
            {submitting ? 'Creating workspace…' : 'Create account'}
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
          Sign up with Google
        </button>

        <div className="mt-8 text-center text-sm text-ink-400">
          Already have an account?{' '}
          <Link to="/signin" className="text-brand-700 dark:text-brand-300 font-medium hover:underline">
            Sign in
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
