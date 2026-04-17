import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Boxes, ClipboardCheck, DoorOpen, Package, Sparkles, TrendingUp, Users, Warehouse } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FilterBar } from '@/components/ui/FilterBar';
import { KpiCard } from '@/components/ui/KpiCard';
import { Card, CardContent, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/Card';
import { ChartCard } from '@/components/charts/ChartCard';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar, StackBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { WAREHOUSES } from '@/data/core';
import { dockActivity, warehouseUtilization } from '@/data/series';
import { GlassTooltip } from '@/components/charts/tooltip';

const DOCK_GRID = Array.from({ length: 48 }).map((_, i) => {
  const r = (i * 9973) % 100;
  return {
    id: `d-${i + 1}`,
    status: r < 6 ? 'alert' : r < 60 ? 'busy' : r < 85 ? 'ready' : 'idle',
  };
});

const dockColors: Record<string, string> = {
  busy: 'bg-brand-500/60 border-brand-400/60',
  ready: 'bg-emerald-500/30 border-emerald-400/40',
  alert: 'bg-rose-500/60 border-rose-400/70',
  idle: 'bg-overlay-1/5 border-hairline/[0.12]',
};

export default function WarehouseIntelligence() {
  return (
    <>
      <SectionHeader
        eyebrow="Operations · Facilities"
        title="Warehouse Intelligence"
        description="Dock, labor, inventory, and inbound/outbound flows — every warehouse, one console. AI detects congestion before it hits SLA."
        actions={
          <>
            <Button variant="subtle" icon={<ClipboardCheck className="h-3.5 w-3.5" />}>Door scheduler</Button>
            <Button variant="primary" icon={<Sparkles className="h-3.5 w-3.5" />}>AI rebalance</Button>
          </>
        }
      />

      <FilterBar
        pills={[
          { label: 'Facility', value: 'SAV-07' },
          { label: 'Shift', value: 'PM · 14:00–22:00' },
          { label: 'Zone', value: 'All zones' },
        ]}
        activeCount={3}
      />

      <AlertBanner
        tone="warning"
        label="Congestion Warning"
        title="SAV-07 · dock utilization 88% with 2 late inbounds arriving within 45 min"
        body="AI recommends shifting outbound 204/207 to doors 31–34 (currently idle) and calling in 2 drivers from OAK-02 standby pool."
        actions={
          <>
            <Button variant="ghost" size="sm">Details</Button>
            <Button variant="primary" size="sm">Apply plan</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Inbound today" value="178" sub="across 6 facilities" deltaPct={3.6} tone="brand" icon={<Package className="h-4 w-4" />} />
        <KpiCard label="Outbound today" value="219" sub="48 priority pick" deltaPct={2.1} tone="success" icon={<Package className="h-4 w-4" />} />
        <KpiCard label="Dock utilization" value="78%" sub="network-average" deltaPct={4.2} tone="warning" icon={<DoorOpen className="h-4 w-4" />} />
        <KpiCard label="Labor utilization" value="82%" sub="shift coverage" deltaPct={-1.1} tone="brand" icon={<Users className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Dock Floor · SAV-07</CardTitle>
              <CardSubtitle>48 doors · live occupancy</CardSubtitle>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-ink-300">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-brand-500/60 border border-brand-400/60" /> Busy</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-emerald-500/30 border border-emerald-400/40" /> Ready</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-rose-500/60 border border-rose-400/70" /> Alert</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-overlay-1/5 border border-hairline/[0.12]" /> Idle</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-12 gap-1.5">
              {DOCK_GRID.map((d, i) => (
                <div
                  key={d.id}
                  className={`group relative aspect-square rounded-md border ${dockColors[d.status]} transition-transform hover:scale-110`}
                  title={`Door ${i + 1} — ${d.status}`}
                >
                  <span className="absolute inset-0 flex items-center justify-center mono text-[9px] text-white/70">
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3 text-[11px]">
              <div className="rounded-lg border border-hairline/[0.08] bg-overlay-1/[0.02] p-2.5">
                <div className="text-ink-400">Avg. dwell</div>
                <div className="mono text-base text-ink-100">21.2h</div>
              </div>
              <div className="rounded-lg border border-hairline/[0.08] bg-overlay-1/[0.02] p-2.5">
                <div className="text-ink-400">Yard check</div>
                <div className="mono text-base text-ink-100">08:14</div>
              </div>
              <div className="rounded-lg border border-hairline/[0.08] bg-overlay-1/[0.02] p-2.5">
                <div className="text-ink-400">Doors live</div>
                <div className="mono text-base text-ink-100">42/48</div>
              </div>
              <div className="rounded-lg border border-hairline/[0.08] bg-overlay-1/[0.02] p-2.5">
                <div className="text-ink-400">Inventory</div>
                <div className="mono text-base text-ink-100">183k units</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Facility Health</CardTitle>
              <CardSubtitle>Storage, dock, labor</CardSubtitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {WAREHOUSES.map((w) => (
              <div key={w.id} className="rounded-lg border border-hairline/[0.08] bg-overlay-1/[0.02] p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm font-medium text-ink-100">{w.code} · {w.name}</div>
                    <div className="text-[11px] text-ink-400">{w.city}</div>
                  </div>
                  <Badge tone={w.alerts > 2 ? 'danger' : w.alerts > 0 ? 'warning' : 'success'}>
                    {w.alerts} alerts
                  </Badge>
                </div>
                <div className="space-y-1.5">
                  <ProgressBar label="Storage" value={w.storageUtilPct} showValue tone={w.storageUtilPct > 90 ? 'danger' : 'brand'} size="sm" />
                  <ProgressBar label="Dock" value={w.dockBusyPct} showValue tone={w.dockBusyPct > 85 ? 'warning' : 'success'} size="sm" />
                  <ProgressBar label="Labor" value={w.laborUtilPct} showValue tone="violet" size="sm" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard
          title="Dock Flow · SAV-07"
          subtitle="Inbound vs outbound · 24-hour window"
          height={260}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dockActivity} margin={{ top: 12, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="hour" interval={3} tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={36} />
              <Tooltip content={<GlassTooltip />} />
              <Bar dataKey="inbound" fill="#4d95ff" radius={[4, 4, 0, 0]} />
              <Bar dataKey="outbound" fill="#34d399" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Network Utilization"
          subtitle="Storage vs dock vs labor by facility"
          height={260}
          className="xl:col-span-2"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={warehouseUtilization} margin={{ top: 12, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="wh" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={36} />
              <Tooltip content={<GlassTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#8891b0' }} />
              <Bar dataKey="storage" name="Storage" fill="#4d95ff" radius={[4, 4, 0, 0]} />
              <Bar dataKey="dock" name="Dock" fill="#a78bfa" radius={[4, 4, 0, 0]} />
              <Bar dataKey="labor" name="Labor" fill="#34d399" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Inventory Aging & Velocity — req §3 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Inventory Aging</CardTitle>
              <CardSubtitle>183,400 units across 6 facilities · age buckets</CardSubtitle>
            </div>
            <Badge tone="warning">3.8% over 30d</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <StackBar
              height={14}
              segments={[
                { value: 92_400, tone: 'success', label: '0–7 days' },
                { value: 54_200, tone: 'brand',   label: '8–30 days' },
                { value: 24_800, tone: 'warning', label: '31–60 days' },
                { value: 12_000, tone: 'danger',  label: '60+ days' },
              ]}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: '0–7 days',   units: 92_400, color: '#34d399', pct: 50.4 },
                { label: '8–30 days',  units: 54_200, color: '#4d95ff', pct: 29.6 },
                { label: '31–60 days', units: 24_800, color: '#fbbf24', pct: 13.5 },
                { label: '60+ days',   units: 12_000, color: '#fb7185', pct: 6.5 },
              ].map((b) => (
                <div key={b.label} className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-2 w-2 rounded-full" style={{ background: b.color }} />
                    <span className="text-[10px] uppercase tracking-wider text-ink-400">{b.label}</span>
                  </div>
                  <div className="mono text-base text-ink-100">{b.units.toLocaleString()}</div>
                  <div className="text-[11px] text-ink-400">{b.pct}% of on-hand</div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-amber-400/25 bg-amber-400/5 p-3 text-xs text-ink-200">
              <span className="text-amber-700 dark:text-amber-300 font-semibold">12,000 units (Crescent Foods · SAV-07)</span> have aged past 60 days — AI recommends consolidating with next outbound wave to recover $4,200 in storage cost.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>SKU Velocity</CardTitle>
              <CardSubtitle>Movers by turn-rate</CardSubtitle>
            </div>
            <TrendingUp className="h-4 w-4 text-ink-400" />
          </CardHeader>
          <CardContent className="space-y-2.5">
            {[
              { tier: 'Fast (A)',   skus: 184, turn: '12.4×/yr', share: 64, tone: 'success' as const },
              { tier: 'Medium (B)', skus: 312, turn: '5.2×/yr',  share: 26, tone: 'brand' as const },
              { tier: 'Slow (C)',   skus: 421, turn: '1.8×/yr',  share: 8,  tone: 'warning' as const },
              { tier: 'Dead stock', skus: 38,  turn: '0×',       share: 2,  tone: 'danger' as const },
            ].map((s) => (
              <div key={s.tier} className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <div className="text-sm font-medium text-ink-100">{s.tier}</div>
                    <div className="text-[10px] text-ink-400">{s.skus} SKUs · {s.turn}</div>
                  </div>
                  <Badge tone={s.tone}>{s.share}%</Badge>
                </div>
                <ProgressBar value={s.share} tone={s.tone} size="sm" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inbound">
        <TabsList>
          <TabsTrigger value="inbound">Inbound Pipeline</TabsTrigger>
          <TabsTrigger value="outbound">Outbound Waves</TabsTrigger>
          <TabsTrigger value="labor">Labor Plan</TabsTrigger>
        </TabsList>
        <TabsContent value="inbound" className="mt-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Next 8 hours</CardTitle>
                <CardSubtitle>Expected arrivals · SAV-07</CardSubtitle>
              </div>
              <Badge tone="brand" dot>Live</Badge>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {[
                { eta: '14:20', ref: 'ASN-88194', customer: 'Halcyon Retail', pieces: 2104, status: 'On time', tone: 'success' },
                { eta: '14:45', ref: 'MAEU9921033', customer: 'Crescent Foods', pieces: 1820, status: 'Reefer alert', tone: 'warning' },
                { eta: '15:10', ref: 'ASN-88201', customer: 'Orion Apparel', pieces: 980, status: 'Delayed 22m', tone: 'warning' },
                { eta: '15:40', ref: 'ASN-88210', customer: 'Polaris Industrial', pieces: 1560, status: 'On time', tone: 'success' },
                { eta: '16:05', ref: 'MSCU7349182', customer: 'Halcyon Retail', pieces: 1840, status: 'Rerouted', tone: 'info' },
                { eta: '17:00', ref: 'ASN-88225', customer: 'Cedar & Bloom', pieces: 620, status: 'On time', tone: 'success' },
              ].map((r) => (
                <div key={r.ref} className="flex items-center gap-3 rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] px-3 py-2.5">
                  <div className="mono text-sm text-ink-100 w-14">{r.eta}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-ink-100 font-medium">{r.ref}</div>
                    <div className="text-[11px] text-ink-400">{r.customer} · {r.pieces.toLocaleString()} units</div>
                  </div>
                  <Badge tone={r.tone as any} dot>{r.status}</Badge>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="outbound" className="mt-4">
          <Card>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { wave: 'Wave 41', cutoff: '16:00', status: 'Picking', pct: 72, orders: 48, tone: 'brand' },
                  { wave: 'Wave 42', cutoff: '18:30', status: 'Queued', pct: 12, orders: 61, tone: 'neutral' },
                  { wave: 'Wave 43', cutoff: '20:00', status: 'Queued', pct: 0, orders: 44, tone: 'neutral' },
                ].map((w) => (
                  <div key={w.wave} className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-ink-100">{w.wave}</div>
                      <Badge tone={w.tone as any}>{w.status}</Badge>
                    </div>
                    <div className="text-xs text-ink-400 mb-3">Cutoff {w.cutoff} · {w.orders} orders</div>
                    <ProgressBar value={w.pct} tone="brand" showValue />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="labor" className="mt-4">
          <Card>
            <CardContent className="p-5 grid grid-cols-1 md:grid-cols-4 gap-3">
              {[
                { role: 'Pickers', scheduled: 42, present: 39, pct: 92, tone: 'success' },
                { role: 'Loaders', scheduled: 18, present: 17, pct: 94, tone: 'success' },
                { role: 'Forklift Ops', scheduled: 14, present: 12, pct: 86, tone: 'warning' },
                { role: 'QC', scheduled: 6, present: 5, pct: 83, tone: 'warning' },
              ].map((r) => (
                <div key={r.role} className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-ink-100">{r.role}</div>
                    <Badge tone={r.tone as any}>{r.pct}%</Badge>
                  </div>
                  <div className="text-xs text-ink-400 mb-3">{r.present}/{r.scheduled} present</div>
                  <ProgressBar value={r.pct} tone={r.tone as any} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
