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
  AlertTriangle,
  Building2,
  Container as ContainerIcon,
  ExternalLink,
  FileText,
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
import { KpiCard } from '@/components/ui/KpiCard';
import { Card, CardContent, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ChartCard } from '@/components/charts/ChartCard';
import { GlassTooltip } from '@/components/charts/tooltip';
import { CONTAINERS } from '@/data/containers';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { fmtUSD } from '@/lib/format';
import { useToast } from '@/components/ui/Toast';
import { Dropdown } from '@/components/ui/Dropdown';
import { useMemo, useState } from 'react';

const onTimeTrend = Array.from({ length: 12 }).map((_, i) => ({
  week: `W${i + 1}`,
  otp: 90 + Math.round(Math.sin(i / 2) * 4 + (i % 3)),
  industry: 88 + Math.round(Math.sin(i / 3) * 2),
}));

// Per-customer view profiles — req §8 white-labeled experience.
interface CustomerProfile {
  name: string;
  initials: string;
  tier: string;
  shipmentsMtd: number;
  spendMtd: number;
  otp: number;
  csat: number;
  exceptions: number;
  nodes: number;
  warehouses: { wh: string; city: string; onHandUnits: number; capacityUnits: number }[];
  outbound: { order: string; units: number; deliverBy: string; status: string; tone: 'success' | 'brand' | 'warning' }[];
}

const CUSTOMER_PROFILES: CustomerProfile[] = [
  {
    name: 'Halcyon Retail Group',
    initials: 'HR',
    tier: 'Enterprise',
    shipmentsMtd: 1_840,
    spendMtd: 1_420_000,
    otp: 94.8,
    csat: 4.7,
    exceptions: 6,
    nodes: 14,
    warehouses: [
      { wh: 'LAX-01', city: 'Long Beach, CA', onHandUnits: 84_200, capacityUnits: 110_000 },
      { wh: 'OAK-02', city: 'Oakland, CA',     onHandUnits: 41_800, capacityUnits:  60_000 },
      { wh: 'SAV-07', city: 'Savannah, GA',    onHandUnits: 96_400, capacityUnits: 105_000 },
    ],
    outbound: [
      { order: 'PO-44218', units: 2_104, deliverBy: 'Apr 17 · 18:00', status: 'Ready', tone: 'success' },
      { order: 'PO-44231', units: 1_840, deliverBy: 'Apr 18 · 12:00', status: 'Picking', tone: 'brand' },
      { order: 'PO-44245', units: 980,   deliverBy: 'Apr 18 · 15:00', status: 'Awaiting inbound', tone: 'warning' },
    ],
  },
  {
    name: 'Crescent Foods',
    initials: 'CF',
    tier: 'Enterprise',
    shipmentsMtd: 2_010,
    spendMtd: 1_820_000,
    otp: 88.4,
    csat: 4.2,
    exceptions: 14,
    nodes: 22,
    warehouses: [
      { wh: 'SAV-07', city: 'Savannah, GA',  onHandUnits: 72_400, capacityUnits:  90_000 },
      { wh: 'HOU-11', city: 'Houston, TX',   onHandUnits: 58_900, capacityUnits:  75_000 },
      { wh: 'CHI-05', city: 'Joliet, IL',    onHandUnits: 41_200, capacityUnits:  60_000 },
    ],
    outbound: [
      { order: 'CF-7821', units: 1_640, deliverBy: 'Apr 17 · 22:00', status: 'Picking',          tone: 'brand' },
      { order: 'CF-7824', units: 980,   deliverBy: 'Apr 18 · 09:00', status: 'Awaiting inbound', tone: 'warning' },
      { order: 'CF-7829', units: 2_240, deliverBy: 'Apr 18 · 18:00', status: 'Ready',            tone: 'success' },
    ],
  },
  {
    name: 'Northwind Consumer',
    initials: 'NC',
    tier: 'Enterprise',
    shipmentsMtd: 1_210,
    spendMtd: 980_000,
    otp: 96.2,
    csat: 4.9,
    exceptions: 2,
    nodes: 9,
    warehouses: [
      { wh: 'OAK-02', city: 'Oakland, CA',  onHandUnits: 28_400, capacityUnits: 45_000 },
      { wh: 'NYC-03', city: 'Elizabeth, NJ', onHandUnits: 36_900, capacityUnits: 55_000 },
    ],
    outbound: [
      { order: 'NW-9912', units: 880,   deliverBy: 'Apr 17 · 16:00', status: 'Ready',   tone: 'success' },
      { order: 'NW-9918', units: 1_120, deliverBy: 'Apr 18 · 11:00', status: 'Picking', tone: 'brand' },
    ],
  },
];

