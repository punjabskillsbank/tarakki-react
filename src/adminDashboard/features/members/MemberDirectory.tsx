import { Filter, Search } from 'lucide-react';
import { type ChangeEvent, useMemo, useState } from 'react';
import type { Member } from '../../types/admin';
import { MembersTable } from './MembersTable';

interface MemberDirectoryProps {
  members: Member[];
}

export function MemberDirectory({ members }: MemberDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return members;
    }

    return members.filter((member) =>
      [member.name, member.email, member.role, member.status].join(' ').toLowerCase().includes(term)
    );
  }, [members, searchTerm]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <section className="overflow-hidden rounded-lg border border-[#e7ebf2] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.08),0_1px_4px_rgba(15,23,42,0.04)] max-[1100px]:overflow-x-auto">
      <div className="flex min-h-[72px] items-center gap-3 border-b border-[#e7ebf2] px-5 max-[760px]:min-h-0 max-[760px]:flex-wrap max-[760px]:p-4">
        <label className="flex h-9 w-64 items-center gap-2.5 rounded-lg border border-[#dfe5ee] bg-white px-3.5 text-[#9aa3b2] max-[760px]:w-full">
          <Search aria-hidden="true" size={18} />
          <input
            className="min-w-0 flex-1 border-0 bg-transparent text-[#1f2937] outline-none placeholder:text-[#98a1af]"
            value={searchTerm}
            placeholder="Search members..."
            onChange={handleSearchChange}
          />
        </label>
        <button
          className="inline-flex h-9 min-w-[78px] items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[#dfe5ee] bg-white px-3.5 text-sm font-extrabold leading-none text-[#374151] hover:-translate-y-px"
          type="button"
        >
          <Filter size={17} />
          <span>Filter</span>
        </button>
      </div>

      <MembersTable members={filteredMembers} />
    </section>
  );
}
