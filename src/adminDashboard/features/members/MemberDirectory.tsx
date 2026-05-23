import { Filter } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/SearchInput';
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

  return (
    <section className="table-panel">
      <div className="list-panel__toolbar">
        <SearchInput value={searchTerm} placeholder="Search members..." onChange={setSearchTerm} />
        <Button icon={<Filter size={17} />}>Filter</Button>
      </div>

      <MembersTable members={filteredMembers} />
    </section>
  );
}