const CUSTOMER_OPTIONS = CUSTOMER_PROFILES.map((c) => ({ value: c.name, label: c.name }));

export default function CustomerPortal() {
  const { show } = useToast();
  const [customerName, setCustomerName] = useState(CUSTOMER_PROFILES[0].name);
  const profile = CUSTOMER_PROFILES.find((c) => c.name === customerName)!;
  const customerContainers = useMemo(
    () => CONTAINERS.filter((c) => c.customer === profile.name).slice(0, 3),
    [profile.name],
  );
  return (
    <>
      <SectionHeader
        eyebrow={`Customer View · ${profile.name}`}
        title="Customer Portal"
        description="A branded, transparent experience for your customers — real-time status, inventory, and a direct line to the team."
        actions={
          <>
            <Button
              variant="subtle"
              icon={<ExternalLink className="h-3.5 w-3.5" />}
              onClick={() => show({ tone: 'info', title: 'Portal preview opened in a new tab' })}
            >
              Open portal
            </Button>
            <Button
              variant="primary"
              icon={<Sparkles className="h-3.5 w-3.5" />}
              onClick={() => show({ tone: 'success', title: 'Dashboard shared with Halcyon team' })}
            >
              Share dashboard
            </Button>
          </>
        }
      />

      {/* Customer profile + contact */}
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
                {profile.initials}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-semibold text-ink-100">{profile.name}</h2>
                  <Badge tone="brand">{profile.tier}</Badge>
                  <Dropdown
                    label="Switch"
                    value={customerName}
                    options={CUSTOMER_OPTIONS}
                    onChange={(v) => setCustomerName(v)}
                  />
                </div>
                <div className="mt-1 text-xs text-ink-400 flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {profile.nodes} nodes</span>
                  <span className="flex items-center gap-1"><Package className="h-3 w-3" /> {profile.shipmentsMtd.toLocaleString()} shipments/mo</span>
                  <span className="flex items-center gap-1"><Star className="h-3 w-3" /> CSAT {profile.csat}</span>
                </div>
              </div>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <Button variant="subtle" icon={<Phone className="h-3.5 w-3.5" />} onClick={() => show({ tone: 'info', title: `Calling ${profile.name} account manager` })}>
                Call AM
              </Button>
              <Button variant="subtle" icon={<MessageSquare className="h-3.5 w-3.5" />} onClick={() => show({ tone: 'success', title: 'Message sent to account team' })}>
                Send message
              </Button>
              <Button variant="primary" icon={<FileText className="h-3.5 w-3.5" />} onClick={() => show({ tone: 'success', title: 'QBR deck downloading', body: `${profile.initials}-QBR-2026-Q2.pdf · 12.4 MB` })}>
                QBR deck
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {profile.name === 'Halcyon Retail Group' && (
        <AlertBanner
          tone="warning"
          label="Projected Delay"
          title="MSCU7349182 · projected 6h delay → outbound PO-44245 at risk"
          body="AI revised ETA to 18:00 today. Recommended: pre-stage 980 units from LAX-01 on-hand inventory to cover PO-44245 by 15:00 cutoff."
          actions={
            <>
              <Button variant="ghost" size="sm" onClick={() => show({ tone: 'info', title: 'Opening MSCU7349182' })}>
                Open container
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => show({ tone: 'success', title: 'Pre-stage approved', body: '980 units released from LAX-01.' })}
              >
                Approve pre-stage
              </Button>
            </>
          }
        />
      )}
      {profile.name === 'Crescent Foods' && (
        <AlertBanner
          tone="danger"
          label="Margin Erosion"
          title="SHP-1021 · SAV → ATL · margin -21.4% (detention + rehandle)"
          body="AI claim packet ready for $900 detention recovery. Lane-level: $46,800/mo recovery available via chassis renegotiation."
          actions={
            <>
              <Button variant="ghost" size="sm" onClick={() => show({ tone: 'info', title: 'Opening SHP-1021 detail' })}>
                View shipment
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => show({ tone: 'success', title: 'Claim packet sent', body: 'Detention claim filed · $900 in recovery queue.' })}
              >
                File claim
              </Button>
            </>
          }
        />
      )}
      {profile.name === 'Northwind Consumer' && (
        <AlertBanner
          tone="success"
          label="On Track"
          title="All shipments on schedule · OTP 96.2%"
          body="No active risks. AI is monitoring forecast volume changes for week 5+."
        />
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="On-time %"
          value={`${profile.otp}%`}
          sub="industry 88%"
          deltaPct={profile.otp - 88}
          tone={profile.otp >= 94 ? 'success' : profile.otp >= 90 ? 'brand' : 'warning'}
          icon={<ShieldCheck className="h-4 w-4" />}
        />
        <KpiCard
          label="Shipments MTD"
          value={profile.shipmentsMtd.toLocaleString()}
          sub={`across ${profile.nodes} nodes`}
          deltaPct={5.6}
          tone="brand"
          icon={<Package className="h-4 w-4" />}
        />
        <KpiCard
          label="Spend MTD"
          value={fmtUSD(profile.spendMtd)}
          sub="invoice accuracy 99.3%"
          deltaPct={3.4}
          tone="violet"
          icon={<Building2 className="h-4 w-4" />}
        />
        <KpiCard
          label="Exceptions"
          value={`${profile.exceptions}`}
          sub="auto-resolved 4"
          deltaPct={-42}
          tone={profile.exceptions > 10 ? 'danger' : 'warning'}
          icon={<Star className="h-4 w-4" />}
        />
      </div>

      {/* Inventory tied to customer — single consolidated card */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Your Inventory · Live</CardTitle>
            <CardSubtitle>Inbound containers, warehouse on-hand, and outbound order readiness</CardSubtitle>
          </div>
          <Badge tone="brand" dot>Live</Badge>
        </CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-0">
          {/* Inbound containers */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-[11px] uppercase tracking-wider text-ink-400 font-semibold">
              <ContainerIcon className="h-3.5 w-3.5" />
              Inbound containers
            </div>
            <div className="space-y-2">
              {customerContainers.length === 0 ? (
                <div className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-3 text-[12px] text-ink-400">
                  No live inbound containers for {profile.name}.
                </div>
              ) : customerContainers.map((c) => (
                <div key={c.id} className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-3">
                  <div className="flex items-center justify-between">
                    <span className="mono text-[12px] text-ink-100 font-semibold">{c.number}</span>
                    <Badge tone={c.priority === 'critical' ? 'danger' : c.priority === 'urgent' ? 'warning' : 'neutral'} dot>
                      {c.status}
                    </Badge>
                  </div>
                  <div className="mt-1 text-[11px] text-ink-400">
                    ETA {c.etaHours === 0 ? 'arrived' : `${c.etaHours}h`} · free-time {c.freeTimeHoursLeft}h
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warehouse on-hand */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-[11px] uppercase tracking-wider text-ink-400 font-semibold">
              <Warehouse className="h-3.5 w-3.5" />
              Warehouse on-hand
            </div>
            <div className="space-y-2">
              {profile.warehouses.map((w) => {
                const utilPct = Math.round((w.onHandUnits / w.capacityUnits) * 100);
                return (
                  <div key={w.wh} className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-ink-100">{w.wh}</span>
                      <span className="mono text-sm text-ink-100">{w.onHandUnits.toLocaleString()}</span>
                    </div>
                    <ProgressBar value={utilPct} tone={utilPct > 90 ? 'danger' : utilPct > 80 ? 'warning' : 'brand'} size="sm" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Outbound orders */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-[11px] uppercase tracking-wider text-ink-400 font-semibold">
              <PackageCheck className="h-3.5 w-3.5" />
              Outbound today
            </div>
            <div className="space-y-2">
              {profile.outbound.map((o) => (
                <div key={o.order} className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-3">
                  <div className="flex items-center justify-between">
                    <span className="mono text-[12px] text-ink-100 font-semibold">{o.order}</span>
                    <Badge tone={o.tone} dot>{o.status}</Badge>
                  </div>
                  <div className="mt-1 text-[11px] text-ink-400">
                    {o.units.toLocaleString()} units · {o.deliverBy}
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 rounded-lg border border-amber-400/25 bg-amber-400/5 p-2 text-[11px]">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-700 dark:text-amber-300 shrink-0" />
                <span className="text-ink-200">PO-44245 awaiting inbound — pre-stage suggested.</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* OTP trend */}
      <ChartCard title="On-time Delivery · 12 weeks" subtitle="Your network vs industry benchmark" height={260}>
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
    </>
  );
}
