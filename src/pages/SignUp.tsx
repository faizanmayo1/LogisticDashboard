import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, AtSign, Building2, Lock, Sparkles, User } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Field, SsoButton } from '@/components/auth/AuthFields';
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

const COMPANY_SIZE_OPTIONS = [
  { value: '1-50', label: '1–50 employees' },
  { value: '51-200', label: '51–200 employees' },
  { value: '201-1000', label: '201–1,000 employees' },
  { value: '1001-5000', label: '1,001–5,000 employees' },
  { value: '5000+', label: '5,000+ employees' },
];

export default function SignUp() {
  const nav = useNavigate();
  const { signUp, continueAsDemo } = useAuth();
  const { show } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('vp-ops');
  const [companySize, setCompanySize] = useState('201-1000');
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

  return (
    <AuthLayout>
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight text-ink-100">Start your trial</h1>
        <p className="mt-1.5 text-sm text-ink-400">
          14 days, full platform, no credit card required.
        </p>

        <button
          type="button"
          onClick={() => {
            continueAsDemo();
            show({ tone: 'ai', title: 'Loaded the demo workspace', body: 'Use this to walk through the platform without setup.' });
            nav('/', { replace: true });
          }}
          className="mt-6 w-full group relative overflow-hidden rounded-xl border border-brand-400/30 bg-gradient-to-r from-brand-500/15 via-violet-500/10 to-brand-500/15 p-3.5 text-left transition-colors hover:from-brand-500/25 hover:to-brand-500/25 focus-ring"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-500 text-white shadow-glow">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-ink-100">Tour the platform without signing up</div>
              <div className="text-[11px] text-ink-400">Skip the form — load the demo workspace instantly.</div>
            </div>
            <ArrowRight className="h-4 w-4 text-brand-700 dark:text-brand-300 transition-transform group-hover:translate-x-0.5" />
          </div>
        </button>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <SsoButton provider="google" onClick={() => { continueAsDemo(); nav('/', { replace: true }); }} />
          <SsoButton provider="microsoft" onClick={() => { continueAsDemo(); nav('/', { replace: true }); }} />
          <SsoButton provider="sso" onClick={() => { continueAsDemo(); nav('/', { replace: true }); }} />
        </div>

        <div className="mt-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-ink-400">
          <span className="flex-1 h-px bg-hairline/[0.12]" />
          or sign up with email
          <span className="flex-1 h-px bg-hairline/[0.12]" />
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            <div>
              <span className="text-[12px] font-medium text-ink-200">Company size</span>
              <div className="mt-1.5">
                <Dropdown
                  value={companySize}
                  options={COMPANY_SIZE_OPTIONS}
                  onChange={setCompanySize}
                  className="w-full [&>button]:w-full [&>button]:h-10 [&>button]:rounded-lg"
                />
              </div>
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

        <div className="mt-6 text-center text-sm text-ink-400">
          Already have an account?{' '}
          <Link to="/signin" className="text-brand-700 dark:text-brand-300 font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
