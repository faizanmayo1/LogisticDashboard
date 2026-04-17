import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Brain,
  CircleDollarSign,
  Container as ContainerIcon,
  Eye,
  Gauge,
  PackageCheck,
  Sparkles,
  Timer,
  TrendingUp,
  Truck,
  Workflow as WorkflowIcon,
} from 'lucide-react';
import { KpiCard } from '@/components/ui/KpiCard';
import { Sparkline } from '@/components/charts/Sparkline';
import { ChartCard, ChartLegend } from '@/components/charts/ChartCard';
import { GlassTooltip } from '@/components/charts/tooltip';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { Card, CardContent, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/Card';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Timeline } from '@/components/ui/Timeline';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { revenueVsMargin, shipmentVolume, exceptionMix, liveFeed } from '@/data/series';
import { SHIPMENTS } from '@/data/shipments';
import { BUSINESS_UNITS, WAREHOUSES } from '@/data/core';
import { fmtCompact, fmtUSD } from '@/lib/format';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { Download, FileText } from 'lucide-react';

const kpiSpark1 = [12, 14, 13, 16, 15, 18, 19, 17, 20, 22, 21, 24];
const kpiSpark2 = [18, 17, 19, 16, 15, 14, 16, 15, 13, 14, 12, 13];
const kpiSpark3 = [32, 28, 30, 27, 29, 31, 28, 26, 27, 29, 30, 32];
const kpiSpark4 = [62, 60, 64, 66, 65, 68, 70, 72, 71, 74, 76, 78];

// Click-through demo path. Each step navigates to the relevant page.
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
      {/* Hero — communicates what the product is in 10 seconds */}
      <Card className="overflow-hidden">
        <div className="relative px-6 py-7 md:px-8 md:py-8">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(620px 280px at 12% 0%, rgba(77,149,255,0.18), transparent 60%), radial-gradient(520px 280px at 90% 100%, rgba(167,139,250,0.18), transparent 60%)',
            }}
          />
          <div className="relative flex flex-col lg:flex-row lg:items-end gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-400/30 bg-brand-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-700 dark:text-brand-200">
                <Sparkles className="h-3 w-3" />
                AI-powered logistics intelligence
              </div>
              <h1 className="mt-3 text-[28px] md:text-[34px] font-semibold tracking-tight leading-tight text-ink-100">
                One control tower for your entire logistics network.
              </h1>
              <p className="mt-2 text-[15px] md:text-base text-ink-300 max-w-2xl leading-relaxed">
                Meridian unifies drayage, warehouse, dispatch, and customer visibility — and uses AI to turn every operational signal into a margin decision.
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

            {/* Product positioning — 4 things at a glance */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 lg:max-w-[520px]">
              {[
                { icon: <Eye className="h-4 w-4" />, t: 'See', d: 'Every container & shipment, live' },
                { icon: <Brain className="h-4 w-4" />, t: 'Predict', d: 'Demand, capacity, exceptions' },
                { icon: <CircleDollarSign className="h-4 w-4" />, t: 'Protect', d: 'Margin on every load' },
                { icon: <WorkflowIcon className="h-4 w-4" />, t: 'Act', d: 'Auto-mitigate in seconds' },
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

      {/* Demo flow strip — the one-line story for the call */}
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

      <AlertBanner
        tone="ai"
        title="Margin recovery opportunity on SAV → ATL drayage lane"
        body="Detention and chassis fees have compressed margin to 9.2%. Meridian recommends negotiating chassis rate (-$0.18/day), adding street-turn incentive, and lifting fuel surcharge by 4.2% — projected recovery of $46,800/mo."
        actions={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => show({ tone: 'info', title: 'Recommendation snoozed for 7 days' })}
            >
              Dismiss
            </Button>
            <Button
              variant="primary"
              size="sm"
              iconRight={<ArrowRight className="h-3.5 w-3.5" />}
              onClick={() => nav('/margin')}
            >
              Open playbook
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Network Revenue · MTD"
          value={fmtUSD(18_420_000)}
          deltaPct={6.4}
          deltaLabel="vs. last month"
          tone="brand"
          icon={<CircleDollarSign className="h-4 w-4" />}
          spark={<Sparkline data={kpiSpark1} color="#4d95ff" />}
          footer={
            <div className="flex items-center justify-between">
              <span>Forecast: {fmtUSD(24_900_000)}</span>
              <Badge tone="success">Beating plan</Badge>
            </div>
          }
        />
        <KpiCard
          label="Gross Margin"
          value="18.9%"
          deltaPct={2.4}
          deltaLabel="vs. plan"
          tone="success"
          icon={<TrendingUp className="h-4 w-4" />}
          spark={<Sparkline data={kpiSpark4} color="#34d399" />}
          footer={
            <div className="flex items-center justify-between">
              <span>3 lanes at risk</span>
              <Badge tone="warning">Watch</Badge>
            </div>
          }
        />
        <KpiCard
          label="On-Time Delivery"
          value="93.2%"
          deltaPct={-1.1}
          deltaLabel="vs. last 30d"
          tone="warning"
          icon={<Timer className="h-4 w-4" />}
          spark={<Sparkline data={kpiSpark3} color="#fbbf24" />}
          footer={
            <div className="flex items-center justify-between">
              <span>Redline Freight dragging</span>
              <Badge tone="danger">86.2%</Badge>
            </div>
          }
        />
        <KpiCard
          label="Active Exceptions"
          value="42"
          sub="12 critical, 14 at-risk SLA"
          deltaPct={-12.5}
          deltaLabel="resolved vs. opened"
          tone="danger"
          icon={<PackageCheck className="h-4 w-4" />}
          spark={<Sparkline data={kpiSpark2} color="#fb7185" />}
          footer={
            <div className="flex items-center justify-between">
              <span>Avg. MTTR 2h 14m</span>
              <Badge tone="success">-8%</Badge>
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard
          className="xl:col-span-2"
          title="Revenue, Margin & Forecast"
          subtitle="Monthly actuals with AI demand forecast overlay"
          right={
            <>
              <ChartLegend
                items={[
                  { label: 'Revenue', color: '#4d95ff' },
                  { label: 'Forecast', color: '#a78bfa' },
                  { label: 'Margin %', color: '#34d399' },
                ]}
              />
            </>
          }
          height={320}
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

        <ChartCard
          title="Exception Mix"
          subtitle="By category, last 30 days"
          height={320}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={exceptionMix} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={110} />
              <Tooltip content={<GlassTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                {exceptionMix.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard
          className="xl:col-span-2"
          title="Shipment Volume"
          subtitle="Delivered vs. exceptions · 30-day window"
          height={260}
          right={<Badge tone="brand" dot>Live</Badge>}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={shipmentVolume} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <Tooltip content={<GlassTooltip />} />
              <Line type="monotone" dataKey="shipments" name="Total" stroke="#4d95ff" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="delivered" name="Delivered" stroke="#34d399" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="exceptions" name="Exceptions" stroke="#fb7185" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Live Network Feed</CardTitle>
              <CardSubtitle>Cross-facility operational events</CardSubtitle>
            </div>
            <Badge tone="success" dot>
              Streaming
            </Badge>
          </CardHeader>
          <CardContent className="pt-1">
            <Timeline
              items={liveFeed.map((l, i) => ({
                id: `${i}`,
                time: l.time,
                title: l.text,
                tone:
                  l.tone === 'success' ? 'success'
                  : l.tone === 'warning' ? 'warning'
                  : l.tone === 'brand' ? 'brand'
                  : l.tone === 'info' ? 'neutral'
                  : 'neutral',
              }))}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>At-risk Shipments</CardTitle>
              <CardSubtitle>Flagged by AI across network · sorted by margin impact</CardSubtitle>
            </div>
            <Button variant="ghost" size="sm" iconRight={<ArrowRight className="h-3.5 w-3.5" />}>
              Open queue
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <DataTable
              rows={SHIPMENTS.filter((s) => s.sla !== 'on-track' || s.marginPct < 10).slice(0, 6)}
              getKey={(r) => r.id}
              columns={[
                {
                  key: 'ref',
                  header: 'Shipment',
                  render: (r) => (
                    <div>
                      <div className="font-medium text-ink-100 mono text-[13px]">{r.ref}</div>
                      <div className="text-[11px] text-ink-400">{r.customer}</div>
                    </div>
                  ),
                },
                { key: 'lane', header: 'Lane', render: (r) => <span className="text-ink-200">{r.lane}</span> },
                {
                  key: 'status',
                  header: 'Status',
                  render: (r) => (
                    <Badge
                      tone={
                        r.status === 'Exception' ? 'danger' :
                        r.status === 'In Transit' ? 'info' :
                        r.status === 'Delivered' ? 'success' :
                        r.status === 'At Warehouse' ? 'neutral' :
                        r.status === 'Out for Delivery' ? 'brand' :
                        'neutral'
                      }
                      dot
                    >
                      {r.status}
                    </Badge>
                  ),
                },
                {
                  key: 'sla',
                  header: 'SLA',
                  render: (r) => (
                    <Badge tone={r.sla === 'on-track' ? 'success' : r.sla === 'at-risk' ? 'warning' : 'danger'}>
                      {r.sla}
                    </Badge>
                  ),
                },
                {
                  key: 'margin',
                  header: 'Margin',
                  align: 'right',
                  render: (r) => (
                    <span className={r.marginPct < 0 ? 'text-rose-700 dark:text-rose-300 font-semibold mono' : 'text-ink-100 mono'}>
                      {r.marginPct.toFixed(1)}%
                    </span>
                  ),
                },
                {
                  key: 'rev',
                  header: 'Revenue',
                  align: 'right',
                  render: (r) => <span className="mono text-ink-200">{fmtUSD(r.revenueUSD)}</span>,
                },
              ] as Column<(typeof SHIPMENTS)[number]>[]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Business Unit Snapshot</CardTitle>
              <CardSubtitle>Margin and on-time by region</CardSubtitle>
            </div>
            <Badge tone="brand">Q2</Badge>
          </CardHeader>
          <CardContent className="space-y-5 pt-0">
            {BUSINESS_UNITS.map((b, i) => {
              const margin = [22.4, 18.6, 14.8][i];
              const otp = [94, 89, 91][i];
              return (
                <div key={b.id}>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ background: b.color }}
                      />
                      <span className="text-sm font-medium text-ink-100">{b.name}</span>
                    </div>
                    <div className="flex items-center gap-3 mono text-xs">
                      <span className="text-ink-300">Margin {margin}%</span>
                      <span className="text-ink-300">OTP {otp}%</span>
                    </div>
                  </div>
                  <ProgressBar value={margin} max={30} tone={i === 0 ? 'success' : i === 1 ? 'brand' : 'warning'} />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Network Capacity</CardTitle>
              <CardSubtitle>Today</CardSubtitle>
            </div>
            <Boxes className="h-4 w-4 text-ink-400" />
          </CardHeader>
          <CardContent className="space-y-3">
            {WAREHOUSES.slice(0, 4).map((w) => (
              <div key={w.id}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-ink-200">{w.code} · {w.city.split(',')[0]}</span>
                  <span className="mono text-ink-400">{w.storageUtilPct}%</span>
                </div>
                <ProgressBar value={w.storageUtilPct} tone={w.storageUtilPct > 90 ? 'danger' : w.storageUtilPct > 80 ? 'warning' : 'brand'} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Drayage Today</CardTitle>
              <CardSubtitle>Container movements</CardSubtitle>
            </div>
            <ContainerIcon className="h-4 w-4 text-ink-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-3xl font-semibold text-ink-100">184</div>
                <div className="text-xs text-ink-400">moves completed</div>
              </div>
              <div className="text-right">
                <div className="mono text-emerald-700 dark:text-emerald-300 text-sm">+11%</div>
                <div className="text-[11px] text-ink-400">vs yesterday</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg border border-hairline/[0.08] bg-overlay-1/[0.03] p-2">
                <div className="mono text-sm text-ink-100">92</div>
                <div className="text-[10px] text-ink-400 uppercase">Pulled</div>
              </div>
              <div className="rounded-lg border border-hairline/[0.08] bg-overlay-1/[0.03] p-2">
                <div className="mono text-sm text-ink-100">71</div>
                <div className="text-[10px] text-ink-400 uppercase">Delivered</div>
              </div>
              <div className="rounded-lg border border-hairline/[0.08] bg-overlay-1/[0.03] p-2">
                <div className="mono text-sm text-ink-100">21</div>
                <div className="text-[10px] text-ink-400 uppercase">Empty</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Carrier Scorecard</CardTitle>
              <CardSubtitle>Top performers this week</CardSubtitle>
            </div>
            <Truck className="h-4 w-4 text-ink-400" />
          </CardHeader>
          <CardContent className="space-y-2.5">
            {[
              { name: 'Summit Truckload', pct: 96.4, tone: 'success' as const },
              { name: 'Westbound Drayage', pct: 94.1, tone: 'success' as const },
              { name: 'Atlas Intermodal', pct: 91.7, tone: 'brand' as const },
              { name: 'Harbor Point Dray', pct: 88.4, tone: 'warning' as const },
              { name: 'Redline Freight', pct: 86.2, tone: 'danger' as const },
            ].map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-ink-200">{c.name}</span>
                  <span className="mono text-ink-400">{c.pct}%</span>
                </div>
                <ProgressBar value={c.pct} tone={c.tone} size="sm" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>AI Wins · Week</CardTitle>
              <CardSubtitle>Value driven by Meridian AI</CardSubtitle>
            </div>
            <Badge tone="brand" dot>Live</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-3xl font-semibold text-ink-100">{fmtUSD(142_800)}</div>
                <div className="text-xs text-ink-400">savings captured this week</div>
              </div>
              <div className="inline-flex items-center gap-1 rounded-md bg-emerald-400/10 px-1.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <ArrowUpRight className="h-3 w-3" /> 18.6%
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-300">Dispatch optimization</span>
                <span className="mono text-ink-100">{fmtUSD(68_400)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-300">Free-time pulls</span>
                <span className="mono text-ink-100">{fmtUSD(41_200)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-300">Lane re-rate</span>
                <span className="mono text-ink-100">{fmtUSD(22_600)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-300">Street-turn matches</span>
                <span className="mono text-ink-100">{fmtUSD(10_600)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                show({ tone: 'success', title: 'Board pack queued · sent to your inbox', body: 'Includes lane profitability, exception drivers, capacity pressure, and growth bottlenecks.' });
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
            <span className="font-semibold text-brand-700 dark:text-brand-200">Format:</span> PDF + Excel · <span className="font-semibold text-brand-700 dark:text-brand-200">Audience:</span> Board, executive team · <span className="font-semibold text-brand-700 dark:text-brand-200">Cadence:</span> Weekly (auto-scheduled every Monday 06:00)
          </div>
        </div>
      </Modal>
    </>
  );
}
