import { Eye, Pencil } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { IconButton } from '../../components/ui/IconButton';
import { StatusBadge } from '../../components/ui/StatusBadge';
import type { Member } from '../../types/admin';

interface MembersTableProps {
  members: Member[];
}

const roleClassName = {
  Admin: 'role role--admin',
  Manager: 'role role--manager',
  Member: 'role role--member'
};

export function MembersTable({ members }: MembersTableProps) {
  return (
    <div className="members-table" role="table" aria-label="Organization members">
      <div className="members-table__row members-table__row--head" role="row">
        <span role="columnheader">Member</span>
        <span role="columnheader">Email</span>
        <span role="columnheader">Role</span>
        <span role="columnheader">Status</span>
        <span role="columnheader">Joined</span>
        <span role="columnheader">Updated</span>
        <span role="columnheader">Actions</span>
      </div>

      {members.map((member) => (
        <div className="members-table__row" role="row" key={member.id}>
          <div className="member-cell" role="cell">
            <Avatar initials={member.initials} />
            <strong>{member.name}</strong>
          </div>
          <span role="cell">{member.email}</span>
          <span className={roleClassName[member.role]} role="cell">
            {member.role}
          </span>
          <span role="cell">
            <StatusBadge status={member.status} />
          </span>
          <span role="cell">{member.joinedAt}</span>
          <span role="cell">{member.updatedAt}</span>
          <span className="row-actions" role="cell">
            <IconButton label={`View ${member.name}`}>
              <Eye size={16} />
            </IconButton>
            <IconButton label={`Edit ${member.name}`} className="icon-button--warning">
              <Pencil size={16} />
            </IconButton>
          </span>
        </div>
      ))}
    </div>
  );
}
