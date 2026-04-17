import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Activity, Brain, CalendarDays, Sparkles, TrendingUp, Waves } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FilterBar } from '@/components/ui/FilterBar';
import { KpiCard } from '@/components/ui/KpiCard';
import { Card, CardContent, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/Card';
import { ChartCard, ChartLegend } from '@/components/charts/ChartCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { demandByCustomer, demandForecast } from '@/data/series';
import { GlassTooltip } from '@/components/charts/tooltip';
import { DataTable } from '@/components/ui/DataTable';

const scenarioResults = [
  { scenario: 'Baseline', volume: 14_800, margin: 18.4, capacity: 92, confidence: 89 },
  { scenario: 'Peak Season (+15%)', volume: 17_020, margin: 17.1, capacity: 106, confidence: 82 },
  { scenario: 'Port Strike 5d', volume: 12_240, margin: 14.9, capacity: 88, confidence: 74 },
  { scenario: 'Customer win (Halcyon +2 lanes)', volume: 15_900, margin: 19.8, capacity: 98, confidence: 86 },
];

const laneDemand = [
  { lane: 'LAX→PHX', current: 1204, forecast: 1302, change: 8.1 },
  { lane: 'LGB→LAS', current: 980, forecast: 942, change: -3.9 },
  { lane: 'SAV→ATL', current: 1530, forecast: 1691, change: 10.5 },
  { lane: 'HOU→DAL', current: 1180, forecast: 1248, change: 5.8 },
  { lane: 'EWR→BOS', current: 870, forecast: 891, change: 2.4 },
  { lane: 'OAK→SAC', current: 640, forecast: 712, change: 11.3 },
];

export default function DemandForecasting() {
  return (
    <>
      <SectionHeader
        eyebrow="Intelligence · Planning"
        title="Demand Forecasting & Capacity Planning"
        description="AI-driven demand forecasts, capacity plans, and scenario modeling. Predict the next 12 weeks — per lane, per mode, per facility."
        actions={
          <>
            <Button variant="subtle" icon={<CalendarDays className="h-3.5 w-3.5" />}>Plan cycle · Q3</Button>
            <Button variant="primary" icon={<Sparkles className="h-3.5 w-3.5" />}>Run scenario</Button>
          </>
        }
      />

      <FilterBar
        pills={[
          { label: 'Horizon', value: 'Next 12 weeks' },
          { label: 'Mode', value: 'All modes' },
          { label: 'Region', value: 'All regions' },
        ]}
        activeCount={3}
      />

      <AlertBanner
        tone="ai"
        label="Planning Signal"
        title="Peak-season surge detected on SAV → ATL · capacity will hit 106% by week 6"
        body="Meridian recommends pre-booking 28 additional drayage slots with Atlas Intermodal and staging 2 temporary sorters at SAV-07. Capex estimate: $18,400. Margin protection: $94k."
        actions={
          <>
            <Button variant="ghost" size="sm">Dismiss</Button>
            <Button variant="primary" size="sm">Apply plan</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="12-week forecast" value="173.2k" sub="shipments · 92% confidence" deltaPct={6.4} tone="brand" icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard label="Capacity gap" value="+4.1%" sub="drayage · wk 5–8" deltaPct={2.6} tone="warning" icon={<Waves className="h-4 w-4" />} />
        <KpiCard label="Model accuracy" value="94.6%" sub="MAPE · rolling 30d" deltaPct={1.3} tone="success" icon={<Brain className="h-4 w-4" />} />
        <KpiCard label="Scenarios evaluated" value="28" sub="this planning cycle" deltaPct={14} tone="violet" icon={<Activity className="h-4 w-4" />} />
      </div>

      <ChartCard
        title="Demand Forecast · 12 weeks"
        subtitle="Actuals, AI forecast, and 90% confidence band"
        right={
          <ChartLegend
            items={[
              { label: 'Actual', color: '#4d95ff' },
              { label: 'Forecast', color: '#a78bfa' },
              { label: 'Confidence', color: '#2dd4bf' },
            ]}
          />
        }
        height={320}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={demandForecast} margin={{ top: 16, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="band" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="week" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={46} />
            <Tooltip content={<GlassTooltip />} />
            <Area type="monotone" dataKey="upper" name="Upper" stroke="transparent" fill="url(#band)" />
            <Area type="monotone" dataKey="lower" name="Lower" stroke="transparent" fill="rgb(var(--c-ink-950))" fillOpacity={1} />
            <Line type="monotone" dataKey="actual" name="Actual" stroke="#4d95ff" strokeWidth={2.5} dot={{ r: 2.5 }} />
            <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#a78bfa" strokeWidth={2.5} strokeDasharray="5 5" dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Scenario Explorer</CardTitle>
              <CardSubtitle>Compare the impact of market, operational, and commercial scenarios</CardSubtitle>
            </div>
            <Badge tone="brand" dot>4 scenarios</Badge>
          </CardHeader>
          <CardContent className="pt-0">
            <DataTable
              rows={scenarioResults}
              getKey={(r) => r.scenario}
              columns={[
                {
                  key: 'scenario',
                  header: 'Scenario',
                  render: (r) => <div className="font-medium text-ink-100">{r.scenario}</div>,
                },
                {
                  key: 'volume',
                  header: 'Volume',
                  align: 'right',
                  render: (r) => <span className="mono text-ink-200">{r.volume.toLocaleString()}</span>,
                },
                {
                  key: 'margin',
                  header: 'Margin %',
                  align: 'right',
                  render: (r) => (
                    <span
                      className={
                        r.margin > 18 ? 'mono text-emerald-700 dark:text-emerald-300' : r.margin > 16 ? 'mono text-ink-100' : 'mono text-amber-700 dark:text-amber-300'
                      }
                    >
                      {r.margin.toFixed(1)}%
                    </span>
                  ),
                },
                {
                  key: 'capacity',
                  header: 'Capacity',
                  render: (r) => (
                    <div className="w-32">
                      <ProgressBar value={r.capacity} max={120} tone={r.capacity > 100 ? 'danger' : r.capacity > 95 ? 'warning' : 'success'} size="sm" />
                      <div className="mt-0.5 mono text-[10px] text-ink-400">{r.capacity}%</div>
                    </div>
                  ),
                },
                {
                  key: 'confidence',
                  header: 'Confidence',
                  align: 'right',
                  render: (r) => <Badge tone={r.confidence > 85 ? 'success' : r.confidence > 75 ? 'warning' : 'danger'}>{r.confidence}%</Badge>,
                },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Model Signals</CardTitle>
              <CardSubtitle>Features influencing current forecast</CardSubtitle>
            </div>
            <Sparkles className="h-4 w-4 text-brand-700 dark:text-brand-300" />
          </CardHeader>
          <CardContent className="space-y-2.5">
            {[
              { name: 'Retail calendar · Mother\'s Day', weight: 82, tone: 'brand' },
              { name: 'Halcyon contract expansion', weight: 74, tone: 'violet' },
              { name: 'Gulf weather corridor', weight: 58, tone: 'warning' },
              { name: 'MSC service realignment', weight: 44, tone: 'info' },
              { name: 'Chassis pool adjustment', weight: 28, tone: 'neutral' },
            ].map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-ink-200">{s.name}</span>
                  <span className="mono text-ink-400">{s.weight}%</span>
                </div>
                <ProgressBar value={s.weight} tone={s.tone as any} size="sm" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="customers">
        <TabsList>
          <TabsTrigger value="customers">By Customer</TabsTrigger>
          <TabsTrigger value="lanes">By Lane</TabsTrigger>
          <TabsTrigger value="capacity">Capacity Outlook</TabsTrigger>
        </TabsList>
        <TabsContent value="customers" className="mt-4">
          <ChartCard
            title="Demand Forecast · By Customer"
            subtitle="Top 3 customers · 12-week shipment volume"
            right={
              <ChartLegend
                items={[
                  { label: 'Halcyon', color: '#4d95ff' },
                  { label: 'Crescent', color: '#a78bfa' },
                  { label: 'Northwind', color: '#34d399' },
                ]}
              />
            }
            height={300}
            footer={
              <span>
                <span className="text-amber-700 dark:text-amber-300 font-medium">Halcyon</span> projected to exceed plan by 14% in weeks 8–12 — recommended pre-book of 28 drayage slots and 4 dock windows.
              </span>
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demandByCustomer} margin={{ top: 16, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={48} />
                <Tooltip content={<GlassTooltip />} />
                <Line type="monotone" dataKey="Halcyon"   stroke="#4d95ff" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Crescent"  stroke="#a78bfa" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Northwind" stroke="#34d399" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </TabsContent>
        <TabsContent value="lanes" className="mt-4">
          <ChartCard title="Forecast vs. Current by Lane" subtitle="Next 4 weeks" height={280}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={laneDemand} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="lane" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={46} />
                <Tooltip content={<GlassTooltip />} />
                <Bar dataKey="current" name="Current" fill="#4d95ff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="forecast" name="Forecast" fill="#a78bfa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </TabsContent>
        <TabsContent value="capacity" className="mt-4">
          <Card>
            <CardContent className="p-5 grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { mode: 'Drayage', cap: 106, gap: '+6%', tone: 'danger' },
                { mode: 'OTR', cap: 94, gap: '-6%', tone: 'success' },
                { mode: 'Intermodal', cap: 98, gap: '-2%', tone: 'brand' },
              ].map((c) => (
                <div key={c.mode} className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-ink-100">{c.mode}</div>
                    <Badge tone={c.tone as any}>{c.gap}</Badge>
                  </div>
                  <ProgressBar value={c.cap} max={120} tone={c.tone as any} showValue />
                  <div className="mt-3 text-[11px] text-ink-400">
                    Network peak capacity in 4–6 weeks
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
