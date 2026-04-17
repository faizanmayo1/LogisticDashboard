import { useEffect, useState } from 'react';

const KEY = 'meridian.session';

export interface User {
  name: string;
  email: string;
  company?: string;
  role?: string;
  initials: string;
}

interface Session {
  user: User;
  signedInAt: number;
}

const DEMO_USER: User = {
  name: 'Ava Rahman',
  email: 'ava.rahman@halcyon-retail.com',
  company: 'Halcyon Retail Group',
  role: 'VP Operations',
  initials: 'AR',
};

function read(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

function write(s: Session | null) {
  if (typeof window === 'undefined') return;
  if (s) localStorage.setItem(KEY, JSON.stringify(s));
  else localStorage.removeItem(KEY);
}

function makeInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

// Lightweight pub-sub so multiple components stay in sync without context.
const listeners = new Set<() => void>();
function emit() {
  for (const fn of listeners) fn();
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(read);

  useEffect(() => {
    const fn = () => setSession(read());
    listeners.add(fn);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) fn();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(fn);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const signIn = (email: string) => {
    const user: User = email.toLowerCase() === DEMO_USER.email.toLowerCase()
      ? DEMO_USER
      : {
          name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          email,
          initials: makeInitials(email.split('@')[0].replace(/[._-]/g, ' ')),
        };
    const s: Session = { user, signedInAt: Date.now() };
    write(s);
    setSession(s);
    emit();
  };

  const signUp = (input: { name: string; email: string; company?: string; role?: string }) => {
    const user: User = {
      name: input.name.trim() || input.email.split('@')[0],
      email: input.email,
      company: input.company,
      role: input.role,
      initials: makeInitials(input.name || input.email.split('@')[0]),
    };
    const s: Session = { user, signedInAt: Date.now() };
    write(s);
    setSession(s);
    emit();
  };

  const continueAsDemo = () => {
    const s: Session = { user: DEMO_USER, signedInAt: Date.now() };
    write(s);
    setSession(s);
    emit();
  };

  const signOut = () => {
    write(null);
    setSession(null);
    emit();
  };

  return {
    user: session?.user ?? null,
    isAuthenticated: !!session,
    signIn,
    signUp,
    signOut,
    continueAsDemo,
    DEMO_EMAIL: DEMO_USER.email,
  };
}
