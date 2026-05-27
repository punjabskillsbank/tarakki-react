import { Eye, Pencil } from 'lucide-react';
import type { Member } from '../../types/admin';

interface MembersTableProps {
  members: Member[];
}

const roleClassName = {
  Admin: 'text-[#f15d75]',
  Manager: 'text-[#0f7bf2]',
  Member: 'text-[#6d6480]'
};

const statusClassName = {
  Active: 'bg-[#17c979] text-white',
  Inactive: 'bg-[#d8dce1] text-[#374151]'
};

export function MembersTable({ members }: MembersTableProps) {
  return (
    <div className="min-w-[980px]" role="table" aria-label="Organization members">
      <div
        className="grid min-h-[46px] grid-cols-[2fr_1.9fr_1.2fr_1.25fr_1.5fr_1.5fr_1fr] items-center border-b border-[#e7ebf2] bg-[#fbfcfe] px-5 text-sm font-extrabold text-[#111827] max-[760px]:grid-cols-[180px_210px_110px_110px_140px_140px_90px]"
        role="row"
      >
        <span role="columnheader">Member</span>
        <span role="columnheader">Email</span>
        <span role="columnheader">Role</span>
        <span role="columnheader">Status</span>
        <span role="columnheader">Joined</span>
        <span role="columnheader">Updated</span>
        <span role="columnheader">Actions</span>
      </div>

      {members.map((member) => (
        <div
          className="grid min-h-14 grid-cols-[2fr_1.9fr_1.2fr_1.25fr_1.5fr_1.5fr_1fr] items-center border-b border-[#e7ebf2] px-5 last:border-b-0 max-[760px]:grid-cols-[180px_210px_110px_110px_140px_140px_90px]"
          role="row"
          key={member.id}
        >
          <div className="flex items-center gap-3" role="cell">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#0f7bf2] text-sm font-extrabold text-white">
              {member.initials}
            </span>
            <strong className="text-sm text-[#374151]">{member.name}</strong>
          </div>
          <span className="text-sm text-[#374151]" role="cell">
            {member.email}
          </span>
          <span className={`text-sm font-extrabold ${roleClassName[member.role]}`} role="cell">
            {member.role}
          </span>
          <span role="cell">
            <span
              className={`inline-flex h-6 min-w-16 items-center justify-center rounded-full px-[9px] text-xs font-extrabold ${
                statusClassName[member.status]
              }`}
            >
              {member.status}
            </span>
          </span>
          <span className="text-sm text-[#374151]" role="cell">
            {member.joinedAt}
          </span>
          <span className="text-sm text-[#374151]" role="cell">
            {member.updatedAt}
          </span>
          <span className="inline-flex gap-2" role="cell">
            <button
              className="relative grid size-[26px] place-items-center rounded-md border-0 bg-transparent p-0 text-[#58a0ff] hover:bg-[#e9f2ff] hover:text-[#0f7bf2]"
              type="button"
              aria-label={`View ${member.name}`}
              title={`View ${member.name}`}
            >
              <Eye size={16} />
            </button>
            <button
              className="relative grid size-[26px] place-items-center rounded-md border-0 bg-transparent p-0 text-[#f6a818] hover:bg-[#e9f2ff]"
              type="button"
              aria-label={`Edit ${member.name}`}
              title={`Edit ${member.name}`}
            >
              <Pencil size={16} />
            </button>
          </span>
        </div>
      ))}
    </div>
  );
}
