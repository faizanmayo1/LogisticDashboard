import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Building2,
  ChevronDown,
  ChevronUp,
  Container as ContainerIcon,
  EyeOff,
  GanttChartSquare,
  Presentation,
  Truck,
  Users,
  Warehouse as WarehouseIcon,
  Workflow as WorkflowIcon,
} from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/cn';

const HIDE_KEY = 'meridian.presenter-hidden';

interface Scenario {
  id: string;
  icon: ReactNode;
  title: string;
  note: string;
  path: string;
}

// Mapped 1:1 to req §14 "Simulated Scenarios".
const SCENARIOS: Scenario[] = [
  {
    id: 'free-time',
    icon: <ContainerIcon className="h-3.5 w-3.5" />,
    title: 'Container nearing free-time',
    note: '"Show how AI catches drayage exposure before it becomes detention."',
    path: '/containers',
  },
  {
    id: 'warehouse',
    icon: <WarehouseIcon className="h-3.5 w-3.5" />,
    title: 'Warehouse overflow risk',
    note: '"Late inbounds + dock at 88% — AI rebalances before SLA misses."',
    path: '/warehouse',
  },
  {
    id: 'margin',
    icon: <GanttChartSquare className="h-3.5 w-3.5" />,
    title: 'Margin-negative customer lane',
    note: '"Crescent Foods · -21.4% on SHP-1021 · root cause + claim packet."',
    path: '/margin',
  },
  {
    id: 'dispatch',
    icon: <Truck className="h-3.5 w-3.5" />,
    title: 'AI rerouting of dispatch plan',
    note: '"Click Generate AI plan — 8 loads, +$2,140, 3 street-turns."',
    path: '/dispatch',
  },
  {
    id: 'sla',
    icon: <WorkflowIcon className="h-3.5 w-3.5" />,
    title: 'Late inbound → outbound SLA risk',
    note: '"Inbound delay cascades to outbound — auto-mitigation in queue."',
    path: '/exceptions',
  },
  {
    id: 'entities',
    icon: <Building2 className="h-3.5 w-3.5" />,
    title: 'Multi-entity executive comparison',
    note: '"3 BUs normalized — replicate West playbook to East and South."',
    path: '/entities',
  },
  {
    id: 'customer',
    icon: <Users className="h-3.5 w-3.5" />,
    title: 'Customer portal visibility',
    note: '"Inbound containers tied to inventory + outbound order availability."',
    path: '/customer-portal',
  },
];

export function PresenterDock() {
  const nav = useNavigate();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  // Read persisted hide flag
  useEffect(() => {
    setHidden(localStorage.getItem(HIDE_KEY) === '1');
  }, []);

  // Toggle with `P` so the presenter can bring the dock back in customer-view mode.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'p' && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        setHidden((h) => {
          const next = !h;
          if (next) localStorage.setItem(HIDE_KEY, '1');
          else localStorage.removeItem(HIDE_KEY);
          return next;
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (hidden) return null;

  const hide = () => {
    localStorage.setItem(HIDE_KEY, '1');
    setHidden(true);
    setOpen(false);
  };

  const jumpTo = (path: string) => {
    nav(path);
    // keep the dock collapsed after jump so it doesn't dominate the screen
    setOpen(false);
  };

  return (
    <aside className="fixed bottom-6 left-6 z-40">
      <AnimatePresence initial={false} mode="wait">
        {open ? (
          <motion.div
            key="open"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            className="w-[340px] max-w-[calc(100vw-3rem)] rounded-2xl border border-hairline/[0.12] bg-ink-900 shadow-card backdrop-blur overflow-hidden"
          >
            <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-hairline/[0.08] bg-gradient-to-r from-violet-500/10 via-brand-500/5 to-transparent">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-brand-500 text-white">
                  <Presentation className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink-100 leading-tight">Presenter Dock</div>
                  <div className="text-[10px] text-ink-400">Visible to you only</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={hide}
                  title="Hide for customer view (Cmd+Shift+P to bring back)"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-ink-400 hover:text-ink-100 hover:bg-overlay-1/[0.06] transition-colors"
                  aria-label="Hide dock"
                >
                  <EyeOff className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-ink-400 hover:text-ink-100 hover:bg-overlay-1/[0.06] transition-colors"
                  aria-label="Collapse"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </header>

            <div className="px-3 py-3 max-h-[60vh] overflow-y-auto">
              <div className="px-1.5 pb-1.5 text-[10px] uppercase tracking-wider text-ink-400 font-semibold">
                Demo scenarios
              </div>
              <ul className="space-y-1">
                {SCENARIOS.map((s, i) => (
                  <li key={s.id}>
                    <button
                      onClick={() => jumpTo(s.path)}
                      className="w-full text-left rounded-lg px-2.5 py-2 hover:bg-overlay-1/[0.04] transition-colors focus-ring"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md border border-hairline/[0.12] bg-overlay-1/[0.04] text-ink-300 text-[10px] mono">
                          {i + 1}
                        </span>
                        <span className="text-ink-300">{s.icon}</span>
                        <span className="flex-1 text-[13px] font-medium text-ink-100 truncate">
                          {s.title}
                        </span>
                        <ArrowRight className="h-3 w-3 text-ink-500" />
                      </div>
                      <div className="ml-8 mt-0.5 text-[11px] italic text-ink-400 leading-snug">
                        {s.note}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="px-4 py-2.5 border-t border-hairline/[0.08] flex items-center justify-between text-[10px] text-ink-400">
              <span>
                <kbd className="rounded border border-hairline/[0.15] bg-overlay-1/[0.05] px-1 py-px mono">⌘⇧P</kbd>{' '}
                toggle dock
              </span>
              <span>Req §14 scenarios</span>
            </footer>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            onClick={() => setOpen(true)}
            className={cn(
              'group inline-flex items-center gap-2 rounded-full pl-2.5 pr-3.5 h-10 border border-hairline/[0.12] bg-ink-900 shadow-card backdrop-blur text-ink-100 hover:bg-overlay-1/[0.04] transition-colors focus-ring',
            )}
            aria-label="Open Presenter Dock"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-brand-500 text-white">
              <Presentation className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-semibold">Demo scenarios</span>
            <ChevronUp className="h-3 w-3 text-ink-400 transition-transform group-hover:-translate-y-0.5" />
          </motion.button>
        )}
      </AnimatePresence>
    </aside>
  );
}
