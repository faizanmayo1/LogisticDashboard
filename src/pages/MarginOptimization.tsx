import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import {
  ArrowDownRight,
  ArrowUpRight,
  Coins,
  Crosshair,
  DollarSign,
  Flame,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FilterBar } from '@/components/ui/FilterBar';
import { KpiCard } from '@/components/ui/KpiCard';
import { Card, CardContent, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/Card';
import { ChartCard } from '@/components/charts/ChartCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { ProgressBar, StackBar } from '@/components/ui/ProgressBar';
import { DataTable } from '@/components/ui/DataTable';
import { GlassTooltip } from '@/components/charts/tooltip';
import { laneMargin, marginWaterfall } from '@/data/series';
import { LANES } from '@/data/core';
import { fmtUSD } from '@/lib/format';
import { useToast } from '@/components/ui/Toast';
import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

const recommendations = [
  {
    id: 'rec-1',
    title: 'Raise fuel surcharge 4.2% on SAV → ATL',
    confidence: 92,
    impact: 46_800,
    horizon: '30d',
    category: 'Pricing',
  },
  {
    id: 'rec-2',
    title: 'Reroute 4 Redline Freight lanes to Summit',
    confidence: 87,
    impact: 28_400,
    horizon: '14d',
    category: 'Carrier',
  },
  {
    id: 'rec-3',
    title: 'Add street-turn incentive at LAX & OAK',
    confidence: 78,
    impact: 18_200,
    horizon: '60d',
    category: 'Dray',
  },
  {
    id: 'rec-4',
    title: 'Renegotiate chassis pool rate (−$0.18/day)',
    confidence: 81,
    impact: 22_600,
    horizon: '90d',
    category: 'Contract',
  },
];

export default function MarginOptimization() {
  const { show } = useToast();
  const [applied, setApplied] = useState<Record<string, boolean>>({});
  const apply = (id: string, title: string, impact: number) => {
    setApplied((s) => ({ ...s, [id]: true }));
    show({ tone: 'ai', title: 'Recommendation applied', body: `${title} · projected +${fmtUSD(impact)}/mo` });
  };
  return (
    <>
      <SectionHeader
        eyebrow="Intelligence · Financial"
        title="Margin Optimization"
        description="AI finds where margin leaks — and where it's hidden. Every shipment, lane, carrier, and customer, scored for profitability."
        actions={
          <>
            <Button variant="subtle" icon={<Coins className="h-3.5 w-3.5" />} onClick={() => show({ tone: 'info', title: 'Cost model opened', body: '7 cost categories · weighted by volume.' })}>
              Cost model
            </Button>
            <Button
              variant="primary"
              icon={<Sparkles className="h-3.5 w-3.5" />}
              onClick={() => show({ tone: 'ai', title: 'Top 3 plays applied', body: `Projected recovery: ${fmtUSD(97_800)} / month across SAV→ATL, Redline reroute, chassis pool.` })}
            >
              Apply top 3
            </Button>
          </>
        }
      />

      <FilterBar
        pills={[
          { label: 'Horizon', value: 'Last 30d' },
          { label: 'Mode', value: 'All' },
          { label: 'Segment', value: 'All customers' },
        ]}
        activeCount={3}
      />

      <AlertBanner
        tone="danger"
        label="Negative Margin"
        title="SHP-1021 · SAV → ATL · margin −21.4%"
        body="Root cause: 6.5h detention + rehandle at consolidation warehouse. AI recommends auto-billing accessorials and generating claim packet. Recovery: $900."
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={() => show({ tone: 'info', title: 'Opening SHP-1021', body: 'Customer: Crescent Foods · Lane: SAV → ATL' })}>
              View shipment
            </Button>
            <Button variant="primary" size="sm" onClick={() => show({ tone: 'success', title: 'Claim packet generated', body: 'Detention 6.5h + rehandle = $900 · sent to billing & customer.' })}>
              Generate packet
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Gross margin · MTD" value="18.9%" sub="vs plan 16.5%" deltaPct={2.4} tone="success" icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard label="Margin at risk" value={fmtUSD(142_000)} sub="across 12 lanes" deltaPct={-6.1} tone="warning" icon={<TrendingDown className="h-4 w-4" />} />
        <KpiCard label="AI recovery queued" value={fmtUSD(116_000)} sub="4 plays in flight" deltaPct={12.4} tone="brand" icon={<Crosshair className="h-4 w-4" />} />
        <KpiCard label="Negative-margin loads" value="14" sub="of 2,418 active" deltaPct={-28.2} tone="danger" icon={<Flame className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard
          className="xl:col-span-2"
          title="Margin Waterfall · Network"
          subtitle="Revenue builds to net margin across accessorials, cost, detention, and rehandling"
          height={320}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={marginWaterfall} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="stage" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip content={<GlassTooltip />} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {marginWaterfall.map((r, i) => (
                  <Cell
                    key={i}
                    fill={
                      r.type === 'base' ? '#4d95ff'
                      : r.type === 'gain' ? '#34d399'
                      : r.type === 'loss' ? '#fb7185'
                      : '#a78bfa'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Cost Composition</CardTitle>
              <CardSubtitle>Where every dollar lands</CardSubtitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <StackBar
              height={14}
              segments={[
                { value: 52, tone: 'brand', label: 'Carrier' },
                { value: 14, tone: 'violet', label: 'Chassis' },
                { value: 10, tone: 'success', label: 'Labor' },
                { value: 9, tone: 'warning', label: 'Fuel' },
                { value: 7, tone: 'danger', label: 'Detention' },
                { value: 8, tone: 'neutral', label: 'Other' },
              ]}
            />
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { c: '#4d95ff', l: 'Carrier', v: '52%' },
                { c: '#a78bfa', l: 'Chassis', v: '14%' },
                { c: '#34d399', l: 'Labor', v: '10%' },
                { c: '#fbbf24', l: 'Fuel', v: '9%' },
                { c: '#fb7185', l: 'Detention', v: '7%' },
                { c: '#545c7a', l: 'Other', v: '8%' },
              ].map((r) => (
                <div key={r.l} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: r.c }} />
                  <span className="text-ink-300">{r.l}</span>
                  <span className="ml-auto mono text-ink-100">{r.v}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <ChartCard
        title="Lane Margin × Volume"
        subtitle="Bubble size = revenue · filter outliers to prioritize action"
        height={320}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 16, right: 20, left: 0, bottom: 16 }}>
            <CartesianGrid />
            <XAxis
              type="number"
              dataKey="volume"
              name="Volume"
              tickLine={false}
              axisLine={false}
              label={{ value: 'Volume', fill: '#8891b0', dy: 16, fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="margin"
              name="Margin %"
              tickLine={false}
              axisLine={false}
              label={{ value: 'Margin %', angle: -90, fill: '#8891b0', dx: -10, fontSize: 11 }}
            />
            <ZAxis range={[80, 400]} dataKey="volume" />
            <Tooltip content={<GlassTooltip />} />
            <Scatter data={laneMargin}>
              {laneMargin.map((l, i) => (
                <Cell
                  key={i}
                  fill={l.margin > 20 ? '#34d399' : l.margin > 14 ? '#4d95ff' : '#fb7185'}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>AI Recommendations</CardTitle>
              <CardSubtitle>Ranked by projected recovery</CardSubtitle>
            </div>
            <Badge tone="brand" dot>Live</Badge>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-0">
            {recommendations.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-4 hover:bg-overlay-1/[0.04] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-ink-100">{r.title}</div>
                    <div className="mt-1 text-[11px] text-ink-400">
                      {r.category} · {r.horizon} horizon
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="mono text-base font-semibold text-emerald-700 dark:text-emerald-300">
                      +{fmtUSD(r.impact)}
                    </div>
                    <div className="text-[10px] text-ink-400">projected / month</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <ProgressBar value={r.confidence} tone="brand" size="sm" className="flex-1" />
                  <span className="mono text-xs text-ink-300 w-14 text-right">{r.confidence}% conf</span>
                  {applied[r.id] ? (
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Applied
                    </span>
                  ) : (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => show({ tone: 'info', title: `Preview · ${r.title}`, body: `Confidence ${r.confidence}% · ${r.horizon} horizon · projected ${fmtUSD(r.impact)}/mo` })}
                      >
                        Preview
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => apply(r.id, r.title, r.impact)}
                      >
                        Apply
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Lane Profitability</CardTitle>
              <CardSubtitle>Top lanes ranked by contribution</CardSubtitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <DataTable
              rows={LANES}
              getKey={(r) => r.id}
              columns={[
                {
                  key: 'lane',
                  header: 'Lane',
                  render: (r) => (
                    <div>
                      <div className="text-sm text-ink-100 font-medium">
                        {r.origin.split(',')[0]} → {r.destination.split(',')[0]}
                      </div>
                      <div className="text-[11px] text-ink-400">{r.mode}</div>
                    </div>
                  ),
                },
                {
                  key: 'volume',
                  header: 'Volume',
                  align: 'right',
                  render: (r) => <span className="mono text-ink-200">{r.volume.toLocaleString()}</span>,
                },
                {
                  key: 'margin',
                  header: 'Margin',
                  align: 'right',
                  render: (r) => (
                    <span className={r.marginPct > 18 ? 'mono text-emerald-700 dark:text-emerald-300' : r.marginPct > 12 ? 'mono text-ink-100' : 'mono text-rose-700 dark:text-rose-300'}>
                      {r.marginPct.toFixed(1)}%
                    </span>
                  ),
                },
                {
                  key: 'trend',
                  header: 'Trend',
                  align: 'right',
                  render: (r) => (
                    <span
                      className={`inline-flex items-center gap-1 mono text-xs ${
                        r.trendPct >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      {r.trendPct >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(r.trendPct).toFixed(1)}%
                    </span>
                  ),
                },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
