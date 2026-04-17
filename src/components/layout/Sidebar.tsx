import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, HelpCircle, LogOut, Settings, UserCircle2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { BRAND, GROUPS, NAV } from '@/config/nav';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/Toast';

export function Sidebar() {
  const { user, signOut } = useAuth();
  const { show } = useToast();
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  const handleSignOut = () => {
    signOut();
    show({ tone: 'info', title: 'Signed out', body: 'See you next shift.' });
    nav('/signin', { replace: true });
  };

  return (
    <aside className="sticky top-0 h-screen w-[260px] shrink-0 border-r border-hairline/[0.08] bg-ink-950/80 backdrop-blur-xl flex flex-col">
      <div className="flex h-16 items-center gap-3 px-5 border-b border-hairline/[0.08]">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 text-white shadow-glow">
          {BRAND.logo}
          <div className="absolute inset-0 rounded-xl ring-1 ring-overlay-1/20" />
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight text-ink-100">{BRAND.name}</div>
          <div className="text-[11px] text-ink-400">{BRAND.tagline}</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {GROUPS.map((group) => (
          <div key={group} className="mb-5">
            <div className="px-3 mb-1.5 text-[10px] uppercase tracking-[0.18em] font-semibold text-ink-400">
              {group}
            </div>
            <ul className="space-y-0.5">
              {NAV.filter((n) => n.group === group).map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      cn(
                        'group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                        isActive
                          ? 'bg-overlay-1/[0.06] text-ink-100'
                          : 'text-ink-300 hover:bg-overlay-1/[0.04] hover:text-ink-100',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.span
                            layoutId="sidebar-indicator"
                            className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-gradient-to-b from-brand-400 to-violet-400"
                            transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                          />
                        )}
                        <span
                          className={cn(
                            'transition-colors',
                            isActive ? 'text-brand-700 dark:text-brand-300' : 'text-ink-400 group-hover:text-ink-200',
                          )}
                        >
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <Badge
                            tone={item.badge.tone === 'danger' ? 'danger' : item.badge.tone === 'warning' ? 'warning' : item.badge.tone === 'success' ? 'success' : 'brand'}
                            className="ml-auto"
                          >
                            {item.badge.text}
                          </Badge>
                        )}
                        {!item.badge && isActive && (
                          <ChevronRight className="ml-auto h-3.5 w-3.5 text-ink-400" />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-hairline/[0.08] p-3 space-y-1">
        <button className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-300 hover:bg-overlay-1/[0.04] hover:text-ink-100 transition-colors">
          <HelpCircle className="h-4 w-4 text-ink-400" />
          Help & changelog
        </button>
        <button className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-300 hover:bg-overlay-1/[0.04] hover:text-ink-100 transition-colors">
          <Settings className="h-4 w-4 text-ink-400" />
          Settings
        </button>

        <div ref={menuRef} className="relative mt-3">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className={cn(
              'w-full flex items-center gap-3 rounded-xl border border-hairline/[0.08] bg-overlay-1/[0.03] p-3 text-left transition-colors hover:bg-overlay-1/[0.06] focus-ring',
              menuOpen && 'bg-overlay-1/[0.06]',
            )}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-brand-500 text-sm font-semibold text-white">
              {user?.initials ?? 'GU'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-ink-100">{user?.name ?? 'Guest'}</div>
              <div className="truncate text-[11px] text-ink-400">
                {user?.role && user?.company
                  ? `${user.role} · ${user.company}`
                  : user?.email ?? 'Not signed in'}
              </div>
            </div>
            <ChevronRight
              className={cn(
                'h-3.5 w-3.5 text-ink-400 transition-transform',
                menuOpen && 'rotate-90',
              )}
            />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.12 }}
                className="absolute bottom-[calc(100%+6px)] left-0 right-0 rounded-xl border border-hairline/[0.12] bg-ink-900 shadow-card backdrop-blur p-1"
              >
                <button
                  onClick={() => { setMenuOpen(false); show({ tone: 'info', title: 'Profile · coming soon' }); }}
                  className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-ink-200 hover:bg-overlay-1/[0.04] transition-colors"
                >
                  <UserCircle2 className="h-3.5 w-3.5 text-ink-400" />
                  Profile
                </button>
                <button
                  onClick={() => { setMenuOpen(false); show({ tone: 'info', title: 'Workspace settings · coming soon' }); }}
                  className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-ink-200 hover:bg-overlay-1/[0.04] transition-colors"
                >
                  <Settings className="h-3.5 w-3.5 text-ink-400" />
                  Workspace settings
                </button>
                <div className="my-1 h-px bg-hairline/[0.08]" />
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-rose-700 dark:text-rose-300 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
}
