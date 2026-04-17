import { useState } from 'react';
import {
  Anchor,
  Calendar,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Container as ContainerIcon,
  Download,
  MapPin,
  Package,
  Recycle,
  RotateCw,
  Sparkles,
  Thermometer,
  Timer,
  Truck,
  Wrench,
} from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FilterBar } from '@/components/ui/FilterBar';
import { KpiCard } from '@/components/ui/KpiCard';
import { Card, CardContent, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Drawer } from '@/components/ui/Drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Timeline } from '@/components/ui/Timeline';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { ProgressBar, StackBar } from '@/components/ui/ProgressBar';
import { CONTAINERS, Container as ContainerRow } from '@/data/containers';
import { fmtUSD } from '@/lib/format';
import { useToast } from '@/components/ui/Toast';
import { useMemo } from 'react';

const statusTone: Record<string, any> = {
  'At Port': 'warning',
  'In Terminal': 'info',
  'Rail Ramp': 'violet',
  'In Transit': 'brand',
  'At Warehouse': 'success',
  'Empty Return': 'neutral',
};

const priorityTone: Record<string, any> = {
  standard: 'neutral',
  urgent: 'warning',
  critical: 'danger',
};

const PRIORITY_OPTIONS = [
  { value: 'any', label: 'Any priority' },
  { value: 'critical', label: 'Critical' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'standard', label: 'Standard' },
];
const STATUS_OPTIONS = [
  { value: 'any', label: 'Any status' },
  { value: 'At Port', label: 'At Port' },
  { value: 'In Terminal', label: 'In Terminal' },
  { value: 'Rail Ramp', label: 'Rail Ramp' },
  { value: 'In Transit', label: 'In Transit' },
  { value: 'At Warehouse', label: 'At Warehouse' },
  { value: 'Empty Return', label: 'Empty Return' },
];

