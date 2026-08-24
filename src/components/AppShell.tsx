import type { ReactNode } from 'react';
import { Sidebar, type NavigationItem } from './Sidebar';
import { Topbar } from './Topbar';

interface AppShellProps {
  activeItem: NavigationItem;
  children: ReactNode;
  onNavigate: (item: NavigationItem) => void;
}

export function AppShell({ activeItem, children, onNavigate }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#f6f8fc] font-sans text-[#1f2937]">
      <Topbar />
      <div className="flex min-h-[calc(100vh-72px)] items-stretch max-[760px]:block max-[760px]:min-h-[calc(100vh-64px)]">
        <Sidebar activeItem={activeItem} onNavigate={onNavigate} />
        <main className="w-[min(100%,calc(100vw-192px))] px-6 pb-14 pt-[34px] pl-[26px] max-[760px]:w-full max-[760px]:px-4 max-[760px]:pb-10 max-[760px]:pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}
