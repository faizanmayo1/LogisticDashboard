import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  Bell,
  ChevronRight,
  Command as CommandIcon,
  Container as ContainerIcon,
  Globe2,
  Moon,
  Package,
  Search,
  Sun,
  Truck,
  Users,
} from 'lucide-react';
import { IconButton } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { NAV } from '@/config/nav';
import { useTheme } from '@/lib/theme';
import { useToast } from '@/components/ui/Toast';
import { CONTAINERS } from '@/data/containers';
import { SHIPMENTS } from '@/data/shipments';
import { CUSTOMERS } from '@/data/core';
import { EXCEPTIONS } from '@/data/exceptions';
import { cn } from '@/lib/cn';

function useBreadcrumbs() {
  const loc = useLocation();
  const current = NAV.find((n) => n.path === loc.pathname);
  return current
    ? [{ label: current.group, path: '#' }, { label: current.label, path: loc.pathname }]
    : [{ label: 'Overview', path: '/' }];
}

interface SearchHit {
  type: 'container' | 'shipment' | 'customer' | 'exception';
  id: string;
  primary: string;
  secondary: string;
  path: string;
  icon: JSX.Element;
}

function buildIndex(): SearchHit[] {
  return [
    ...CONTAINERS.map<SearchHit>((c) => ({
      type: 'container',
      id: c.id,
      primary: c.number,
      secondary: `${c.steamship} · ${c.customer} · ${c.status}`,
      path: '/containers',
      icon: <ContainerIcon className="h-3.5 w-3.5" />,
    })),
    ...SHIPMENTS.map<SearchHit>((s) => ({
      type: 'shipment',
      id: s.id,
      primary: s.ref,
      secondary: `${s.lane} · ${s.customer} · ${s.status}`,
      path: '/',
      icon: <Truck className="h-3.5 w-3.5" />,
    })),
    ...CUSTOMERS.map<SearchHit>((c) => ({
      type: 'customer',
      id: c.id,
      primary: c.name,
      secondary: `${c.tier} · ${c.monthlyShipments.toLocaleString()} shipments/mo`,
      path: '/customer-portal',
      icon: <Users className="h-3.5 w-3.5" />,
    })),
    ...EXCEPTIONS.map<SearchHit>((e) => ({
      type: 'exception',
      id: e.id,
      primary: e.ref,
      secondary: e.title,
      path: '/exceptions',
      icon: <AlertTriangle className="h-3.5 w-3.5" />,
    })),
  ];
}

const NOTIFICATIONS = [
  { id: 'n1', tone: 'danger' as const, title: 'EX-2431 free-time risk · Halcyon', time: '2m', path: '/exceptions' },
  { id: 'n2', tone: 'warning' as const, title: 'SAV-07 dock util at 88%', time: '12m', path: '/warehouse' },
  { id: 'n3', tone: 'brand' as const, title: 'AI plan applied · $2,140 saved', time: '24m', path: '/dispatch' },
  { id: 'n4', tone: 'info' as const, title: 'Customs hold released · EGHU4442019', time: '38m', path: '/containers' },
];

