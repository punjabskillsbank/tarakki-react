import { Bell, CircleHelp, Moon, Search } from 'lucide-react';
import { IconButton } from '../ui/IconButton';

export function Topbar() {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand__mark">T</span>
        <span className="brand__name">Tarakki Admin</span>
      </div>

      <div className="topbar__actions">
        <IconButton label="Search">
          <Search size={20} />
        </IconButton>
        <IconButton label="Notifications" className="icon-button--notify">
          <Bell size={20} />
        </IconButton>
        <IconButton label="Help">
          <CircleHelp size={19} />
        </IconButton>
        <IconButton label="Theme">
          <Moon size={19} />
        </IconButton>
        <span className="account-avatar" aria-label="Admin profile">
          AD
        </span>
      </div>
    </header>
  );
}
