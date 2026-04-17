import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowRight,
  ArrowUpRight,
  Brain,
  CircleDollarSign,
  Eye,
  PackageCheck,
  Sparkles,
  Timer,
  TrendingUp,
  Workflow as WorkflowIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { KpiCard } from '@/components/ui/KpiCard';
import { Sparkline } from '@/components/charts/Sparkline';
import { ChartCard, ChartLegend } from '@/components/charts/ChartCard';
import { GlassTooltip } from '@/components/charts/tooltip';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { revenueVsMargin } from '@/data/series';
import { fmtUSD } from '@/lib/format';
import { Download, FileText, Gauge } from 'lucide-react';

const kpiSpark1 = [12, 14, 13, 16, 15, 18, 19, 17, 20, 22, 21, 24];
const kpiSpark2 = [18, 17, 19, 16, 15, 14, 16, 15, 13, 14, 12, 13];
const kpiSpark3 = [32, 28, 30, 27, 29, 31, 28, 26, 27, 29, 30, 32];
const kpiSpark4 = [62, 60, 64, 66, 65, 68, 70, 72, 71, 74, 76, 78];

const DEMO_STEPS = [
  { label: 'Container at port', tone: 'warning' as const, path: '/containers' },
  { label: 'AI flags free-time risk', tone: 'brand' as const, path: '/exceptions' },
  { label: 'Margin protected $4,000', tone: 'success' as const, path: '/margin' },
];

