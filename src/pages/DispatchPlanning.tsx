import { useState } from 'react';
import {
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MapPin,
  Route,
  Sparkles,
  Truck,
  Users,
  Wrench,
} from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FilterBar } from '@/components/ui/FilterBar';
import { KpiCard } from '@/components/ui/KpiCard';
import { Card, CardContent, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { DRIVERS } from '@/data/core';
import { fmtUSD } from '@/lib/format';
import { useToast } from '@/components/ui/Toast';

const HOURS = Array.from({ length: 12 }).map((_, i) => `${String(6 + i).padStart(2, '0')}:00`);

interface LoadBlock {
  id: string;
  driver: string;
  startHour: number;
  span: number;
  lane: string;
  status: 'assigned' | 'in-progress' | 'suggested' | 'completed';
}

const LOADS: LoadBlock[] = [
  { id: 'L1', driver: 'Marco Velasquez', startHour: 0, span: 3, lane: 'LAX → Phoenix, AZ', status: 'completed' },
  { id: 'L2', driver: 'Marco Velasquez', startHour: 4, span: 3, lane: 'Empty return · PoLB', status: 'in-progress' },
  { id: 'L3', driver: 'Marco Velasquez', startHour: 8, span: 3, lane: 'Pull MSCU7349182 · 18:00 window', status: 'suggested' },
  { id: 'L4', driver: 'Dana Whitfield', startHour: 0, span: 4, lane: 'LAX → Riverside consolidator', status: 'in-progress' },
  { id: 'L5', driver: 'Dana Whitfield', startHour: 5, span: 3, lane: 'Street-turn: ZIMU9933400', status: 'suggested' },
  { id: 'L6', driver: 'Tariq Odom', startHour: 1, span: 4, lane: 'OAK → Sacramento', status: 'in-progress' },
  { id: 'L7', driver: 'Tariq Odom', startHour: 6, span: 4, lane: 'OAK empty return', status: 'assigned' },
  { id: 'L8', driver: 'Noor Haddad', startHour: 0, span: 6, lane: 'HOU → Dallas · round-trip', status: 'in-progress' },
  { id: 'L9', driver: 'Ivan Kessler', startHour: 2, span: 3, lane: 'SAV → Atlanta', status: 'in-progress' },
  { id: 'L10', driver: 'Ivan Kessler', startHour: 6, span: 2, lane: 'Inbound switch support', status: 'suggested' },
  { id: 'L11', driver: 'Priya Balaji', startHour: 1, span: 4, lane: 'EWR → Boston', status: 'in-progress' },
  { id: 'L12', driver: 'Eli Shepard', startHour: 0, span: 5, lane: 'CHI → Minneapolis', status: 'in-progress' },
  { id: 'L13', driver: 'Eli Shepard', startHour: 6, span: 3, lane: 'Return empty', status: 'assigned' },
  { id: 'L14', driver: 'Sofia Marchetti', startHour: 2, span: 4, lane: 'SAV → Charlotte · reefer', status: 'in-progress' },
];

const blockStyles: Record<LoadBlock['status'], string> = {
  completed: 'bg-emerald-400/20 border-emerald-400/40 text-emerald-700 dark:text-emerald-100',
  'in-progress': 'bg-brand-500/25 border-brand-400/50 text-brand-700 dark:text-brand-100',
  assigned: 'bg-overlay-1/[0.08] border-hairline/[0.15] text-ink-200',
  suggested: 'bg-violet-500/20 border-violet-400/50 text-violet-700 dark:text-violet-100 border-dashed',
};

export default function DispatchPlanning() {
  const { show } = useToast();
  const [plan, setPlan] = useState(false);
  return (
    <>
      <SectionHeader
        eyebrow="Operations · Driver Planning"
        title="Dispatch & Load Planning"
        description="Optimized dispatch plans generated every 15 minutes. Balance HOS, asset positioning, customer SLAs, and margin in a single plan."
        actions={
          <>
            <Button variant="subtle" icon={<CalendarClock className="h-3.5 w-3.5" />}>
              Today · 06:00–18:00
            </Button>
            <Button
              variant="primary"
              icon={<Sparkles className="h-3.5 w-3.5" />}
              onClick={() => {
                setPlan(true);
                show({ tone: 'ai', title: 'AI dispatch plan ready', body: '8 loads optimized · +$2,140 margin · 3 street-turns captured.' });
              }}
            >
              Generate AI plan
            </Button>
          </>
        }
      />

      <FilterBar
        pills={[
          { label: 'Terminal', value: 'All terminals' },
          { label: 'Mode', value: 'Drayage + OTR' },
          { label: 'Status', value: 'All' },
        ]}
        activeCount={3}
      />

      {plan && (
        <AlertBanner
          tone="ai"
          label="AI Dispatch Plan · Applied"
          title="8 loads optimized across 6 drivers · +$2,140 margin vs manual plan"
          body="3 street-turns captured, 2 empties consolidated, Velasquez rerouted to MSCU7349182 (18:00 window). Projected free-time savings: $4,000."
          actions={
            <>
              <Button variant="ghost" size="sm" onClick={() => { setPlan(false); show({ tone: 'info', title: 'Plan reverted to manual baseline' }); }}>Undo</Button>
              <Button variant="primary" size="sm" onClick={() => show({ tone: 'success', title: 'Plan committed', body: '8 loads dispatched · drivers notified.' })}>Commit plan</Button>
            </>
          }
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Drivers on shift" value={`${DRIVERS.length}`} sub="2 on standby" deltaPct={0} tone="brand" icon={<Users className="h-4 w-4" />} />
        <KpiCard label="Loads in plan" value="64" sub="9 ad-hoc" deltaPct={12} tone="success" icon={<Truck className="h-4 w-4" />} />
        <KpiCard label="HOS utilization" value="71%" sub="4 drivers near cap" deltaPct={-2.1} tone="warning" icon={<Clock3 className="h-4 w-4" />} />
        <KpiCard label="AI savings today" value={fmtUSD(6_840)} sub="vs. manual baseline" deltaPct={18} tone="violet" icon={<Wrench className="h-4 w-4" />} />
      </div>

      <Tabs defaultValue="gantt">
        <TabsList>
          <TabsTrigger value="gantt">Driver Plan</TabsTrigger>
          <TabsTrigger value="map">Yard & Routes</TabsTrigger>
          <TabsTrigger value="rules">Optimization Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="gantt" className="mt-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Driver Gantt · 12-hour plan</CardTitle>
                <CardSubtitle>Solid = assigned / in-progress · dashed = AI-suggested</CardSubtitle>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-ink-400">
                <span className="flex items-center gap-1.5"><span className="h-2 w-3 rounded-sm bg-emerald-400/30 border border-emerald-400/50" />Complete</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-3 rounded-sm bg-brand-500/40 border border-brand-400/60" />In progress</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-3 rounded-sm bg-overlay-1/10 border border-hairline/[0.15]" />Assigned</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-3 rounded-sm bg-violet-500/30 border border-violet-400/60 border-dashed" />AI suggested</span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                  <div className="grid grid-cols-[200px_1fr] border-b border-hairline/[0.08]">
                    <div className="py-2 px-3 text-[11px] uppercase tracking-wider text-ink-400 font-semibold">
                      Driver
                    </div>
                    <div className="grid grid-cols-12">
                      {HOURS.map((h) => (
                        <div key={h} className="py-2 px-1 text-[11px] text-ink-400 mono text-center border-l border-hairline/[0.08]">
                          {h}
                        </div>
                      ))}
                    </div>
                  </div>
                  {DRIVERS.map((d) => {
                    const blocks = LOADS.filter((l) => l.driver === d.name);
                    return (
                      <div key={d.id} className="grid grid-cols-[200px_1fr] border-b border-hairline/[0.08] last:border-0 min-h-[56px]">
                        <div className="flex items-center gap-3 px-3 py-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-[11px] font-semibold text-white">
                            {d.name.split(' ').map((x) => x[0]).join('')}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-sm text-ink-100">{d.name}</div>
                            <div className="text-[10px] text-ink-400">{d.terminal} · {d.hoursAvail}h left</div>
                          </div>
                        </div>
                        <div className="relative grid grid-cols-12">
                          {HOURS.map((_, i) => (
                            <div key={i} className="border-l border-hairline/[0.08] h-full" />
                          ))}
                          {blocks.map((b) => (
                            <div
                              key={b.id}
                              className={`absolute top-2 bottom-2 rounded-md border px-2 py-1 text-[11px] font-medium truncate ${blockStyles[b.status]}`}
                              style={{
                                left: `${(b.startHour / 12) * 100}%`,
                                width: `${(b.span / 12) * 100}%`,
                              }}
                              title={b.lane}
                            >
                              <div className="truncate">{b.lane}</div>
                              {b.status === 'suggested' && (
                                <div className="flex items-center gap-1 text-[10px] opacity-80">
                                  <Sparkles className="h-2.5 w-2.5" /> AI suggested
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="mt-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <Card className="xl:col-span-2">
              <CardHeader>
                <div>
                  <CardTitle>Yard & Route Overview · LAX Terminal</CardTitle>
                  <CardSubtitle>Tractors, chassis, and empty locations</CardSubtitle>
                </div>
                <Badge tone="brand">Live</Badge>
              </CardHeader>
              <CardContent>
                <div className="relative h-[320px] rounded-xl border border-hairline/[0.08] bg-ink-950 grid-backdrop overflow-hidden">
                  {['Lot A', 'Lot B', 'Lot C'].map((zone, i) => (
                    <div
                      key={zone}
                      className="absolute rounded-xl border border-hairline/[0.12] bg-overlay-1/[0.02]"
                      style={{
                        left: `${8 + i * 30}%`,
                        top: '15%',
                        width: '22%',
                        height: '70%',
                      }}
                    >
                      <div className="absolute top-2 left-2 text-[10px] uppercase tracking-wider text-ink-400 font-semibold">{zone}</div>
                      <div className="absolute inset-0 grid grid-cols-4 gap-1 p-4 pt-7">
                        {Array.from({ length: 12 }).map((_, j) => {
                          const r = ((i + 1) * (j + 1) * 13) % 10;
                          const isTractor = r === 0;
                          const isChassis = r < 3;
                          const isEmpty = r < 7;
                          return (
                            <div
                              key={j}
                              className={`aspect-square rounded-sm border ${
                                isTractor ? 'bg-brand-500/50 border-brand-400/60'
                                : isChassis ? 'bg-violet-500/40 border-violet-400/50'
                                : isEmpty ? 'bg-emerald-500/25 border-emerald-400/40'
                                : 'bg-overlay-1/5 border-hairline/[0.12]'
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-lg border border-hairline/[0.08] bg-ink-900/80 px-3 py-2 backdrop-blur text-[11px] text-ink-300">
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-brand-500/50 border border-brand-400/60" /> Tractor</span>
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-violet-500/40 border border-violet-400/50" /> Chassis</span>
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-emerald-500/25 border border-emerald-400/40" /> Empty container</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Open Loads</CardTitle>
                  <CardSubtitle>Needing assignment</CardSubtitle>
                </div>
                <Badge tone="warning">4</Badge>
              </CardHeader>
              <CardContent className="space-y-2.5 pt-0">
                {[
                  { id: 'LD-884', lane: 'LAX → Ontario, CA', window: '15:30–17:30', mode: 'Dray' },
                  { id: 'LD-889', lane: 'OAK → San Jose, CA', window: '14:00–17:00', mode: 'Dray' },
                  { id: 'LD-892', lane: 'SAV → Macon, GA', window: '16:00–19:00', mode: 'OTR' },
                  { id: 'LD-894', lane: 'EWR → Hartford, CT', window: '17:30–20:30', mode: 'OTR' },
                ].map((l) => (
                  <div key={l.id} className="rounded-lg border border-hairline/[0.08] bg-overlay-1/[0.02] px-3 py-2.5 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="mono text-[11px] text-ink-400">{l.id}</span>
                        <Badge tone="info">{l.mode}</Badge>
                      </div>
                      <div className="mt-0.5 truncate text-sm text-ink-100">{l.lane}</div>
                      <div className="text-[11px] text-ink-400 mono">{l.window}</div>
                    </div>
                    <Button variant="secondary" size="sm" icon={<Route className="h-3.5 w-3.5" />}>Match</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rules" className="mt-4">
          <Card>
            <CardContent className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { name: 'Prefer street-turns when empty is within 10mi', on: true, impact: 'High' },
                { name: 'Respect HOS — reserve 1h buffer per driver', on: true, impact: 'Critical' },
                { name: 'Favor high-margin customers in peak hours', on: true, impact: 'Medium' },
                { name: 'Avoid carriers with OTP < 88%', on: true, impact: 'High' },
                { name: 'Combine empty returns with inbound pulls', on: true, impact: 'High' },
                { name: 'Auto-escalate late-tender to backup carrier', on: false, impact: 'Medium' },
              ].map((r) => (
                <div key={r.name} className="rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.02] p-4 flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-ink-100">{r.name}</div>
                    <div className="text-[11px] text-ink-400 mt-0.5">Impact: {r.impact}</div>
                  </div>
                  <div
                    className={`w-11 h-6 rounded-full relative transition-colors ${
                      r.on ? 'bg-brand-500' : 'bg-overlay-1/10'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                        r.on ? 'left-5' : 'left-0.5'
                      }`}
                    />
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
