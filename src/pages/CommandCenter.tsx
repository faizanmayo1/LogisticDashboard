import { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertTriangle,
  Anchor,
  Cable,
  Clock3,
  MapPin,
  Radar,
  Sparkles,
  Truck,
  Warehouse,
} from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FilterBar } from '@/components/ui/FilterBar';
import { KpiCard } from '@/components/ui/KpiCard';
import { Card, CardContent, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/Card';
import { ChartCard } from '@/components/charts/ChartCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Timeline } from '@/components/ui/Timeline';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { GlassTooltip } from '@/components/charts/tooltip';
import { dockActivity, liveFeed } from '@/data/series';
import { WAREHOUSES } from '@/data/core';
import { EXCEPTIONS } from '@/data/exceptions';
import { Drawer } from '@/components/ui/Drawer';
import { ProgressBar } from '@/components/ui/ProgressBar';

const facilityPins = [
  { id: 'lax', label: 'LAX-01', left: '12%', top: '58%', tone: 'warning', size: 14 },
  { id: 'oak', label: 'OAK-02', left: '10%', top: '44%', tone: 'success', size: 10 },
  { id: 'hou', label: 'HOU-11', left: '44%', top: '72%', tone: 'success', size: 12 },
  { id: 'sav', label: 'SAV-07', left: '74%', top: '62%', tone: 'danger', size: 16 },
  { id: 'nyc', label: 'NYC-03', left: '80%', top: '36%', tone: 'brand', size: 12 },
  { id: 'chi', label: 'CHI-05', left: '56%', top: '34%', tone: 'brand', size: 11 },
];

const toneDot: Record<string, string> = {
  success: 'bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.55)]',
  warning: 'bg-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.55)]',
  danger: 'bg-rose-400 shadow-[0_0_16px_rgba(251,113,133,0.55)]',
  brand: 'bg-brand-400 shadow-[0_0_16px_rgba(77,149,255,0.55)]',
};

export default function CommandCenter() {
  const [drawerItem, setDrawerItem] = useState<typeof EXCEPTIONS[number] | null>(null);
  return (
    <>
      <SectionHeader
        eyebrow="Real-time Operations"
        title="Command Center"
        description="A live operational view across every facility, lane, and container. AI surfaces risk before it becomes cost."
        actions={
          <>
            <Badge tone="success" dot>All systems streaming</Badge>
            <Button variant="subtle" icon={<Radar className="h-3.5 w-3.5" />}>
              Auto-triage
            </Button>
            <Button variant="primary" icon={<Sparkles className="h-3.5 w-3.5" />}>
              Ask Meridian AI
            </Button>
          </>
        }
      />

      <FilterBar
        pills={[
          { label: 'Region', value: 'All Regions' },
          { label: 'Facility', value: '6 facilities' },
          { label: 'Mode', value: 'Drayage + OTR' },
        ]}
        activeCount={3}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Live Shipments"
          value="2,418"
          sub="across 87 active lanes"
          deltaPct={3.2}
          tone="brand"
          icon={<Truck className="h-4 w-4" />}
        />
        <KpiCard
          label="Containers in Network"
          value="1,126"
          sub="48 at free-time risk"
          deltaPct={-4.1}
          tone="warning"
          icon={<Anchor className="h-4 w-4" />}
        />
        <KpiCard
          label="Docks Utilized"
          value="78%"
          sub="across 6 facilities"
          deltaPct={2.0}
          tone="success"
          icon={<Warehouse className="h-4 w-4" />}
        />
        <KpiCard
          label="Critical Incidents"
          value="7"
          sub="3 unowned"
          deltaPct={14}
          tone="danger"
          icon={<AlertTriangle className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 overflow-hidden">
          <CardHeader>
            <div>
              <CardTitle>Network Map</CardTitle>
              <CardSubtitle>Facilities, containers, and in-flight shipments</CardSubtitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="success" dot>Live</Badge>
              <Button variant="subtle" size="sm" icon={<MapPin className="h-3.5 w-3.5" />}>
                Facilities
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="relative h-[360px] overflow-hidden rounded-xl border border-hairline/[0.08] bg-ink-950 grid-backdrop">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(600px 400px at 30% 70%, rgba(42,120,245,0.12), transparent 60%), radial-gradient(500px 340px at 80% 30%, rgba(167,139,250,0.12), transparent 60%)',
                }}
              />
              {/* simulated lanes */}
              <svg className="absolute inset-0 h-full w-full">
                <defs>
                  <linearGradient id="lane1" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4d95ff" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="#4d95ff" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                {[
                  ['12%', '58%', '44%', '72%'],
                  ['10%', '44%', '56%', '34%'],
                  ['44%', '72%', '80%', '36%'],
                  ['56%', '34%', '80%', '36%'],
                  ['74%', '62%', '80%', '36%'],
                  ['12%', '58%', '10%', '44%'],
                ].map((l, i) => (
                  <line
                    key={i}
                    x1={l[0]}
                    y1={l[1]}
                    x2={l[2]}
                    y2={l[3]}
                    stroke="url(#lane1)"
                    strokeWidth={1.2}
                    strokeDasharray="3 4"
                  />
                ))}
              </svg>

              {facilityPins.map((p) => (
                <div key={p.id} className="absolute" style={{ left: p.left, top: p.top, transform: 'translate(-50%,-50%)' }}>
                  <span className={`block rounded-full ${toneDot[p.tone]} animate-pulseDot`} style={{ width: p.size, height: p.size }} />
                  <div className="mt-1 mono text-[10px] uppercase tracking-wider text-ink-300 whitespace-nowrap">
                    {p.label}
                  </div>
                </div>
              ))}
              <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-lg border border-hairline/[0.08] bg-ink-900/80 px-3 py-2 backdrop-blur text-[11px] text-ink-300">
                <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Healthy</span>
                <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Watch</span>
                <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-rose-400" /> Critical</span>
                <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-brand-400" /> Busy</span>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-2 rounded-lg border border-hairline/[0.08] bg-ink-900/80 px-3 py-2 backdrop-blur text-[11px] text-ink-300">
                <Cable className="h-3 w-3 text-ink-400" /> 6 facilities · 87 lanes
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Live Event Feed</CardTitle>
              <CardSubtitle>Across all facilities</CardSubtitle>
            </div>
            <Badge tone="success" dot>Streaming</Badge>
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
                  : 'neutral',
              }))}
            />
          </CardContent>
        </Card>
      </div>

      <AlertBanner
        tone="warning"
        label="Emerging Risk"
        title="SAV-07 dock utilization at 88% — 6 outbound SLAs in next 4 hours"
        body="Two late inbounds created pileup. AI suggests shifting 4 outbound departures to doors 31–34 and rebalancing 2 drivers from OAK-02."
        actions={
          <>
            <Button variant="ghost" size="sm">View plan</Button>
            <Button variant="primary" size="sm">Apply mitigation</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard
          className="xl:col-span-2"
          title="Dock Activity — Network-wide"
          subtitle="Inbound, outbound, and utilization · 24h"
          height={280}
          right={
            <>
              <Badge tone="brand">Inbound</Badge>
              <Badge tone="success">Outbound</Badge>
              <Badge tone="warning">Utilization</Badge>
            </>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dockActivity} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="hour" tickLine={false} axisLine={false} interval={2} />
              <YAxis tickLine={false} axisLine={false} width={36} />
              <Tooltip content={<GlassTooltip />} />
              <Bar dataKey="inbound" name="Inbound" fill="#4d95ff" radius={[4, 4, 0, 0]} />
              <Bar dataKey="outbound" name="Outbound" fill="#34d399" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Facility Pulse</CardTitle>
              <CardSubtitle>Live utilization across the network</CardSubtitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {WAREHOUSES.map((w) => (
              <div key={w.id}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <div>
                    <div className="text-ink-200 font-medium">{w.code} · {w.name}</div>
                    <div className="text-[10px] text-ink-400">{w.city}</div>
                  </div>
                  <div className="text-right mono text-[11px]">
                    <div className="text-ink-100">{w.dockBusyPct}% dock</div>
                    <div className="text-ink-400">{w.storageUtilPct}% storage</div>
                  </div>
                </div>
                <ProgressBar
                  value={w.dockBusyPct}
                  tone={w.dockBusyPct > 85 ? 'danger' : w.dockBusyPct > 75 ? 'warning' : 'brand'}
                  size="sm"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Active Incidents</CardTitle>
            <CardSubtitle>AI-ranked by financial impact · click for root cause</CardSubtitle>
          </div>
          <Badge tone="brand">AI-triaged</Badge>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {EXCEPTIONS.filter((e) => e.status !== 'resolved').slice(0, 6).map((ex) => (
              <button
                key={ex.id}
                onClick={() => setDrawerItem(ex)}
                className="group text-left rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-4 hover:bg-overlay-1/[0.05] transition-colors focus-ring"
              >
                <div className="flex items-center gap-2 justify-between">
                  <Badge
                    tone={
                      ex.severity === 'critical' ? 'danger'
                      : ex.severity === 'high' ? 'warning'
                      : ex.severity === 'medium' ? 'info'
                      : 'neutral'
                    }
                    dot
                  >
                    {ex.severity}
                  </Badge>
                  <span className="mono text-[10px] text-ink-400 flex items-center gap-1"><Clock3 className="h-3 w-3" />{ex.createdAt}</span>
                </div>
                <div className="mt-2 text-sm font-medium text-ink-100 leading-snug">{ex.title}</div>
                <div className="mt-1 text-[11px] text-ink-400">{ex.category} · {ex.resource}</div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-[10px] font-semibold text-white">
                      {ex.ownerInitials}
                    </div>
                    <span className="text-[11px] text-ink-300">{ex.owner}</span>
                  </div>
                  {typeof ex.impactUSD === 'number' && ex.impactUSD > 0 && (
                    <span className="mono text-[11px] text-rose-700 dark:text-rose-300">${(ex.impactUSD / 1000).toFixed(1)}k at risk</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Drawer
        open={!!drawerItem}
        onClose={() => setDrawerItem(null)}
        title={drawerItem?.title}
        subtitle={drawerItem ? `${drawerItem.ref} · ${drawerItem.category}` : ''}
        footer={
          <>
            <Button variant="ghost">Snooze</Button>
            <Button variant="secondary">Assign owner</Button>
            <Button variant="primary" icon={<Sparkles className="h-3.5 w-3.5" />}>Apply AI plan</Button>
          </>
        }
      >
        {drawerItem && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-3">
                <div className="text-[10px] uppercase tracking-wider text-ink-400">Severity</div>
                <div className="mt-1"><Badge tone={drawerItem.severity === 'critical' ? 'danger' : drawerItem.severity === 'high' ? 'warning' : 'info'} dot>{drawerItem.severity}</Badge></div>
              </div>
              <div className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-3">
                <div className="text-[10px] uppercase tracking-wider text-ink-400">Impact</div>
                <div className="mt-1 mono text-lg text-rose-700 dark:text-rose-300">${(drawerItem.impactUSD ?? 0).toLocaleString()}</div>
              </div>
              <div className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-3">
                <div className="text-[10px] uppercase tracking-wider text-ink-400">Owner</div>
                <div className="mt-1 text-sm text-ink-100">{drawerItem.owner}</div>
              </div>
              <div className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-3">
                <div className="text-[10px] uppercase tracking-wider text-ink-400">SLA Remaining</div>
                <div className="mt-1 text-sm text-ink-100">{Math.floor(drawerItem.slaMinutes / 60)}h {drawerItem.slaMinutes % 60}m</div>
              </div>
            </div>
            {drawerItem.rootCause && (
              <div className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-4">
                <div className="text-[11px] uppercase tracking-wider text-ink-400 font-semibold mb-1.5">Root Cause</div>
                <p className="text-sm text-ink-200 leading-relaxed">{drawerItem.rootCause}</p>
              </div>
            )}
            {drawerItem.aiRecommendation && (
              <div className="rounded-xl border border-brand-400/30 bg-gradient-to-br from-brand-500/10 via-violet-500/5 to-transparent p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-brand-700 dark:text-brand-300" />
                  <div className="text-[11px] uppercase tracking-wider text-brand-700 dark:text-brand-200 font-semibold">AI Recommendation</div>
                </div>
                <p className="text-sm text-ink-100 leading-relaxed">{drawerItem.aiRecommendation}</p>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </>
  );
}
