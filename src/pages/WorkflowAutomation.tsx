import {
  CheckCircle2,
  ChevronRight,
  Clock3,
  GitBranch,
  PlayCircle,
  Plus,
  Sparkles,
  Workflow as WorkflowIcon,
  Zap,
} from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FilterBar } from '@/components/ui/FilterBar';
import { KpiCard } from '@/components/ui/KpiCard';
import { Card, CardContent, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { fmtUSD } from '@/lib/format';

const flows = [
  { id: 'fl-1', name: 'Free-time alert → AI pull plan', runs: 184, success: 96.2, saved: 28_400, status: 'active' },
  { id: 'fl-2', name: 'Detention ≥ 60min → auto accessorial bill', runs: 221, success: 98.1, saved: 18_200, status: 'active' },
  { id: 'fl-3', name: 'Carrier OTP < 88% → re-tender', runs: 46, success: 91.3, saved: 12_900, status: 'active' },
  { id: 'fl-4', name: 'Reefer temp excursion → customer notify', runs: 18, success: 94.4, saved: 0, status: 'active' },
  { id: 'fl-5', name: 'Negative-margin shipment → finance escalation', runs: 14, success: 100, saved: 4_200, status: 'active' },
  { id: 'fl-6', name: 'Customs hold > 6h → CBP liaison ticket', runs: 22, success: 95.5, saved: 9_800, status: 'active' },
  { id: 'fl-7', name: 'Driver HOS < 1h → auto swap', runs: 8, success: 87.5, saved: 2_400, status: 'paused' },
  { id: 'fl-8', name: 'ASN short-ship → open shortage claim', runs: 27, success: 92.6, saved: 5_100, status: 'active' },
];

const templates = [
  { name: 'Free-time pull optimizer', category: 'Drayage', desc: 'Rebalance pulls to maximize free-time savings' },
  { name: 'Dock congestion rerouter', category: 'Warehouse', desc: 'Shift outbound waves when docks breach threshold' },
  { name: 'Carrier scorecard auto-tender', category: 'Dispatch', desc: 'Switch carriers based on performance' },
  { name: 'Detention accessorial biller', category: 'Finance', desc: 'Generate and file detention claims' },
  { name: 'Reefer compliance monitor', category: 'Quality', desc: 'Watch temp curves and alert on excursions' },
  { name: 'Customer proactive ETA', category: 'Customer', desc: 'Notify customers when ETA variance > 30 min' },
];

export default function WorkflowAutomation() {
  return (
    <>
      <SectionHeader
        eyebrow="Platform · Automation"
        title="Workflow Automation"
        description="Low-code, event-driven workflows that turn AI recommendations into action. Every play runs governed, auditable, reversible."
        actions={
          <>
            <Button variant="subtle" icon={<GitBranch className="h-3.5 w-3.5" />}>Versions</Button>
            <Button variant="primary" icon={<Plus className="h-3.5 w-3.5" />}>New workflow</Button>
          </>
        }
      />

      <FilterBar
        pills={[
          { label: 'Status', value: 'Active' },
          { label: 'Domain', value: 'All' },
          { label: 'Owner', value: 'All teams' },
        ]}
        activeCount={3}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Active workflows" value="24" sub="2 paused" deltaPct={9} tone="brand" icon={<WorkflowIcon className="h-4 w-4" />} />
        <KpiCard label="Runs (24h)" value="1,284" sub="success 95.7%" deltaPct={4.2} tone="success" icon={<Zap className="h-4 w-4" />} />
        <KpiCard label="Saved this week" value={fmtUSD(81_000)} sub="vs. manual baseline" deltaPct={11.4} tone="violet" icon={<Sparkles className="h-4 w-4" />} />
        <KpiCard label="Avg. run latency" value="2.4s" sub="99p 6.2s" deltaPct={-8.1} tone="brand" icon={<Clock3 className="h-4 w-4" />} />
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Workflow · Free-time alert → AI pull plan</CardTitle>
            <CardSubtitle>Triggered 184 times in last 7 days · 96.2% success</CardSubtitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="success" dot>Active</Badge>
            <Button variant="secondary" size="sm" icon={<PlayCircle className="h-3.5 w-3.5" />}>Run now</Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              { type: 'Trigger', name: 'Free-time < 12h', tone: 'warning', icon: '⏳' },
              { type: 'Filter', name: 'Customer tier ≥ Mid-market', tone: 'neutral', icon: '◇' },
              { type: 'AI', name: 'Generate pull plan', tone: 'brand', icon: '✦' },
              { type: 'Action', name: 'Dispatch to driver', tone: 'violet', icon: '→' },
              { type: 'Notify', name: 'Customer + Ops', tone: 'info', icon: '⚐' },
            ].map((s, i, arr) => (
              <div key={i} className="relative">
                <div className={`rounded-xl border p-4 ${
                  s.tone === 'brand' ? 'border-brand-400/30 bg-gradient-to-br from-brand-500/10 via-violet-500/5 to-transparent'
                  : s.tone === 'warning' ? 'border-amber-400/25 bg-amber-400/5'
                  : s.tone === 'violet' ? 'border-violet-400/25 bg-violet-400/5'
                  : s.tone === 'info' ? 'border-cyan-400/25 bg-cyan-400/5'
                  : 'border-hairline/[0.08] bg-overlay-1/[0.02]'
                }`}>
                  <div className="text-[10px] uppercase tracking-wider text-ink-400 font-semibold">{s.type}</div>
                  <div className="mt-2 text-sm font-medium text-ink-100">{s.name}</div>
                  <div className="mt-3 text-[11px] text-ink-400">Step {i + 1} of {arr.length}</div>
                </div>
                {i < arr.length - 1 && (
                  <ChevronRight className="hidden md:block absolute top-1/2 -right-3 h-5 w-5 -translate-y-1/2 text-ink-500" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
            <div className="rounded-lg border border-hairline/[0.08] bg-overlay-1/[0.02] p-3">
              <div className="text-[10px] uppercase tracking-wider text-ink-400">Last 24h runs</div>
              <div className="mt-1 mono text-ink-100">58</div>
            </div>
            <div className="rounded-lg border border-hairline/[0.08] bg-overlay-1/[0.02] p-3">
              <div className="text-[10px] uppercase tracking-wider text-ink-400">Success</div>
              <div className="mt-1 mono text-emerald-700 dark:text-emerald-300">96.2%</div>
            </div>
            <div className="rounded-lg border border-hairline/[0.08] bg-overlay-1/[0.02] p-3">
              <div className="text-[10px] uppercase tracking-wider text-ink-400">Avg. duration</div>
              <div className="mt-1 mono text-ink-100">1.8s</div>
            </div>
            <div className="rounded-lg border border-hairline/[0.08] bg-overlay-1/[0.02] p-3">
              <div className="text-[10px] uppercase tracking-wider text-ink-400">Savings</div>
              <div className="mt-1 mono text-emerald-700 dark:text-emerald-300">{fmtUSD(28400)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="flows">
        <TabsList>
          <TabsTrigger value="flows">Active Workflows</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="runs">Run History</TabsTrigger>
        </TabsList>
        <TabsContent value="flows" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <DataTable
                rows={flows}
                getKey={(r) => r.id}
                columns={[
                  {
                    key: 'name',
                    header: 'Workflow',
                    render: (r) => (
                      <div className="flex items-center gap-2">
                        <WorkflowIcon className="h-3.5 w-3.5 text-ink-400" />
                        <span className="text-ink-100 font-medium">{r.name}</span>
                      </div>
                    ),
                  },
                  {
                    key: 'runs',
                    header: 'Runs (7d)',
                    align: 'right',
                    render: (r) => <span className="mono text-ink-200">{r.runs}</span>,
                  },
                  {
                    key: 'success',
                    header: 'Success',
                    render: (r) => (
                      <div className="w-36">
                        <ProgressBar value={r.success} tone={r.success > 95 ? 'success' : r.success > 90 ? 'brand' : 'warning'} size="sm" />
                        <div className="mt-0.5 mono text-[10px] text-ink-400">{r.success}%</div>
                      </div>
                    ),
                  },
                  {
                    key: 'saved',
                    header: 'Savings',
                    align: 'right',
                    render: (r) => (r.saved > 0 ? <span className="mono text-emerald-700 dark:text-emerald-300">{fmtUSD(r.saved)}</span> : <span className="text-ink-400">—</span>),
                  },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (r) => (
                      <Badge tone={r.status === 'active' ? 'success' : 'neutral'} dot>
                        {r.status}
                      </Badge>
                    ),
                  },
                  {
                    key: 'open',
                    header: '',
                    align: 'right',
                    render: () => <ChevronRight className="inline h-4 w-4 text-ink-500" />,
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="templates" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {templates.map((t) => (
              <Card key={t.name}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <Badge tone="brand">{t.category}</Badge>
                    <Sparkles className="h-3.5 w-3.5 text-brand-700 dark:text-brand-300" />
                  </div>
                  <div className="mt-3 text-sm font-semibold text-ink-100">{t.name}</div>
                  <div className="mt-1 text-xs text-ink-400 leading-relaxed">{t.desc}</div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[11px] text-ink-400">5 min setup</span>
                    <Button variant="secondary" size="sm">Use template</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="runs" className="mt-4">
          <Card>
            <CardContent className="p-5 space-y-2">
              {[
                { time: '14:32', flow: 'Free-time alert → AI pull plan', status: 'success', dur: '1.2s' },
                { time: '14:30', flow: 'Detention ≥ 60min → auto accessorial bill', status: 'success', dur: '2.4s' },
                { time: '14:27', flow: 'Carrier OTP < 88% → re-tender', status: 'failed', dur: '0.8s' },
                { time: '14:22', flow: 'Free-time alert → AI pull plan', status: 'success', dur: '1.6s' },
                { time: '14:18', flow: 'Reefer temp excursion → customer notify', status: 'success', dur: '0.9s' },
                { time: '14:11', flow: 'Customs hold > 6h → CBP liaison ticket', status: 'success', dur: '3.1s' },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-hairline/[0.08] bg-overlay-1/[0.02] px-3 py-2.5">
                  <div className="mono text-sm text-ink-400 w-14">{r.time}</div>
                  <div className="flex-1 text-sm text-ink-100">{r.flow}</div>
                  <Badge tone={r.status === 'success' ? 'success' : 'danger'} dot>{r.status}</Badge>
                  <span className="mono text-[11px] text-ink-400 w-12 text-right">{r.dur}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
