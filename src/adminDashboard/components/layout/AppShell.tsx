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
    <div className="app-shell">
      <Topbar />
      <div className="app-shell__body">
        <Sidebar activeItem={activeItem} onNavigate={onNavigate} />
        <main className="workspace">{children}</main>
      </div>
    </div>
  );
}
