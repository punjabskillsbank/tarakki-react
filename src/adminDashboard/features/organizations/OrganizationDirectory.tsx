import { ArrowUpDown, Filter } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/SearchInput';
import type { Organization } from '../../types/admin';
import { OrganizationCard } from './OrganizationCard';

interface OrganizationDirectoryProps {
  organizations: Organization[];
  onOpenOrganization: (organizationId: string) => void;
}

export function OrganizationDirectory({ organizations, onOpenOrganization }: OrganizationDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSorted, setIsSorted] = useState(false);

  const filteredOrganizations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const nextOrganizations = term
      ? organizations.filter((organization) =>
          [organization.name, organization.description, organization.owner.name, organization.location.city]
            .join(' ')
            .toLowerCase()
            .includes(term)
        )
      : organizations;

    return isSorted
      ? [...nextOrganizations].sort((first, second) => first.name.localeCompare(second.name))
      : nextOrganizations;
  }, [isSorted, organizations, searchTerm]);

  return (
    <section className="list-panel">
      <div className="list-panel__toolbar">
        <SearchInput value={searchTerm} placeholder="Search organizations..." onChange={setSearchTerm} />
        <Button icon={<Filter size={17} />}>Filter</Button>
        <Button icon={<ArrowUpDown size={17} />} onClick={() => setIsSorted((value) => !value)}>
          Sort
        </Button>
      </div>

      <div className="organization-list">
        {filteredOrganizations.map((organization) => (
          <OrganizationCard key={organization.id} organization={organization} onOpen={onOpenOrganization} />
        ))}
      </div>
    </section>
  );
}
