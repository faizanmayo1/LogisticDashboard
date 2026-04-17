import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Building2, GanttChartSquare, Globe2, Sparkles, TrendingUp } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FilterBar } from '@/components/ui/FilterBar';
import { KpiCard } from '@/components/ui/KpiCard';
import { Card, CardContent, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ChartCard } from '@/components/charts/ChartCard';
import { DataTable } from '@/components/ui/DataTable';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { GlassTooltip } from '@/components/charts/tooltip';
import { BUSINESS_UNITS } from '@/data/core';
import { entityCompare } from '@/data/series';
import { fmtUSD } from '@/lib/format';

const revenueByEntity = Array.from({ length: 12 }).map((_, i) => ({
  month: ['J','F','M','A','M','J','J','A','S','O','N','D'][i],
  West: 3200 + i * 90 + (i % 3) * 60,
  South: 2600 + i * 72 + (i % 4) * 50,
  East: 2100 + i * 55 + (i % 3) * 40,
}));

const entitiesTable = [
  { bu: 'West Coast Logistics', revenue: 31_420_000, margin: 22.4, otp: 94, exc: 3.2, fleet: 186, nodes: 12 },
  { bu: 'Gulf & Southeast', revenue: 26_100_000, margin: 18.6, otp: 89, exc: 4.1, fleet: 142, nodes: 9 },
  { bu: 'Atlantic Network', revenue: 19_840_000, margin: 14.8, otp: 91, exc: 5.8, fleet: 118, nodes: 7 },
];

