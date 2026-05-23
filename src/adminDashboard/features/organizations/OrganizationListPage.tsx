import { PageHeader } from '../../components/ui/PageHeader';
import type { Organization } from '../../types/admin';
import { OrganizationDirectory } from './OrganizationDirectory';

interface OrganizationListPageProps {
  organizations: Organization[];
  onOpenOrganization: (organizationId: string) => void;
}

export function OrganizationListPage({ organizations, onOpenOrganization }: OrganizationListPageProps) {
  return (
    <section className="page-stack">
      <PageHeader title="Organizations" subtitle="Manage all organizations" />

      <section className="metric-strip" aria-label="Organization summary">
        <div className="metric-card">
          <span>Total Organizations</span>
          <strong>{organizations.length}</strong>
        </div>
      </section>

      <OrganizationDirectory organizations={organizations} onOpenOrganization={onOpenOrganization} />
    </section>
  );
}
