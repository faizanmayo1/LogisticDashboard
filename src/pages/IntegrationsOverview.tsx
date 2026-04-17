import {
  Activity,
  ArrowLeftRight,
  ArrowRightLeft,
  Cable,
  CheckCircle2,
  Database,
  Download,
  Plug,
  Plus,
  RefreshCw,
  Sparkles,
  Upload,
  Zap,
} from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FilterBar } from '@/components/ui/FilterBar';
import { KpiCard } from '@/components/ui/KpiCard';
import { Card, CardContent, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/Card';
import { Badge, BadgeTone } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { INTEGRATIONS } from '@/data/core';

const statusTone: Record<string, BadgeTone> = {
  healthy: 'success',
  degraded: 'warning',
  outage: 'danger',
};

export default function IntegrationsOverview() {
  const healthy = INTEGRATIONS.filter((i) => i.status === 'healthy').length;
  return (
    <>
      <SectionHeader
        eyebrow="Platform · Integrations"
        title="Integrations Overview"
        description="One data fabric for your logistics stack — ERP, WMS, TMS, EDI, visibility, CRM, and warehouse. Every pipeline monitored, every latency tracked."
        actions={
          <>
            <Button variant="subtle" icon={<Database className="h-3.5 w-3.5" />}>Data contracts</Button>
            <Button variant="primary" icon={<Plus className="h-3.5 w-3.5" />}>Add integration</Button>
          </>
        }
      />

      <FilterBar
        pills={[
          { label: 'Category', value: 'All' },
          { label: 'Direction', value: 'All' },
          { label: 'Status', value: 'Any' },
        ]}
        activeCount={3}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Integrations" value={`${INTEGRATIONS.length}`} sub={`${healthy} healthy`} deltaPct={0} tone="brand" icon={<Plug className="h-4 w-4" />} />
        <KpiCard label="Events (24h)" value="2.4M" sub="avg latency 182ms" deltaPct={4.1} tone="success" icon={<Activity className="h-4 w-4" />} />
        <KpiCard label="Bi-directional" value="7" sub="of 10 connectors" deltaPct={0} tone="violet" icon={<ArrowLeftRight className="h-4 w-4" />} />
        <KpiCard label="SLA breaches" value="1" sub="CargoQuotes outage" deltaPct={-50} tone="warning" icon={<Zap className="h-4 w-4" />} />
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <div>
            <CardTitle>Data Fabric</CardTitle>
            <CardSubtitle>Live view of source systems feeding the Meridian platform</CardSubtitle>
          </div>
          <Badge tone="success" dot>All systems streaming</Badge>
        </CardHeader>
        <CardContent>
          <div className="relative rounded-xl border border-hairline/[0.08] bg-ink-950 grid-backdrop p-6 overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(500px 300px at 50% 50%, rgba(77,149,255,0.14), transparent 60%)',
              }}
            />
            <div className="relative flex flex-col items-center">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-500 shadow-glow">
                <Sparkles className="h-8 w-8 text-white" />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-overlay-1/20" />
              </div>
              <div className="mt-3 text-sm font-semibold text-ink-100">Meridian Core</div>
              <div className="text-[11px] text-ink-400">Unified data model</div>
            </div>

            <div className="relative mt-8 grid grid-cols-2 md:grid-cols-5 gap-3">
              {INTEGRATIONS.map((i) => (
                <div
                  key={i.id}
                  className="group rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.03] p-3 hover:bg-overlay-1/[0.06] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 border border-brand-400/25 text-brand-700 dark:text-brand-300">
                      <Cable className="h-3.5 w-3.5" />
                    </div>
                    <Badge tone={statusTone[i.status]} dot>{i.status}</Badge>
                  </div>
                  <div className="mt-2 text-sm font-medium text-ink-100 truncate">{i.name}</div>
                  <div className="text-[10px] text-ink-400">{i.category}</div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-ink-400">
                    <span className="flex items-center gap-1">
                      {i.direction === 'bi' ? <ArrowRightLeft className="h-3 w-3" />
                        : i.direction === 'in' ? <Download className="h-3 w-3" />
                        : <Upload className="h-3 w-3" />}
                      {i.direction === 'bi' ? 'Bi' : i.direction === 'in' ? 'In' : 'Out'}
                    </span>
                    <span className="mono">{i.lastSync}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Connector Health</CardTitle>
            <CardSubtitle>Live latency, direction, and last sync</CardSubtitle>
          </div>
          <Button variant="subtle" size="sm" icon={<RefreshCw className="h-3.5 w-3.5" />}>Refresh</Button>
        </CardHeader>
        <CardContent className="pt-0">
          <DataTable
            rows={INTEGRATIONS}
            getKey={(r) => r.id}
            columns={[
              {
                key: 'name',
                header: 'Integration',
                render: (r) => (
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-500/10 border border-brand-400/25 text-brand-700 dark:text-brand-300">
                      <Cable className="h-3 w-3" />
                    </div>
                    <div>
                      <div className="text-sm text-ink-100 font-medium">{r.name}</div>
                      <div className="text-[11px] text-ink-400">{r.category}</div>
                    </div>
                  </div>
                ),
              },
              {
                key: 'dir',
                header: 'Direction',
                render: (r) => (
                  <Badge tone="neutral">
                    {r.direction === 'bi' ? 'Bi-directional' : r.direction === 'in' ? 'Inbound' : 'Outbound'}
                  </Badge>
                ),
              },
              {
                key: 'latency',
                header: 'Latency',
                render: (r) =>
                  r.status === 'outage' ? (
                    <span className="text-rose-700 dark:text-rose-300 text-sm">—</span>
                  ) : (
                    <div className="w-32">
                      <ProgressBar value={Math.min(r.latencyMs, 800)} max={800} tone={r.latencyMs > 500 ? 'warning' : 'brand'} size="sm" />
                      <div className="mt-0.5 mono text-[10px] text-ink-400">{r.latencyMs} ms</div>
                    </div>
                  ),
              },
              { key: 'sync', header: 'Last sync', render: (r) => <span className="mono text-ink-200 text-sm">{r.lastSync}</span> },
              { key: 'status', header: 'Status', render: (r) => <Badge tone={statusTone[r.status]} dot>{r.status}</Badge> },
              {
                key: 'actions',
                header: '',
                align: 'right',
                render: () => (
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">Logs</Button>
                    <Button variant="secondary" size="sm">Configure</Button>
                  </div>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Event Volume · 24h</CardTitle>
              <CardSubtitle>Top connectors by message throughput</CardSubtitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'EDI Gateway (X12)', value: 412_000 },
              { name: 'Manhattan WMS', value: 384_000 },
              { name: 'Project44 Visibility', value: 296_000 },
              { name: 'SAP S/4HANA', value: 228_000 },
              { name: 'Blue Yonder TMS', value: 184_000 },
            ].map((r) => (
              <div key={r.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-ink-200">{r.name}</span>
                  <span className="mono text-ink-300">{r.value.toLocaleString()}</span>
                </div>
                <ProgressBar value={r.value} max={500_000} tone="brand" size="sm" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Recent Events</CardTitle>
              <CardSubtitle>Normalized inbound + outbound</CardSubtitle>
            </div>
            <Badge tone="success" dot>Live</Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { t: '14:32', src: 'EDI · 204 Tender', ok: true },
              { t: '14:32', src: 'Manhattan WMS · ASN', ok: true },
              { t: '14:31', src: 'Project44 · Location', ok: true },
              { t: '14:31', src: 'SAP · Invoice Sync', ok: true },
              { t: '14:30', src: 'CargoQuotes · Rating', ok: false },
              { t: '14:30', src: 'Salesforce · Opp Update', ok: true },
              { t: '14:29', src: 'Blue Yonder · TMS Load', ok: true },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-hairline/[0.08] bg-overlay-1/[0.02] px-3 py-2">
                <CheckCircle2 className={`h-3.5 w-3.5 ${r.ok ? 'text-emerald-400' : 'text-rose-400'}`} />
                <div className="flex-1 text-sm text-ink-100">{r.src}</div>
                <span className="mono text-[11px] text-ink-400">{r.t}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
