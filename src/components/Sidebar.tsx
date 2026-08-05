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
    <aside
      className="w-48 flex-[0_0_192px] border-r border-[#e7ebf2] bg-white max-[760px]:sticky max-[760px]:top-16 max-[760px]:z-10 max-[760px]:w-full max-[760px]:border-b max-[760px]:border-r-0"
      aria-label="Primary navigation"
    >
      <nav className="grid gap-2 px-3 py-[22px] max-[760px]:grid-cols-2 max-[760px]:px-3 max-[760px]:py-2.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              className={`flex h-[42px] items-center gap-3 rounded-lg border-0 border-l-[3px] px-3.5 text-left text-sm font-bold text-[#9aa3b2] hover:bg-[#e9f2ff] hover:text-[#0f7bf2] max-[760px]:h-10 max-[760px]:justify-center max-[760px]:px-2.5 max-[760px]:text-[13px] ${
                isActive ? 'border-l-[#0f7bf2] bg-[#e9f2ff] text-[#0f7bf2]' : 'border-l-transparent bg-transparent'
              }`}
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
