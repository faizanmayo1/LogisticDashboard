import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ChevronRight,
  Clock3,
  Filter,
  Layers,
  PlayCircle,
  Sparkles,
  TrendingUp,
  Workflow,
} from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FilterBar } from '@/components/ui/FilterBar';
import { KpiCard } from '@/components/ui/KpiCard';
import { Card, CardContent, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Drawer } from '@/components/ui/Drawer';
import { Timeline } from '@/components/ui/Timeline';
import { EXCEPTIONS, ExceptionItem, ExceptionSeverity } from '@/data/exceptions';
import { fmtUSD } from '@/lib/format';
import { useToast } from '@/components/ui/Toast';

const severityTone: Record<ExceptionSeverity, any> = {
  critical: 'danger',
  high: 'warning',
  medium: 'info',
  low: 'neutral',
};

const statusTone: Record<ExceptionItem['status'], any> = {
  open: 'danger',
  'in-progress': 'warning',
  mitigated: 'info',
  resolved: 'success',
};

const columnLabels: { key: ExceptionItem['status']; label: string }[] = [
  { key: 'open', label: 'Open' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'mitigated', label: 'Mitigated' },
  { key: 'resolved', label: 'Resolved' },
];

const SEVERITY_OPTIONS = [
  { value: 'any', label: 'Any severity' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];
const CATEGORY_OPTIONS = [
  { value: 'any', label: 'All categories' },
  { value: 'Free-time Risk', label: 'Free-time Risk' },
  { value: 'Dock Congestion', label: 'Dock Congestion' },
  { value: 'SLA Risk', label: 'SLA Risk' },
  { value: 'Margin Erosion', label: 'Margin Erosion' },
  { value: 'Carrier Outage', label: 'Carrier Outage' },
  { value: 'Customs Hold', label: 'Customs Hold' },
  { value: 'Damage', label: 'Damage' },
];
const OWNER_OPTIONS = [
  { value: 'any', label: 'All owners' },
  ...Array.from(new Set(EXCEPTIONS.map((e) => e.owner))).map((o) => ({ value: o, label: o })),
];

export default function ExceptionManagement() {
  const { show } = useToast();
  const [selected, setSelected] = useState<ExceptionItem | null>(null);
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [severity, setSeverity] = useState('any');
  const [category, setCategory] = useState('any');
  const [owner, setOwner] = useState('any');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return EXCEPTIONS.filter((e) => {
      if (severity !== 'any' && e.severity !== severity) return false;
      if (category !== 'any' && e.category !== category) return false;
      if (owner !== 'any' && e.owner !== owner) return false;
      if (!term) return true;
      return (
        e.ref.toLowerCase().includes(term) ||
        e.title.toLowerCase().includes(term) ||
        e.resource.toLowerCase().includes(term) ||
        (e.customer ?? '').toLowerCase().includes(term)
      );
    });
  }, [severity, category, owner, search]);

  const totalImpact = useMemo(
    () => EXCEPTIONS.reduce((s, e) => s + (e.impactUSD ?? 0), 0),
    [],
  );

  return (
    <>
      <SectionHeader
        eyebrow="Operations · Exceptions"
        title="Exception Management"
        description="Every operational risk, ranked and routed. AI triages by financial impact and proposes a fix for every one of them."
        actions={
          <>
            <Button
              variant="subtle"
              icon={<Workflow className="h-3.5 w-3.5" />}
              onClick={() => show({ tone: 'info', title: 'Automation playbook opened', body: '8 active workflows handling exceptions like these.' })}
            >
              Automate
            </Button>
            <Button
              variant="primary"
              icon={<Sparkles className="h-3.5 w-3.5" />}
              onClick={() => show({ tone: 'ai', title: 'AI triage complete', body: '12 exceptions re-ranked by impact · 4 auto-mitigated · 3 escalated to owners.' })}
            >
              Run AI triage
            </Button>
          </>
        }
      />

      <FilterBar
        searchValue={search}
        onSearch={setSearch}
        searchPlaceholder="Filter by ref, title, resource, customer..."
        pills={[
          {
            key: 'sev', label: 'Severity',
            value: severity === 'any' ? 'Any' : severity,
            options: SEVERITY_OPTIONS,
            onChange: setSeverity,
          },
          {
            key: 'cat', label: 'Category',
            value: category === 'any' ? 'Any' : category,
            options: CATEGORY_OPTIONS,
            onChange: setCategory,
          },
          {
            key: 'own', label: 'Owner',
            value: owner === 'any' ? 'All' : owner.split(' ')[0],
            options: OWNER_OPTIONS,
            onChange: setOwner,
          },
        ]}
        activeCount={
          (severity !== 'any' ? 1 : 0) + (category !== 'any' ? 1 : 0) + (owner !== 'any' ? 1 : 0)
        }
        onMoreFilters={() => show({ tone: 'info', title: 'Advanced filters', body: 'Date range, customer tier, SLA window, impact range.' })}
        right={
          <>
            <div className="inline-flex items-center gap-1 rounded-lg border border-hairline/[0.08] bg-ink-900 p-1">
              <button
                onClick={() => setView('kanban')}
                className={`rounded-md px-2.5 h-7 text-xs font-medium transition-colors ${
                  view === 'kanban' ? 'bg-overlay-1/10 text-ink-100' : 'text-ink-400 hover:text-ink-200'
                }`}
              >
                Kanban
              </button>
              <button
                onClick={() => setView('table')}
                className={`rounded-md px-2.5 h-7 text-xs font-medium transition-colors ${
                  view === 'table' ? 'bg-overlay-1/10 text-ink-100' : 'text-ink-400 hover:text-ink-200'
                }`}
              >
                Table
              </button>
            </div>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Open exceptions" value="42" sub="12 critical" deltaPct={-6.2} tone="danger" icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Financial exposure" value={fmtUSD(totalImpact)} sub="across active tickets" deltaPct={-11.4} tone="warning" icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard label="MTTR" value="2h 14m" sub="avg last 7 days" deltaPct={-8.1} tone="success" icon={<Clock3 className="h-4 w-4" />} />
        <KpiCard label="AI auto-mitigation rate" value="38%" sub="up from 24%" deltaPct={14} tone="brand" icon={<Sparkles className="h-4 w-4" />} />
      </div>

      {view === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {columnLabels.map((col) => {
            const items = filtered.filter((e) => e.status === col.key);
            return (
              <Card key={col.key} className="!p-0">
                <CardHeader>
                  <div>
                    <CardTitle>{col.label}</CardTitle>
                    <CardSubtitle>
                      {items.length} ticket{items.length !== 1 ? 's' : ''}
                    </CardSubtitle>
                  </div>
                  <Badge tone={statusTone[col.key]} dot>
                    {items.length}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {items.map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => setSelected(ex)}
                      className="w-full text-left rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-3 hover:bg-overlay-1/[0.05] transition-colors focus-ring"
                    >
                      <div className="flex items-center justify-between">
                        <Badge tone={severityTone[ex.severity]} dot>{ex.severity}</Badge>
                        <span className="mono text-[10px] text-ink-400">{ex.createdAt}</span>
                      </div>
                      <div className="mt-2 text-sm font-medium text-ink-100 leading-snug">
                        {ex.title}
                      </div>
                      <div className="mt-1 text-[11px] text-ink-400">{ex.resource}</div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-[10px] font-semibold text-white">
                            {ex.ownerInitials}
                          </div>
                          <span className="text-[11px] text-ink-300">{ex.owner.split(' ')[0]}</span>
                        </div>
                        {!!ex.impactUSD && ex.impactUSD > 0 && (
                          <span className="mono text-[11px] text-rose-700 dark:text-rose-300">
                            {fmtUSD(ex.impactUSD)}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <DataTable
              rows={filtered}
              getKey={(r) => r.id}
              onRowClick={(r) => setSelected(r)}
              columns={[
                {
                  key: 'ref',
                  header: 'Ref',
                  render: (r) => <span className="mono text-[13px] text-ink-100">{r.ref}</span>,
                },
                {
                  key: 'title',
                  header: 'Issue',
                  render: (r) => (
                    <div>
                      <div className="text-sm text-ink-100">{r.title}</div>
                      <div className="text-[11px] text-ink-400">{r.category} · {r.resource}</div>
                    </div>
                  ),
                },
                {
                  key: 'sev',
                  header: 'Severity',
                  render: (r) => <Badge tone={severityTone[r.severity]} dot>{r.severity}</Badge>,
                },
                {
                  key: 'owner',
                  header: 'Owner',
                  render: (r) => (
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-[10px] font-semibold text-white">
                        {r.ownerInitials}
                      </div>
                      <span className="text-sm text-ink-200">{r.owner}</span>
                    </div>
                  ),
                },
                {
                  key: 'impact',
                  header: 'Impact',
                  align: 'right',
                  render: (r) => r.impactUSD ? <span className="mono text-rose-700 dark:text-rose-300">{fmtUSD(r.impactUSD)}</span> : <span className="text-ink-400">—</span>,
                },
                {
                  key: 'status',
                  header: 'Status',
                  render: (r) => <Badge tone={statusTone[r.status]}>{r.status}</Badge>,
                },
                { key: 'open', header: '', align: 'right', render: () => <ChevronRight className="h-4 w-4 text-ink-500 inline" /> },
              ]}
            />
          </CardContent>
        </Card>
      )}

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        width="w-[680px]"
        title={selected?.title}
        subtitle={selected ? `${selected.ref} · ${selected.category}` : ''}
        footer={
          <>
            <Button variant="ghost" onClick={() => show({ tone: 'success', title: 'Comment added' })}>
              Add comment
            </Button>
            <Button variant="secondary" onClick={() => show({ tone: 'info', title: 'Reassignment opened' })}>
              Reassign
            </Button>
            <Button
              variant="primary"
              icon={<PlayCircle className="h-3.5 w-3.5" />}
              onClick={() => {
                if (selected) {
                  show({ tone: 'ai', title: 'AI mitigation running', body: `${selected.ref} · ${selected.aiRecommendation?.split('.')[0] ?? 'Plan applied'}` });
                  setSelected(null);
                }
              }}
            >
              Run AI mitigation
            </Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatTile label="Severity" value={<Badge tone={severityTone[selected.severity]} dot>{selected.severity}</Badge>} />
              <StatTile label="Status" value={<Badge tone={statusTone[selected.status]}>{selected.status}</Badge>} />
              <StatTile label="Impact" value={<span className="mono text-rose-700 dark:text-rose-300 text-base">{fmtUSD(selected.impactUSD ?? 0)}</span>} />
              <StatTile label="SLA" value={<span className="text-ink-100">{Math.floor(selected.slaMinutes / 60)}h {selected.slaMinutes % 60}m</span>} />
            </div>

            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="root">Root Cause</TabsTrigger>
                <TabsTrigger value="plan">AI Plan</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4 space-y-3">
                <div className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-4">
                  <div className="text-[11px] uppercase tracking-wider text-ink-400 font-semibold">Resource</div>
                  <div className="mt-1 text-sm text-ink-100">{selected.resource}</div>
                  {selected.customer && <div className="mt-2 text-[11px] text-ink-400">Customer · {selected.customer}</div>}
                </div>
                <div className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-4">
                  <div className="text-[11px] uppercase tracking-wider text-ink-400 font-semibold">Owner</div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-xs font-semibold text-white">
                      {selected.ownerInitials}
                    </div>
                    <div>
                      <div className="text-sm text-ink-100">{selected.owner}</div>
                      <div className="text-[11px] text-ink-400">SLA starts {selected.createdAt}</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="root" className="mt-4">
                <div className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-4">
                  <p className="text-sm text-ink-100 leading-relaxed">
                    {selected.rootCause ?? 'AI is still correlating signals — no high-confidence root cause yet.'}
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="plan" className="mt-4">
                <div className="rounded-xl border border-brand-400/30 bg-gradient-to-br from-brand-500/10 via-violet-500/5 to-transparent p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-brand-700 dark:text-brand-300" />
                    <div className="text-[11px] uppercase tracking-wider text-brand-700 dark:text-brand-200 font-semibold">AI Recommendation</div>
                  </div>
                  <p className="text-sm text-ink-100 leading-relaxed">
                    {selected.aiRecommendation ?? 'Collecting signals — recommendation will arrive shortly.'}
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="timeline" className="mt-4">
                <Timeline
                  items={[
                    { id: '1', time: selected.createdAt, title: 'Exception created', tone: 'warning' },
                    { id: '2', time: '9m ago', title: 'AI root cause identified', description: selected.rootCause, tone: 'violet' },
                    { id: '3', time: '4m ago', title: 'Recommendation generated', description: selected.aiRecommendation, tone: 'brand' },
                    { id: '4', time: 'Now', title: 'Awaiting operator action', tone: 'danger' },
                  ]}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </Drawer>
    </>
  );
}

function StatTile({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-3">
      <div className="text-[10px] uppercase tracking-wider text-ink-400">{label}</div>
      <div className="mt-1 text-sm">{value}</div>
    </div>
  );
}
