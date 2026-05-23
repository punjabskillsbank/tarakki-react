import type { MemberStatus } from '../../types/admin';

interface StatusBadgeProps {
  status: MemberStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`status-badge status-badge--${status.toLowerCase()}`}>{status}</span>;
}