export default function ExecutiveDashboard() {
  const nav = useNavigate();
  const { show } = useToast();
  const [boardOpen, setBoardOpen] = useState(false);

  return (
    <>
      {/* Hero — what the product is, in one read */}
      <Card className="overflow-hidden">
        <div className="relative px-6 py-7 md:px-8 md:py-9">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(620px 280px at 12% 0%, rgba(77,149,255,0.18), transparent 60%), radial-gradient(520px 280px at 90% 100%, rgba(167,139,250,0.18), transparent 60%)',
            }}
          />
          <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-400/30 bg-brand-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-700 dark:text-brand-200">
                <Sparkles className="h-3 w-3" />
                AI-powered logistics intelligence
              </div>
              <h1 className="mt-3 text-[28px] md:text-[32px] font-semibold tracking-tight leading-tight text-ink-100">
                One control tower for your logistics network.
              </h1>
              <p className="mt-2 text-[15px] text-ink-300 leading-relaxed">
                Drayage, warehouse, dispatch, and customer visibility — unified by AI that turns every signal into a margin decision.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Button
                  variant="primary"
                  size="lg"
                  iconRight={<ArrowRight className="h-3.5 w-3.5" />}
                  onClick={() => nav('/containers')}
                >
                  Walk through a live scenario
                </Button>
                <Button
                  variant="subtle"
                  size="lg"
                  icon={<Gauge className="h-3.5 w-3.5" />}
                  onClick={() => setBoardOpen(true)}
                >
                  Generate board pack
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 lg:max-w-[400px]">
              {[
                { icon: <Eye className="h-4 w-4" />, t: 'See', d: 'Containers & shipments' },
                { icon: <Brain className="h-4 w-4" />, t: 'Predict', d: 'Demand & capacity' },
                { icon: <CircleDollarSign className="h-4 w-4" />, t: 'Protect', d: 'Margin per load' },
                { icon: <WorkflowIcon className="h-4 w-4" />, t: 'Act', d: 'Auto-mitigate' },
              ].map((p) => (
                <div
                  key={p.t}
                  className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.03] px-3 py-3"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 border border-brand-400/30 text-brand-700 dark:text-brand-300">
                    {p.icon}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-ink-100">{p.t}</div>
                  <div className="mt-0.5 text-[11px] leading-snug text-ink-400">{p.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Demo flow strip */}
      <Card>
        <CardContent className="p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-ink-400 shrink-0">
              Today's Demo Story
            </div>
            <div className="hidden md:block h-5 w-px bg-hairline/[0.12]" />
            <div className="flex-1 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm">
              {DEMO_STEPS.map((s, i, arr) => (
                <div key={s.label} className="flex items-center gap-2">
                  <button
                    onClick={() => nav(s.path)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-transform hover:scale-[1.03] focus-ring ${
                      s.tone === 'warning' ? 'bg-amber-400/10 text-amber-700 dark:text-amber-200 border border-amber-400/30'
                      : s.tone === 'brand' ? 'bg-brand-500/10 text-brand-700 dark:text-brand-200 border border-brand-400/30'
                      : 'bg-emerald-400/10 text-emerald-700 dark:text-emerald-200 border border-emerald-400/30'
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {s.label}
                  </button>
                  {i < arr.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-ink-400" />}
                </div>
              ))}
            </div>
            <Button
              variant="primary"
              size="sm"
              iconRight={<ArrowRight className="h-3.5 w-3.5" />}
              onClick={() => nav(DEMO_STEPS[0].path)}
            >
              Open scenario
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI row — the 4 numbers leadership cares about */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Network Revenue · MTD"
          value={fmtUSD(18_420_000)}
          deltaPct={6.4}
          deltaLabel="vs last month"
          tone="brand"
          icon={<CircleDollarSign className="h-4 w-4" />}
          spark={<Sparkline data={kpiSpark1} color="#4d95ff" />}
        />
        <KpiCard
          label="Gross Margin"
          value="18.9%"
          deltaPct={2.4}
          deltaLabel="vs plan"
          tone="success"
          icon={<TrendingUp className="h-4 w-4" />}
          spark={<Sparkline data={kpiSpark4} color="#34d399" />}
        />
        <KpiCard
          label="On-Time Delivery"
          value="93.2%"
          deltaPct={-1.1}
          deltaLabel="vs last 30d"
          tone="warning"
          icon={<Timer className="h-4 w-4" />}
          spark={<Sparkline data={kpiSpark3} color="#fbbf24" />}
        />
        <KpiCard
          label="Active Exceptions"
          value="42"
          sub="12 critical · MTTR 2h 14m"
          deltaPct={-12.5}
          deltaLabel="resolved vs opened"
          tone="danger"
          icon={<PackageCheck className="h-4 w-4" />}
          spark={<Sparkline data={kpiSpark2} color="#fb7185" />}
        />
      </div>

      {/* Main chart — story-anchored revenue + margin + forecast */}
      <ChartCard
        title="Revenue, Margin & Forecast"
        subtitle="Monthly actuals with AI demand forecast overlay"
        right={
          <ChartLegend
            items={[
              { label: 'Revenue', color: '#4d95ff' },
              { label: 'Forecast', color: '#a78bfa' },
              { label: 'Margin %', color: '#34d399' },
            ]}
          />
        }
        height={300}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueVsMargin} margin={{ top: 18, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4d95ff" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#4d95ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fcst" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={56} tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} />
            <Tooltip content={<GlassTooltip />} />
            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#4d95ff" strokeWidth={2} fill="url(#rev)" />
            <Area type="monotone" dataKey="forecast" name="Forecast" stroke="#a78bfa" strokeDasharray="4 4" strokeWidth={1.5} fill="url(#fcst)" />
            <Line type="monotone" dataKey="margin" name="Margin %" stroke="#34d399" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* AI value moment — the one card that proves ROI */}
      <Card className="overflow-hidden">
        <div className="relative p-6 md:p-7">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(420px 220px at 80% 0%, rgba(167,139,250,0.18), transparent 60%)',
            }}
          />
          <div className="relative flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-brand-700 dark:text-brand-300 inline-flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> AI Wins · This Week
              </div>
              <div className="mt-2 flex items-baseline gap-3">
                <div className="text-[40px] font-semibold tracking-tight text-ink-100 leading-none">
                  {fmtUSD(142_800)}
                </div>
                <div className="inline-flex items-center gap-1 rounded-md bg-emerald-400/10 px-1.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  <ArrowUpRight className="h-3 w-3" /> 18.6%
                </div>
              </div>
              <div className="mt-1 text-sm text-ink-400">savings captured by Meridian AI this week</div>
              <Button
                className="mt-4"
                variant="subtle"
                iconRight={<ArrowRight className="h-3.5 w-3.5" />}
                onClick={() => nav('/margin')}
              >
                See where it came from
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2.5 md:max-w-[420px] w-full">
              {[
                { label: 'Dispatch optimization', value: 68_400 },
                { label: 'Free-time pulls',       value: 41_200 },
                { label: 'Lane re-rate',          value: 22_600 },
                { label: 'Street-turn matches',   value: 10_600 },
              ].map((r) => (
                <div key={r.label} className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.03] p-3">
                  <div className="text-[11px] text-ink-400">{r.label}</div>
                  <div className="mt-1 mono text-base font-semibold text-emerald-700 dark:text-emerald-300">
                    +{fmtUSD(r.value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Modal
        open={boardOpen}
        onClose={() => setBoardOpen(false)}
        size="lg"
        title="Generate Weekly Board Pack"
        subtitle="Assembled from live data · 12 sections · ready in seconds"
        footer={
          <>
            <Button variant="ghost" onClick={() => setBoardOpen(false)}>Cancel</Button>
            <Button
              variant="secondary"
              icon={<FileText className="h-3.5 w-3.5" />}
              onClick={() => {
                setBoardOpen(false);
                show({ tone: 'success', title: 'Board pack queued · sent to your inbox' });
              }}
            >
              Email to me
            </Button>
            <Button
              variant="primary"
              icon={<Download className="h-3.5 w-3.5" />}
              onClick={() => {
                setBoardOpen(false);
                show({ tone: 'success', title: 'Board pack downloading', body: 'meridian-board-pack-W17.pdf · 4.2 MB' });
              }}
            >
              Download PDF
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {[
              'Network revenue & margin',
              'Lane profitability ranked',
              'Top exception drivers',
              'Warehouse capacity pressure',
              'Drayage performance',
              'Customer service levels',
              'Carrier scorecard',
              'Multi-entity comparison',
              'AI savings captured',
              'Growth-readiness signals',
              'SLA breach summary',
              'Forecast next 4 weeks',
            ].map((s) => (
              <label
                key={s}
                className="flex items-center gap-2 rounded-lg border border-hairline/[0.08] bg-overlay-1/[0.02] px-3 py-2 text-sm text-ink-200 cursor-pointer hover:bg-overlay-1/[0.04] transition-colors"
              >
                <input type="checkbox" defaultChecked className="accent-brand-500" />
                {s}
              </label>
            ))}
          </div>
          <div className="rounded-xl border border-brand-400/30 bg-brand-500/5 p-3 text-xs text-ink-300">
            <span className="font-semibold text-brand-700 dark:text-brand-200">Format:</span> PDF + Excel · <span className="font-semibold text-brand-700 dark:text-brand-200">Cadence:</span> Weekly (auto-scheduled every Monday 06:00)
          </div>
        </div>
      </Modal>
    </>
  );
}