export default function ContainerVisibility() {
  const { show } = useToast();
  const [selected, setSelected] = useState<ContainerRow | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('any');
  const [priorityFilter, setPriorityFilter] = useState('any');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return CONTAINERS.filter((c) => {
      if (statusFilter !== 'any' && c.status !== statusFilter) return false;
      if (priorityFilter !== 'any' && c.priority !== priorityFilter) return false;
      if (!term) return true;
      return (
        c.number.toLowerCase().includes(term) ||
        c.customer.toLowerCase().includes(term) ||
        c.steamship.toLowerCase().includes(term) ||
        c.origin.toLowerCase().includes(term) ||
        c.destination.toLowerCase().includes(term)
      );
    });
  }, [search, statusFilter, priorityFilter]);

  const atRisk = CONTAINERS.filter((c) => c.freeTimeHoursLeft > 0 && c.freeTimeHoursLeft < 12);
  const totalAtRiskUSD = CONTAINERS.reduce((s, c) => s + c.perDiemRiskUSD + c.demurrageRiskUSD, 0);

  return (
    <>
      <SectionHeader
        eyebrow="Operations · Drayage"
        title="Container & Drayage Visibility"
        description="Track every container from vessel to dock. Free-time, demurrage, per-diem, chassis, and appointments — in one live view."
        actions={
          <>
            <Button
              variant="subtle"
              icon={<Download className="h-3.5 w-3.5" />}
              onClick={() => show({ tone: 'success', title: 'Export queued', body: `${filtered.length} containers · CSV ready in seconds` })}
            >
              Export
            </Button>
            <Button
              variant="primary"
              icon={<Sparkles className="h-3.5 w-3.5" />}
              onClick={() => show({ tone: 'ai', title: 'AI Pull Plan generated', body: '5 containers re-sequenced · projected $11,800 demurrage saved · plan applied to dispatch.' })}
            >
              AI Pull Plan
            </Button>
          </>
        }
      />

      <AlertBanner
        tone="danger"
        label="Free-time Cluster"
        title="5 containers at LAX · combined risk of $14,200 in per-diem + demurrage"
        body="AI recommends combining peel-off pulls with 3 street-turn matches. Projected recovery: $11,800 within 18 hours."
        actions={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStatusFilter('At Port')}
            >
              View containers
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => show({ tone: 'ai', title: 'Auto-plan applied', body: '5 pulls scheduled · 3 street-turns matched · $11,800 protected' })}
            >
              Auto-plan
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Containers in network"
          value="1,126"
          sub="across 14 ports"
          deltaPct={2.1}
          tone="brand"
          icon={<ContainerIcon className="h-4 w-4" />}
        />
        <KpiCard
          label="Free-time at risk"
          value="48"
          sub="under 24h remaining"
          deltaPct={-8.4}
          tone="warning"
          icon={<Timer className="h-4 w-4" />}
        />
        <KpiCard
          label="Per-diem / Demurrage"
          value={fmtUSD(totalAtRiskUSD)}
          sub="exposed in next 48h"
          deltaPct={-12.1}
          tone="danger"
          icon={<CircleDollarSign className="h-4 w-4" />}
        />
        <KpiCard
          label="Terminal appointments"
          value="92%"
          sub="booked on-first-try"
          deltaPct={4.8}
          tone="success"
          icon={<ClipboardCheck className="h-4 w-4" />}
        />
      </div>

      {/* Chassis & utilization strip — req §2 + §6 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-ink-400">
              Chassis &amp; Utilization
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 border border-brand-400/30 text-brand-700 dark:text-brand-300">
                <Wrench className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-ink-400">Chassis pool util.</div>
                <div className="mono text-sm text-ink-100">78% <span className="text-emerald-700 dark:text-emerald-300 text-[11px]">+3.2%</span></div>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-400/30 text-violet-700 dark:text-violet-300">
                <RotateCw className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-ink-400">Container turn-time</div>
                <div className="mono text-sm text-ink-100">3.4 days <span className="text-emerald-700 dark:text-emerald-300 text-[11px]">-0.6d</span></div>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 border border-emerald-400/30 text-emerald-700 dark:text-emerald-300">
                <Recycle className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-ink-400">Street-turn matches today</div>
                <div className="mono text-sm text-ink-100">14 <span className="text-emerald-700 dark:text-emerald-300 text-[11px]">avoided 14 empties</span></div>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-700 dark:text-amber-300">
                <Clock3 className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-ink-400">Drayage ETA accuracy</div>
                <div className="mono text-sm text-ink-100">92% <span className="text-emerald-700 dark:text-emerald-300 text-[11px]">+1.8%</span></div>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-400/10 border border-rose-400/30 text-rose-700 dark:text-rose-300">
                <CircleDollarSign className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-ink-400">Demurrage avoided · MTD</div>
                <div className="mono text-sm text-ink-100">{fmtUSD(82_400)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <FilterBar
        searchPlaceholder="Filter by container, customer, port, lane..."
        searchValue={search}
        onSearch={setSearch}
        onMoreFilters={() => show({ tone: 'info', title: 'Advanced filters', body: 'Add chassis pool, dwell window, terminal, or vessel.' })}
        pills={[
          {
            key: 'status',
            label: 'Status',
            value: statusFilter === 'any' ? 'Any status' : statusFilter,
            options: STATUS_OPTIONS,
            onChange: setStatusFilter,
          },
          {
            key: 'priority',
            label: 'Priority',
            value: priorityFilter === 'any' ? 'Any' : priorityFilter,
            options: PRIORITY_OPTIONS,
            onChange: setPriorityFilter,
          },
          { label: 'Steamship', value: '6 lines' },
          { label: 'Port', value: 'All ports' },
        ]}
        activeCount={
          (statusFilter !== 'any' ? 1 : 0) + (priorityFilter !== 'any' ? 1 : 0)
        }
        right={
          <div className="hidden md:flex items-center gap-2">
            <Badge tone="warning" dot>
              {atRisk.length} at-risk
            </Badge>
            <Badge tone="neutral">{filtered.length} of {CONTAINERS.length}</Badge>
          </div>
        }
      />

      <Card>
        <CardContent className="p-0">
          <DataTable
            rows={filtered}
            getKey={(r) => r.id}
            onRowClick={(r) => setSelected(r)}
            empty={
              <div>
                <div className="text-ink-200">No containers match the filters</div>
                <button
                  onClick={() => { setSearch(''); setStatusFilter('any'); setPriorityFilter('any'); }}
                  className="mt-2 text-xs text-brand-700 dark:text-brand-300 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            }
            columns={[
              {
                key: 'number',
                header: 'Container',
                render: (r) => (
                  <div>
                    <div className="mono text-[13px] font-semibold text-ink-100">{r.number}</div>
                    <div className="text-[11px] text-ink-400">
                      {r.steamship} · {r.size}
                    </div>
                  </div>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => (
                  <Badge tone={statusTone[r.status]} dot>{r.status}</Badge>
                ),
              },
              {
                key: 'route',
                header: 'Origin → Destination',
                render: (r) => (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-ink-300">{r.origin}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-ink-500" />
                    <span className="text-ink-100">{r.destination}</span>
                  </div>
                ),
              },
              {
                key: 'customer',
                header: 'Customer',
                render: (r) => <span className="text-ink-200">{r.customer}</span>,
              },
              {
                key: 'eta',
                header: 'ETA',
                render: (r) => (
                  <div className="mono text-sm text-ink-200">
                    {r.etaHours === 0 ? 'Arrived' : `${r.etaHours}h`}
                  </div>
                ),
              },
              {
                key: 'freetime',
                header: 'Free-time',
                render: (r) => {
                  const tone = r.freeTimeHoursLeft < 8 ? 'danger' : r.freeTimeHoursLeft < 24 ? 'warning' : 'success';
                  return (
                    <div className="w-32">
                      <div className="mb-1 flex items-center justify-between text-[11px]">
                        <span className="text-ink-300">{r.freeTimeHoursLeft}h left</span>
                      </div>
                      <ProgressBar value={r.freeTimeHoursLeft} max={48} tone={tone} size="sm" />
                    </div>
                  );
                },
              },
              {
                key: 'risk',
                header: 'Risk',
                align: 'right',
                render: (r) => {
                  const total = r.perDiemRiskUSD + r.demurrageRiskUSD;
                  return total === 0 ? (
                    <span className="text-ink-400">—</span>
                  ) : (
                    <span className="mono text-rose-700 dark:text-rose-300 font-semibold">{fmtUSD(total)}</span>
                  );
                },
              },
              {
                key: 'priority',
                header: 'Priority',
                render: (r) => <Badge tone={priorityTone[r.priority]}>{r.priority}</Badge>,
              },
              {
                key: 'open',
                header: '',
                align: 'right',
                render: () => <ChevronRight className="inline h-4 w-4 text-ink-500" />,
              },
            ] as Column<ContainerRow>[]}
          />
        </CardContent>
      </Card>

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        width="w-[640px]"
        title={selected?.number}
        subtitle={selected ? `${selected.steamship} · ${selected.size} · ${selected.customer}` : ''}
        footer={
          <>
            <Button variant="ghost" onClick={() => show({ tone: 'success', title: 'Note added to container' })}>
              Add note
            </Button>
            <Button variant="secondary" onClick={() => show({ tone: 'info', title: 'Driver reassignment opened', body: 'Velasquez (7.5h avail) suggested for next pull window.' })}>
              Reassign driver
            </Button>
            <Button
              variant="primary"
              icon={<Sparkles className="h-3.5 w-3.5" />}
              onClick={() => {
                setSelected(null);
                show({ tone: 'ai', title: 'AI plan applied', body: `${selected?.number} re-sequenced for 18:00 window · margin protected.` });
              }}
            >
              Apply AI plan
            </Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-3">
                <div className="text-[10px] uppercase tracking-wider text-ink-400">Status</div>
                <div className="mt-1"><Badge tone={statusTone[selected.status]} dot>{selected.status}</Badge></div>
              </div>
              <div className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-3">
                <div className="text-[10px] uppercase tracking-wider text-ink-400">ETA</div>
                <div className="mt-1 text-sm text-ink-100">{selected.etaHours === 0 ? 'Arrived' : `${selected.etaHours}h`}</div>
              </div>
              <div className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-3">
                <div className="text-[10px] uppercase tracking-wider text-ink-400">Free-time</div>
                <div className="mt-1 text-sm text-ink-100">{selected.freeTimeHoursLeft}h remaining</div>
              </div>
              <div className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-3">
                <div className="text-[10px] uppercase tracking-wider text-ink-400">Exposure</div>
                <div className="mt-1 mono text-sm text-rose-700 dark:text-rose-300">
                  {fmtUSD(selected.perDiemRiskUSD + selected.demurrageRiskUSD)}
                </div>
              </div>
            </div>

            <Tabs defaultValue="timeline">
              <TabsList>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="docs">Docs & Refs</TabsTrigger>
              </TabsList>
              <TabsContent value="timeline" className="mt-4">
                <Timeline
                  items={[
                    {
                      id: '1',
                      time: 'Apr 14 · 22:10',
                      title: 'Vessel berthed',
                      description: 'MSC Bettina — Berth 214. ETA confirmed.',
                      tone: 'neutral',
                    },
                    {
                      id: '2',
                      time: 'Apr 15 · 08:42',
                      title: 'Discharged from vessel',
                      description: 'Stack position: 04-B-12',
                      tone: 'brand',
                    },
                    {
                      id: '3',
                      time: 'Apr 15 · 11:30',
                      title: 'Terminal appointment denied',
                      description: 'Dual-transaction capacity exhausted. Auto-retry scheduled.',
                      tone: 'warning',
                    },
                    {
                      id: '4',
                      time: 'Apr 15 · 13:04',
                      title: 'AI pull plan applied',
                      description: 'Paired with MSCU7349182 → Velasquez. 18:00 window.',
                      tone: 'violet',
                    },
                    {
                      id: '5',
                      time: 'Now',
                      title: 'Awaiting appointment slot',
                      description: 'Free-time expires in 14h. Per-diem starts at 00:00.',
                      tone: 'danger',
                    },
                  ]}
                />
              </TabsContent>
              <TabsContent value="financials" className="mt-4">
                <div className="space-y-4">
                  <div className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-4">
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="text-ink-300">Shipment economics</span>
                      <span className="mono text-ink-100">Revenue {fmtUSD(6800)}</span>
                    </div>
                    <StackBar
                      segments={[
                        { value: 3600, tone: 'brand', label: 'Linehaul' },
                        { value: 820, tone: 'violet', label: 'Chassis' },
                        { value: 480, tone: 'warning', label: 'Accessorials' },
                        { value: 280, tone: 'danger', label: 'Per-diem risk' },
                      ]}
                    />
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brand-400" /> Linehaul <span className="ml-auto mono text-ink-300">{fmtUSD(3600)}</span></div>
                      <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-violet-400" /> Chassis <span className="ml-auto mono text-ink-300">{fmtUSD(820)}</span></div>
                      <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-400" /> Accessorials <span className="ml-auto mono text-ink-300">{fmtUSD(480)}</span></div>
                      <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-rose-400" /> Per-diem risk <span className="ml-auto mono text-rose-700 dark:text-rose-300">{fmtUSD(selected.perDiemRiskUSD + selected.demurrageRiskUSD)}</span></div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-brand-400/30 bg-gradient-to-br from-brand-500/10 via-violet-500/5 to-transparent p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-brand-700 dark:text-brand-300" />
                      <div className="text-[11px] uppercase tracking-wider text-brand-700 dark:text-brand-200 font-semibold">Margin Protection</div>
                    </div>
                    <p className="text-sm text-ink-100 leading-relaxed">
                      If pulled within the 18:00 window, margin stays at 23.4%. Slip of 12h converts this load to negative margin.
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="docs" className="mt-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: 'Bill of Lading', val: 'BOL-' + selected.number.slice(-6) },
                    { label: 'HBL', val: 'HBL-8412-' + selected.number.slice(-4) },
                    { label: 'Booking', val: 'BK-00' + selected.number.slice(-5) },
                    { label: 'ISF', val: 'Filed · Cleared' },
                    { label: 'Entry', val: 'ABI Paperless' },
                    { label: 'PO', val: 'PO-' + selected.number.slice(-4) },
                  ].map((d) => (
                    <div key={d.label} className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-3">
                      <div className="text-[10px] uppercase tracking-wider text-ink-400">{d.label}</div>
                      <div className="mt-1 mono text-ink-100">{d.val}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </Drawer>
    </>
  );
}
