import { ReactNode } from 'react';
import { Brain, CircleDollarSign, Eye, ShieldCheck, Sparkles, Workflow } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-ink-950 flex flex-col lg:flex-row">
      {/* Brand panel */}
      <aside className="relative hidden lg:flex lg:w-[44%] xl:w-[40%] flex-col justify-between overflow-hidden p-10 xl:p-14 text-white bg-gradient-to-br from-brand-700 via-brand-600 to-violet-600">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(700px 400px at 20% 0%, rgba(255,255,255,0.18), transparent 60%), radial-gradient(500px 380px at 100% 100%, rgba(167,139,250,0.35), transparent 60%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/30 backdrop-blur">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-semibold tracking-tight">Meridian</div>
              <div className="text-[11px] text-white/70">Logistics Intelligence</div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative max-w-md"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] backdrop-blur">
            <Sparkles className="h-3 w-3" />
            AI-powered control tower
          </div>
          <h2 className="mt-4 text-[30px] xl:text-[36px] font-semibold tracking-tight leading-[1.1]">
            Logistics intelligence that protects margin on every load.
          </h2>
          <p className="mt-3 text-[14px] xl:text-[15px] text-white/80 leading-relaxed">
            Drayage, warehouse, dispatch, and customer visibility — unified, with AI that turns every operational signal into a margin decision.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3">
            {[
              { icon: <Eye className="h-3.5 w-3.5" />, t: 'See everything', d: 'Live containers + shipments' },
              { icon: <Brain className="h-3.5 w-3.5" />, t: 'Predict demand', d: '12-week capacity plan' },
              { icon: <CircleDollarSign className="h-3.5 w-3.5" />, t: 'Protect margin', d: 'Per-load profitability' },
              { icon: <Workflow className="h-3.5 w-3.5" />, t: 'Auto-mitigate', d: 'AI workflows in seconds' },
            ].map((p) => (
              <div key={p.t} className="rounded-xl border border-white/15 bg-white/5 backdrop-blur p-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20">
                  {p.icon}
                </div>
                <div className="mt-2 text-sm font-semibold">{p.t}</div>
                <div className="text-[11px] text-white/70">{p.d}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="relative">
          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white text-sm font-semibold">
              MV
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] text-white/95 leading-snug">
                "We cut detention by 31% in the first quarter — and the team finally trusts one source of truth."
              </div>
              <div className="mt-1 text-[11px] text-white/60">M. Velasquez · VP Ops, Crescent Foods</div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-[11px] text-white/60">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3" />
              SOC 2 Type II
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3" />
              GDPR · CCPA
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3" />
              99.98% uptime
            </span>
          </div>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex-1 flex items-center justify-center px-6 py-10 sm:px-10 bg-ink-950">
        <div className="w-full max-w-[440px]">
          {/* Mobile-only brand header */}
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 text-white shadow-glow">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight text-ink-100">Meridian</div>
              <div className="text-[11px] text-ink-400">Logistics Intelligence</div>
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
