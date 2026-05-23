import { Building2, LayoutDashboard } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type NavigationItem = 'dashboard' | 'organizations';

interface SidebarProps {
  activeItem: NavigationItem;
  onNavigate: (item: NavigationItem) => void;
}

const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    id: 'organizations',
    label: 'Organizations',
    icon: Building2
  }
] satisfies Array<{
  id: NavigationItem;
  label: string;
  icon: LucideIcon;
}>;

export function Sidebar({ activeItem, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <nav className="sidebar__nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
              type="button"
              key={item.id}
              onClick={() => onNavigate(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
