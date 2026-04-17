import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertTriangle,
  Building2,
  Container as ContainerIcon,
  Download,
  ExternalLink,
  FileText,
  MapPin,
  MessageSquare,
  Package,
  PackageCheck,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Warehouse,
} from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FilterBar } from '@/components/ui/FilterBar';
import { KpiCard } from '@/components/ui/KpiCard';
import { Card, CardContent, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ChartCard } from '@/components/charts/ChartCard';
import { DataTable } from '@/components/ui/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Timeline } from '@/components/ui/Timeline';
import { GlassTooltip } from '@/components/charts/tooltip';
import { SHIPMENTS } from '@/data/shipments';
import { CONTAINERS } from '@/data/containers';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { fmtUSD } from '@/lib/format';
import { useToast } from '@/components/ui/Toast';

// Inventory tied to this customer's account — supports requirement §8 demo moment.
const HALCYON_CONTAINERS = CONTAINERS.filter((c) => c.customer === 'Halcyon Retail Group');
const WAREHOUSE_INVENTORY = [
  { wh: 'LAX-01', city: 'Long Beach, CA', onHandUnits: 84_200, capacityUnits: 110_000, inboundUnits: 12_400 },
  { wh: 'OAK-02', city: 'Oakland, CA',     onHandUnits: 41_800, capacityUnits:  60_000, inboundUnits:  6_200 },
  { wh: 'SAV-07', city: 'Savannah, GA',    onHandUnits: 96_400, capacityUnits: 105_000, inboundUnits: 14_800 },
];
const OUTBOUND_READY = [
  { order: 'PO-44218', units: 2_104, deliverBy: 'Apr 17 · 18:00', status: 'Ready', tone: 'success' as const },
  { order: 'PO-44231', units: 1_840, deliverBy: 'Apr 18 · 12:00', status: 'Picking', tone: 'brand' as const },
  { order: 'PO-44245', units: 980,   deliverBy: 'Apr 18 · 15:00', status: 'Awaiting inbound', tone: 'warning' as const },
];

const onTimeTrend = Array.from({ length: 12 }).map((_, i) => ({
  week: `W${i + 1}`,
  otp: 90 + Math.round(Math.sin(i / 2) * 4 + (i % 3)),
  industry: 88 + Math.round(Math.sin(i / 3) * 2),
}));