export default function MultiEntityComparison() {
  return (
    <>
      <SectionHeader
        eyebrow="Portfolio · Benchmarking"
        title="Multi-Entity Comparison"
        description="Benchmark business units, regions, and customers side-by-side. AI highlights where the West Coast model can be replicated — and where South is pulling away."
        actions={
          <>
            <Button variant="subtle" icon={<Globe2 className="h-3.5 w-3.5" />}>Regions</Button>
            <Button variant="primary" icon={<Sparkles className="h-3.5 w-3.5" />}>AI playbook</Button>
          </>
        }
      />

      <FilterBar
        pills={[
          { label: 'Dimension', value: 'Business Unit' },
          { label: 'Period', value: 'YTD' },
          { label: 'Normalize', value: 'Per Load' },
        ]}
        activeCount={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {BUSINESS_UNITS.map((b, i) => {
          const row = entitiesTable[i];
          return (
            <Card key={b.id} className="overflow-hidden">
              <div
                className="h-1 w-full"
                style={{ background: `linear-gradient(90deg, ${b.color}, ${b.color}55)` }}
              />
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-ink-400">{b.region}</div>
                    <div className="mt-0.5 text-base font-semibold text-ink-100">{b.name}</div>
                  </div>
                  <Building2 className="h-4 w-4 text-ink-400" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-ink-400">Revenue YTD</div>
                    <div className="mt-0.5 mono text-base text-ink-100">{fmtUSD(row.revenue)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-ink-400">Margin</div>
                    <div className={`mt-0.5 mono text-base ${row.margin > 20 ? 'text-emerald-700 dark:text-emerald-300' : row.margin > 16 ? 'text-ink-100' : 'text-amber-700 dark:text-amber-300'}`}>{row.margin}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-ink-400">OTP</div>
                    <div className="mt-0.5 mono text-base text-ink-100">{row.otp}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-ink-400">Exception %</div>
                    <div className={`mt-0.5 mono text-base ${row.exc > 5 ? 'text-rose-700 dark:text-rose-300' : row.exc > 3.5 ? 'text-amber-700 dark:text-amber-300' : 'text-emerald-700 dark:text-emerald-300'}`}>{row.exc}%</div>
                  </div>
                </div>
                <div className="mt-4">
                  <ProgressBar value={row.margin} max={30} tone={i === 0 ? 'success' : i === 1 ? 'brand' : 'warning'} />
                </div>
                <div className="mt-3 text-[11px] text-ink-400 flex items-center justify-between">
                  <span>Fleet {row.fleet} · {row.nodes} nodes</span>
                  <span className={i === 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}>
                    {i === 0 ? '+4.2 pts vs plan' : i === 1 ? '+1.1 pts vs plan' : '-2.4 pts vs plan'}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard
          className="xl:col-span-2"
          title="Revenue Trend by Entity"
          subtitle="12-month rolling · normalized to 2026 plan"
          height={300}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueByEntity} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={48} tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} />
              <Tooltip content={<GlassTooltip />} />
              <Line type="monotone" dataKey="West" stroke="#4d95ff" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="South" stroke="#a78bfa" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="East" stroke="#2dd4bf" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Operational Benchmark" subtitle="Normalized radar · 0–100" height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={entityCompare} margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
              <PolarGrid stroke="rgb(var(--c-hairline) / 0.18)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#8891b0', fontSize: 10 }} />
              <Tooltip content={<GlassTooltip />} />
              <Radar name="West" dataKey="west" stroke="#4d95ff" fill="#4d95ff" fillOpacity={0.2} />
              <Radar name="South" dataKey="south" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.18} />
              <Radar name="East" dataKey="east" stroke="#2dd4bf" fill="#2dd4bf" fillOpacity={0.15} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Entity Scorecard</CardTitle>
            <CardSubtitle>Side-by-side metrics with peer percentile</CardSubtitle>
          </div>
          <Badge tone="brand">AI-ranked</Badge>
        </CardHeader>
        <CardContent className="pt-0">
          <DataTable
            rows={entitiesTable}
            getKey={(r) => r.bu}
            columns={[
              { key: 'bu', header: 'Business Unit', render: (r) => <span className="font-medium text-ink-100">{r.bu}</span> },
              { key: 'rev', header: 'Revenue', align: 'right', render: (r) => <span className="mono text-ink-200">{fmtUSD(r.revenue)}</span> },
              {
                key: 'margin',
                header: 'Margin %',
                align: 'right',
                render: (r) => <span className={r.margin > 20 ? 'mono text-emerald-700 dark:text-emerald-300' : r.margin > 16 ? 'mono text-ink-100' : 'mono text-amber-700 dark:text-amber-300'}>{r.margin.toFixed(1)}%</span>,
              },
              {
                key: 'otp',
                header: 'OTP',
                render: (r) => (
                  <div className="w-36">
                    <ProgressBar value={r.otp} tone={r.otp > 93 ? 'success' : r.otp > 89 ? 'brand' : 'warning'} size="sm" />
                    <div className="mt-0.5 mono text-[10px] text-ink-400">{r.otp}%</div>
                  </div>
                ),
              },
              {
                key: 'exc',
                header: 'Exception %',
                align: 'right',
                render: (r) => <span className={r.exc > 5 ? 'mono text-rose-700 dark:text-rose-300' : r.exc > 3.5 ? 'mono text-amber-700 dark:text-amber-300' : 'mono text-emerald-700 dark:text-emerald-300'}>{r.exc.toFixed(1)}%</span>,
              },
              { key: 'fleet', header: 'Fleet', align: 'right', render: (r) => <span className="mono text-ink-200">{r.fleet}</span> },
              { key: 'nodes', header: 'Nodes', align: 'right', render: (r) => <span className="mono text-ink-200">{r.nodes}</span> },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Playbook Opportunities</CardTitle>
            <CardSubtitle>Practices to replicate across the portfolio</CardSubtitle>
          </div>
          <Sparkles className="h-4 w-4 text-brand-700 dark:text-brand-300" />
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-0">
          {[
            { from: 'West', to: 'South', title: 'Street-turn program', impact: 18_400 },
            { from: 'West', to: 'East', title: 'Accessorial billing automation', impact: 24_200 },
            { from: 'South', to: 'East', title: 'Reefer compliance playbook', impact: 9_800 },
          ].map((p) => (
            <div key={p.title} className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-4">
              <div className="flex items-center justify-between text-[11px] text-ink-400">
                <span className="inline-flex items-center gap-1"><GanttChartSquare className="h-3 w-3" /> Replicate</span>
                <span className="mono">{p.from} → {p.to}</span>
              </div>
              <div className="mt-2 text-sm font-medium text-ink-100">{p.title}</div>
              <div className="mt-4 flex items-center justify-between">
                <span className="mono text-emerald-700 dark:text-emerald-300">+{fmtUSD(p.impact)}/mo</span>
                <Button variant="secondary" size="sm">Open playbook</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