export function Topbar() {
  const crumbs = useBreadcrumbs();
  const { theme, toggle } = useTheme();
  const { show } = useToast();
  const nav = useNavigate();

  const [q, setQ] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  const index = useMemo(() => buildIndex(), []);
  const hits = useMemo(() => {
    if (!q.trim()) return [];
    const term = q.toLowerCase();
    return index
      .filter((h) => h.primary.toLowerCase().includes(term) || h.secondary.toLowerCase().includes(term))
      .slice(0, 8);
  }, [q, index]);

  // Close popovers when clicking outside / pressing Esc
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (searchOpen && !searchRef.current?.contains(e.target as Node)) setSearchOpen(false);
      if (bellOpen && !bellRef.current?.contains(e.target as Node)) setBellOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setBellOpen(false);
      }
      // Cmd/Ctrl + K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => document.getElementById('global-search-input')?.focus(), 50);
      }
    };
    window.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [searchOpen, bellOpen]);

  const goTo = (path: string) => {
    setSearchOpen(false);
    setBellOpen(false);
    nav(path);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-hairline/[0.08] bg-ink-950/70 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-4 px-6">
        <nav className="flex items-center gap-1.5 text-xs">
          {crumbs.map((c, i) => (
            <div key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3 w-3 text-ink-500" />}
              {i === crumbs.length - 1 ? (
                <span className="font-medium text-ink-100">{c.label}</span>
              ) : (
                <Link to={c.path} className="text-ink-400 hover:text-ink-200">
                  {c.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div ref={searchRef} className="relative flex-1 max-w-[540px] mx-auto">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              id="global-search-input"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search shipments, containers, customers, exceptions..."
              className="w-full h-10 rounded-xl border border-hairline/[0.08] bg-ink-900/80 pl-9 pr-12 text-sm text-ink-100 placeholder-ink-400 transition-colors hover:border-hairline/[0.12] focus-ring"
            />
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-md border border-hairline/[0.12] bg-overlay-1/5 px-1.5 py-0.5 text-[10px] font-medium text-ink-300">
              <CommandIcon className="h-3 w-3" />K
            </span>
          </div>
          <AnimatePresence>
            {searchOpen && (q || hits.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
                className="absolute left-0 right-0 top-12 rounded-xl border border-hairline/[0.12] bg-ink-900 shadow-card backdrop-blur p-2 max-h-[420px] overflow-y-auto"
              >
                {hits.length === 0 ? (
                  <div className="px-3 py-6 text-center">
                    <div className="text-sm text-ink-300">No matches for "{q}"</div>
                    <div className="mt-1 text-[11px] text-ink-400">
                      Try a container ID, customer name, or shipment ref
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="px-2 py-1.5 text-[10px] uppercase tracking-wider text-ink-400 font-semibold">
                      {hits.length} result{hits.length === 1 ? '' : 's'}
                    </div>
                    {hits.map((h) => (
                      <button
                        key={h.type + h.id}
                        onClick={() => goTo(h.path)}
                        className="w-full flex items-center gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-overlay-1/[0.04] transition-colors"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-md border border-hairline/[0.12] bg-overlay-1/5 text-ink-300">
                          {h.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm text-ink-100 font-medium">{h.primary}</div>
                          <div className="truncate text-[11px] text-ink-400">{h.secondary}</div>
                        </div>
                        <Badge tone={
                          h.type === 'container' ? 'brand'
                          : h.type === 'shipment' ? 'success'
                          : h.type === 'customer' ? 'violet'
                          : 'danger'
                        }>{h.type}</Badge>
                      </button>
                    ))}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 rounded-lg border border-hairline/[0.08] bg-ink-900/80 px-2.5 h-9 text-xs text-ink-300">
            <Globe2 className="h-3.5 w-3.5 text-ink-400" />
            <span>US-West · PST</span>
          </div>
          <IconButton onClick={toggle} aria-label="Toggle theme" title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}>
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </IconButton>
          <div ref={bellRef} className="relative">
            <IconButton onClick={() => setBellOpen((o) => !o)} className={cn('relative', bellOpen && 'bg-overlay-1/5')}>
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5">
                <Badge tone="danger" className="h-4 min-w-4 justify-center px-1 text-[9px]">
                  {NOTIFICATIONS.length}
                </Badge>
              </span>
            </IconButton>
            <AnimatePresence>
              {bellOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-12 w-[340px] rounded-xl border border-hairline/[0.12] bg-ink-900 shadow-card backdrop-blur p-1"
                >
                  <div className="px-3 pt-2.5 pb-1 flex items-center justify-between">
                    <div className="text-[11px] uppercase tracking-wider text-ink-400 font-semibold">
                      Notifications
                    </div>
                    <button
                      onClick={() => {
                        setBellOpen(false);
                        show({ tone: 'success', title: 'All notifications marked as read' });
                      }}
                      className="text-[11px] text-brand-700 dark:text-brand-300 hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  {NOTIFICATIONS.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => goTo(n.path)}
                      className="w-full flex items-start gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-overlay-1/[0.04] transition-colors"
                    >
                      <span
                        className={cn(
                          'mt-1 h-2 w-2 rounded-full shrink-0',
                          n.tone === 'danger' && 'bg-rose-400',
                          n.tone === 'warning' && 'bg-amber-400',
                          n.tone === 'brand' && 'bg-brand-400',
                          n.tone === 'info' && 'bg-cyan-400',
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-ink-100 leading-snug">{n.title}</div>
                        <div className="mt-0.5 text-[11px] text-ink-400 mono">{n.time}</div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