export default function CustomerPortal() {
  const { show } = useToast();
  return (
    <>
      <SectionHeader
        eyebrow="Customer View · Halcyon Retail Group"
        title="Customer Portal"
        description="A branded, transparent experience for your customers. Real-time status, documents, analytics, and a direct line to the account team."
        actions={
          <>
            <Button variant="subtle" icon={<ExternalLink className="h-3.5 w-3.5" />}>Open portal</Button>
            <Button variant="primary" icon={<Sparkles className="h-3.5 w-3.5" />}>Share dashboard</Button>
          </>
        }
      />

      <Card className="overflow-hidden">
        <div className="relative px-6 py-6">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(500px 220px at 20% 10%, rgba(77,149,255,0.18), transparent 60%), radial-gradient(400px 180px at 90% 90%, rgba(167,139,250,0.16), transparent 60%)',
            }}
          />
          <div className="relative flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-500 text-white text-lg font-semibold">
                HR
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-ink-100">Halcyon Retail Group</h2>
                  <Badge tone="brand">Enterprise</Badge>
                  <Badge tone="success" dot>Active</Badge>
                </div>
                <div className="mt-1 text-xs text-ink-400 flex items-center gap-3">
                  <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> 14 nodes</span>
                  <span className="flex items-center gap-1"><Package className="h-3 w-3" /> 1,840 shipments/mo</span>
                  <span className="flex items-center gap-1"><Star className="h-3 w-3" /> CSAT 4.7</span>
                </div>
              </div>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <Button variant="subtle" icon={<Phone className="h-3.5 w-3.5" />} onClick={() => show({ tone: 'info', title: 'Calling Lena Park · Account Manager' })}>
                Call L. Park
              </Button>
              <Button variant="subtle" icon={<MessageSquare className="h-3.5 w-3.5" />} onClick={() => show({ tone: 'success', title: 'Message thread opened with account team' })}>
                Send message
              </Button>
              <Button variant="primary" icon={<FileText className="h-3.5 w-3.5" />} onClick={() => show({ tone: 'success', title: 'QBR deck downloading', body: 'Halcyon-QBR-2026-Q2.pdf · 12.4 MB' })}>
                QBR deck
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <FilterBar
        pills={[
          { label: 'Network', value: 'All lanes' },
          { label: 'Mode', value: 'All' },
          { label: 'Period', value: 'Last 30d' },
        ]}
        activeCount={3}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="On-time %" value="94.8%" sub="industry 88%" deltaPct={1.2} tone="success" icon={<ShieldCheck className="h-4 w-4" />} />
        <KpiCard label="Shipments MTD" value="1,840" sub="across 14 lanes" deltaPct={5.6} tone="brand" icon={<Package className="h-4 w-4" />} />
        <KpiCard label="Spend MTD" value={fmtUSD(1_420_000)} sub="invoice accuracy 99.3%" deltaPct={3.4} tone="violet" icon={<Building2 className="h-4 w-4" />} />
        <KpiCard label="Exceptions" value="6" sub="auto-resolved 4" deltaPct={-42} tone="warning" icon={<Star className="h-4 w-4" />} />
      </div>

      <AlertBanner
        tone="warning"
        label="Projected Delay"
        title="MSCU7349182 · projected 6-hour delay → outbound PO-44245 at risk"
        body="AI revised ETA to 18:00 today. Recommended next step: pre-stage 980 units from LAX-01 on-hand inventory to cover PO-44245 by 15:00 cutoff."
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={() => show({ tone: 'info', title: 'Opening MSCU7349182' })}>
              Open container
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => show({ tone: 'success', title: 'Pre-stage approved', body: '980 units released from LAX-01 · PO-44245 covered by 15:00 cutoff.' })}
            >
              Approve pre-stage
            </Button>
          </>
        }
      />

      {/* Inventory tied to this customer — req §8 demo moment */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Inbound Containers · Tied to Your Inventory</CardTitle>
              <CardSubtitle>Live arrivals feeding your warehouses</CardSubtitle>
            </div>
            <Badge tone="brand" dot>{HALCYON_CONTAINERS.length} live</Badge>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-0">
            {HALCYON_CONTAINERS.map((c) => (
              <div key={c.id} className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ContainerIcon className="h-3.5 w-3.5 text-ink-400" />
                    <span className="mono text-[12px] text-ink-100 font-semibold">{c.number}</span>
                  </div>
                  <Badge tone={c.priority === 'critical' ? 'danger' : c.priority === 'urgent' ? 'warning' : 'neutral'} dot>
                    {c.status}
                  </Badge>
                </div>
                <div className="mt-1.5 text-[11px] text-ink-400">
                  {c.origin} → {c.destination} · ETA {c.etaHours === 0 ? 'arrived' : `${c.etaHours}h`}
                </div>
                <div className="mt-2">
                  <ProgressBar
                    label={`Free-time · ${c.freeTimeHoursLeft}h left`}
                    value={c.freeTimeHoursLeft}
                    max={48}
                    tone={c.freeTimeHoursLeft < 8 ? 'danger' : c.freeTimeHoursLeft < 24 ? 'warning' : 'success'}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Warehouse On-Hand</CardTitle>
              <CardSubtitle>Inventory available for outbound</CardSubtitle>
            </div>
            <Warehouse className="h-4 w-4 text-ink-400" />
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {WAREHOUSE_INVENTORY.map((w) => {
              const utilPct = Math.round((w.onHandUnits / w.capacityUnits) * 100);
              return (
                <div key={w.wh} className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <div className="text-sm font-medium text-ink-100">{w.wh}</div>
                      <div className="text-[10px] text-ink-400">{w.city}</div>
                    </div>
                    <div className="text-right">
                      <div className="mono text-sm text-ink-100">{w.onHandUnits.toLocaleString()}</div>
                      <div className="text-[10px] text-ink-400">units on-hand</div>
                    </div>
                  </div>
                  <ProgressBar value={utilPct} tone={utilPct > 90 ? 'danger' : utilPct > 80 ? 'warning' : 'brand'} size="sm" />
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-ink-400">
                    <span>{utilPct}% capacity</span>
                    <span className="mono">+{w.inboundUnits.toLocaleString()} inbound</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Outbound Order Availability</CardTitle>
              <CardSubtitle>Today's release readiness</CardSubtitle>
            </div>
            <PackageCheck className="h-4 w-4 text-ink-400" />
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {OUTBOUND_READY.map((o) => (
              <div key={o.order} className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="mono text-[12px] text-ink-100 font-semibold">{o.order}</span>
                    <Badge tone={o.tone} dot>{o.status}</Badge>
                  </div>
                  <div className="mt-1 text-[11px] text-ink-400">
                    {o.units.toLocaleString()} units · deliver by {o.deliverBy}
                  </div>
                </div>
                <Button variant="ghost" size="sm">Track</Button>
              </div>
            ))}
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-amber-400/25 bg-amber-400/5 p-2.5 text-[11px]">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-700 dark:text-amber-300 shrink-0" />
              <span className="text-ink-200">
                PO-44245 awaiting MSCU7349182 inbound. AI suggests pre-staging 980 units from LAX-01.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard className="xl:col-span-2" title="On-time Delivery · 12 weeks" subtitle="Your network vs industry benchmark" height={280}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={onTimeTrend} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="otp-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="week" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} domain={[80, 100]} />
              <Tooltip content={<GlassTooltip />} />
              <Area type="monotone" dataKey="otp" name="Halcyon" stroke="#34d399" strokeWidth={2} fill="url(#otp-area)" />
              <Line type="monotone" dataKey="industry" name="Industry" stroke="#8891b0" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Your Account Team</CardTitle>
              <CardSubtitle>Direct escalation paths</CardSubtitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'Lena Park', role: 'Account Manager', initials: 'LP' },
              { name: 'Marco Velasquez', role: 'Dray Operations Lead', initials: 'MV' },
              { name: 'Dana Whitfield', role: 'Warehouse Liaison', initials: 'DW' },
              { name: 'R. Singh', role: 'Finance Partner', initials: 'RS' },
            ].map((p) => (
              <div key={p.name} className="flex items-center gap-3 rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] px-3 py-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-xs font-semibold text-white">
                  {p.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm text-ink-100">{p.name}</div>
                  <div className="text-[11px] text-ink-400">{p.role}</div>
                </div>
                <Button variant="subtle" size="sm" icon={<MessageSquare className="h-3.5 w-3.5" />} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="shipments">
        <TabsList>
          <TabsTrigger value="shipments">Active Shipments</TabsTrigger>
          <TabsTrigger value="docs">Documents</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="shipments" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <DataTable
                rows={SHIPMENTS.filter((s) => s.customer === 'Halcyon Retail Group' || Math.random() > 0.3)}
                getKey={(r) => r.id}
                columns={[
                  {
                    key: 'ref',
                    header: 'Shipment',
                    render: (r) => <span className="mono text-sm text-ink-100">{r.ref}</span>,
                  },
                  {
                    key: 'lane',
                    header: 'Lane',
                    render: (r) => <span className="text-ink-200">{r.lane}</span>,
                  },
                  {
                    key: 'pickup',
                    header: 'Pickup',
                    render: (r) => <span className="text-ink-300 text-sm">{r.pickup}</span>,
                  },
                  {
                    key: 'deliver',
                    header: 'Deliver By',
                    render: (r) => <span className="text-ink-300 text-sm">{r.deliverBy}</span>,
                  },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (r) => <Badge tone={r.status === 'Exception' ? 'danger' : r.status === 'Delivered' ? 'success' : r.status === 'In Transit' ? 'info' : 'neutral'} dot>{r.status}</Badge>,
                  },
                  {
                    key: 'eta',
                    header: 'SLA',
                    render: (r) => <Badge tone={r.sla === 'on-track' ? 'success' : r.sla === 'at-risk' ? 'warning' : 'danger'}>{r.sla}</Badge>,
                  },
                  {
                    key: 'rev',
                    header: 'Value',
                    align: 'right',
                    render: (r) => <span className="mono text-ink-200">{fmtUSD(r.revenueUSD)}</span>,
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="docs" className="mt-4">
          <Card>
            <CardContent className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: 'April Invoice Pack', type: 'PDF · 3.1 MB', date: 'Apr 15' },
                { name: 'QBR Q1 2026', type: 'PDF · 12.4 MB', date: 'Mar 22' },
                { name: 'MSA · Executed', type: 'PDF · 880 KB', date: 'Jan 12' },
                { name: 'EDI 210 Batch', type: 'ZIP · 280 KB', date: 'Apr 14' },
                { name: 'Damage Claim DC-4401', type: 'PDF · 1.8 MB', date: 'Mar 28' },
                { name: 'Carrier Scorecard · Mar', type: 'PDF · 620 KB', date: 'Apr 2' },
              ].map((d) => (
                <div key={d.name} className="flex items-center gap-3 rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-3 hover:bg-overlay-1/[0.05] transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 border border-brand-400/30 text-brand-700 dark:text-brand-200">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm text-ink-100 font-medium">{d.name}</div>
                    <div className="text-[11px] text-ink-400">{d.type} · {d.date}</div>
                  </div>
                  <Button variant="ghost" size="sm" icon={<Download className="h-3.5 w-3.5" />} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardContent className="p-5">
              <Timeline
                items={[
                  { id: '1', time: '14:32', title: 'MSCU7349182 ETA confirmed — 18:00 window', description: 'Pickup from Port of Long Beach', tone: 'brand' },
                  { id: '2', time: '12:14', title: 'SHP-1019 in transit · on-time', tone: 'success' },
                  { id: '3', time: '10:48', title: 'Invoice #88420 delivered · $142,200', tone: 'neutral' },
                  { id: '4', time: 'Yesterday', title: 'ASN mismatch on 2,104 cartons → resolved', tone: 'warning' },
                  { id: '5', time: 'Yesterday', title: 'Detention claim auto-generated · $480', tone: 'violet' },
                  { id: '6', time: '2d ago', title: 'QBR deck shared with account team', tone: 'neutral' },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
