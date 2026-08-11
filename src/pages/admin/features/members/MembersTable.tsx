import { Eye, Pencil } from 'lucide-react';
import type { Member } from '../../../../types/admin';

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
    <table className="min-w-[980px] border-separate border-spacing-0" aria-label="Organization members">
      <thead>
        <tr className="grid min-h-[46px] grid-cols-[2fr_1.9fr_1.2fr_1.25fr_1.5fr_1.5fr_1fr] items-center border-b border-[#e7ebf2] bg-[#fbfcfe] px-5 text-sm font-extrabold text-[#111827] max-[760px]:grid-cols-[180px_210px_110px_110px_140px_140px_90px]">
          <th scope="col" className="text-left">
            Member
          </th>
          <th scope="col" className="text-left">
            Email
          </th>
          <th scope="col" className="text-left">
            Role
          </th>
          <th scope="col" className="text-left">
            Status
          </th>
          <th scope="col" className="text-left">
            Joined
          </th>
          <th scope="col" className="text-left">
            Updated
          </th>
          <th scope="col" className="text-left">
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        {members.map((member) => (
          <tr
            key={member.id}
            className="grid min-h-14 grid-cols-[2fr_1.9fr_1.2fr_1.25fr_1.5fr_1.5fr_1fr] items-center border-b border-[#e7ebf2] px-5 last:border-b-0 max-[760px]:grid-cols-[180px_210px_110px_110px_140px_140px_90px]"
          >
            <td className="flex items-center gap-3 py-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#0f7bf2] text-sm font-extrabold text-white">
                {member.initials}
              </span>
              <strong className="text-sm text-[#374151]">{member.name}</strong>
            </td>
            <td className="text-sm text-[#374151]">{member.email}</td>
            <td className={`text-sm font-extrabold ${roleClassName[member.role]}`}>{member.role}</td>
            <td>
              <span
                className={`inline-flex h-6 min-w-16 items-center justify-center rounded-full px-[9px] text-xs font-extrabold ${
                  statusClassName[member.status]
                }`}
              >
                {member.status}
              </span>
            </td>
            <td className="text-sm text-[#374151]">{member.joinedAt}</td>
            <td className="text-sm text-[#374151]">{member.updatedAt}</td>
            <td className="inline-flex gap-2 py-3">
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
