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
  BookOpen,
  Code2,
  Copy,
  Database,
  LineChart as LineChartIcon,
  Play,
  Save,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FilterBar } from '@/components/ui/FilterBar';
import { KpiCard } from '@/components/ui/KpiCard';
import { Card, CardContent, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ChartCard } from '@/components/charts/ChartCard';
import { GlassTooltip } from '@/components/charts/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { customerMarginErosion, shipmentVolume } from '@/data/series';
import { fmtUSD } from '@/lib/format';

const savedViews = [
  { name: 'Lane margin leakage', updated: '3m ago', pinned: true },
  { name: 'Carrier OTP vs claim rate', updated: '1h ago', pinned: true },
  { name: 'Customer contribution 2026', updated: '2h ago', pinned: false },
  { name: 'Dwell vs exception rate', updated: '1d ago', pinned: false },
  { name: 'Weekly executive pack', updated: '2d ago', pinned: false },
];

export default function AnalyticsWorkbench() {
  return (
    <>
      <SectionHeader
        eyebrow="Intelligence · Workbench"
        title="Analytics Workbench"
        description="Ask in plain English. Meridian builds the query, visualizes the result, and lets you pin it to dashboards — no SQL required."
        actions={
          <>
            <Button variant="subtle" icon={<BookOpen className="h-3.5 w-3.5" />}>Metric catalog</Button>
            <Button variant="primary" icon={<Sparkles className="h-3.5 w-3.5" />}>Ask Meridian AI</Button>
          </>
        }
      />

      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 text-white shadow-glow">
              <Wand2 className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-ink-400 uppercase tracking-wider">Natural language query</div>
              <div className="mt-1 font-medium text-ink-100">
                "Which customers had the highest margin erosion last month due to dwell and accessorial charges?"
              </div>
            </div>
            <Button variant="subtle" icon={<Copy className="h-3.5 w-3.5" />}>Copy query</Button>
            <Button variant="primary" icon={<Play className="h-3.5 w-3.5" />}>Re-run</Button>
          </div>
          <div className="mt-4 rounded-xl border border-hairline/[0.08] bg-ink-800 p-4 mono text-xs text-ink-200 leading-relaxed">
            <div className="text-brand-700 dark:text-brand-300">SELECT</div>
            <div className="pl-4">customer_name, SUM(margin_erosion_usd) AS erosion,</div>
            <div className="pl-4">SUM(dwell_minutes) AS dwell, SUM(accessorial_usd) AS accessorials</div>
            <div className="text-brand-700 dark:text-brand-300">FROM</div>
            <div className="pl-4">fact_customer_margin_daily</div>
            <div className="text-brand-700 dark:text-brand-300">WHERE</div>
            <div className="pl-4">period_month = LAST_MONTH() AND erosion_driver IN ('dwell', 'accessorial')</div>
            <div className="text-brand-700 dark:text-brand-300">GROUP BY</div>
            <div className="pl-4">customer_name</div>
            <div className="text-brand-700 dark:text-brand-300">ORDER BY</div>
            <div className="pl-4">erosion DESC LIMIT 10;</div>
          </div>
        </CardContent>
      </Card>

      <FilterBar
        pills={[
          { label: 'Domain', value: 'Financial' },
          { label: 'Scope', value: 'Network' },
          { label: 'Time', value: 'Last 30 days' },
        ]}
        activeCount={3}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Queries this week" value="214" sub="87 saved" deltaPct={14} tone="brand" icon={<Database className="h-4 w-4" />} />
        <KpiCard label="Metrics catalog" value="182" sub="governed definitions" deltaPct={2.2} tone="violet" icon={<BookOpen className="h-4 w-4" />} />
        <KpiCard label="Active dashboards" value="36" sub="8 executive" deltaPct={5.6} tone="success" icon={<LineChartIcon className="h-4 w-4" />} />
        <KpiCard label="Avg. query time" value="1.2s" sub="99p: 2.4s" deltaPct={-18} tone="brand" icon={<Code2 className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <ChartCard
          className="xl:col-span-3"
          title="Customer Margin Erosion · Last Month"
          subtitle="Ranked by USD erosion driven by dwell + accessorials"
          height={320}
          right={
            <>
              <Button variant="ghost" size="sm" icon={<Save className="h-3.5 w-3.5" />}>Save</Button>
              <Button variant="subtle" size="sm">Pin to dashboard</Button>
            </>
          }
          footer={
            <div className="flex items-center justify-between">
              <span>
                Top driver: <span className="text-ink-200 font-medium">Crescent Foods</span> — {fmtUSD(38_400)} eroded · 4,820 dwell-min · {fmtUSD(14_200)} accessorials
              </span>
              <span className="text-brand-700 dark:text-brand-300">AI: open margin recovery playbook →</span>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[...customerMarginErosion].sort((a, b) => b.erosionUSD - a.erosionUSD)}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              layout="vertical"
            >
              <CartesianGrid horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="customer" tickLine={false} axisLine={false} width={140} />
              <Tooltip content={<GlassTooltip />} />
              <Bar dataKey="erosionUSD" name="Margin Eroded" radius={[0, 6, 6, 0]}>
                {customerMarginErosion.map((c, i) => (
                  <Cell
                    key={i}
                    fill={c.erosionUSD > 20_000 ? '#fb7185' : c.erosionUSD > 8_000 ? '#fbbf24' : '#4d95ff'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Saved Views</CardTitle>
              <CardSubtitle>Pinned + recent</CardSubtitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-1.5 pt-0">
            {savedViews.map((v) => (
              <button
                key={v.name}
                className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-ink-200 hover:bg-overlay-1/[0.04] transition-colors"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${v.pinned ? 'bg-brand-400' : 'bg-ink-500'}`} />
                <span className="flex-1 truncate">{v.name}</span>
                <span className="text-[10px] text-ink-400 mono">{v.updated}</span>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trend">
        <TabsList>
          <TabsTrigger value="trend">Volume Trend</TabsTrigger>
          <TabsTrigger value="corr">Correlation Finder</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="trend" className="mt-4">
          <ChartCard title="Shipment Volume · 30 days" subtitle="Delivered vs exceptions" height={280}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={shipmentVolume} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="v1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4d95ff" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#4d95ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip content={<GlassTooltip />} />
                <Area type="monotone" dataKey="shipments" stroke="#4d95ff" strokeWidth={2} fill="url(#v1)" />
                <Line type="monotone" dataKey="exceptions" stroke="#fb7185" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </TabsContent>
        <TabsContent value="corr" className="mt-4">
          <Card>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { x: 'Dwell (h)', y: 'Exception %', r: 0.78 },
                  { x: 'Detention (min)', y: 'Margin %', r: -0.64 },
                  { x: 'Carrier OTP', y: 'Claim rate', r: -0.54 },
                ].map((c) => (
                  <div key={c.x} className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-4">
                    <div className="text-xs text-ink-400">{c.x} vs {c.y}</div>
                    <div className="mt-2 text-2xl font-semibold mono text-ink-100">r = {c.r.toFixed(2)}</div>
                    <Badge tone={Math.abs(c.r) > 0.7 ? 'success' : Math.abs(c.r) > 0.5 ? 'brand' : 'warning'} className="mt-3">
                      {Math.abs(c.r) > 0.7 ? 'Strong' : Math.abs(c.r) > 0.5 ? 'Moderate' : 'Weak'} correlation
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="insights" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Detention minutes explain 64% of the variance in lane margin — detention >60 min flips most lanes negative.',
              'SAV → ATL accounts for 38% of margin leakage in the last 30 days. Root cause: chassis pricing + rehandle.',
              'Redline Freight OTP is 4.2 pts below peer group with claim rate 60% higher. Modeling reroute to Summit saves $28k/mo.',
              'Reefer compliance playbook from South BU would reduce claims at East by an estimated $9.8k/mo.',
            ].map((t, i) => (
              <div key={i} className="rounded-xl border border-brand-400/20 bg-gradient-to-br from-brand-500/8 via-violet-500/6 to-transparent p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-3.5 w-3.5 text-brand-700 dark:text-brand-300" />
                  <div className="text-[11px] uppercase tracking-wider text-brand-700 dark:text-brand-200 font-semibold">Insight #{i + 1}</div>
                </div>
                <p className="text-sm text-ink-100 leading-relaxed">{t}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
