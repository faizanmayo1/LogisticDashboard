import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-ink-950 text-ink-100">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <main className="flex-1 px-6 md:px-8 py-6 md:py-8">
          <div className="mx-auto max-w-[1440px] space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
