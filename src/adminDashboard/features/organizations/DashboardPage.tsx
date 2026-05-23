import { Building2, Users } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import type { Member, Organization } from '../../types/admin';

interface DashboardPageProps {
  organizations: Organization[];
  membersByOrganization: Record<string, Member[]>;
}

export function DashboardPage({ organizations, membersByOrganization }: DashboardPageProps) {
  const activeMembers = Object.values(membersByOrganization)
    .flat()
    .filter((member) => member.status === 'Active').length;
  const totalMembers = organizations.reduce((total, organization) => total + organization.memberCount, 0);

  return (
    <section className="page-stack">
      <PageHeader title="Dashboard" subtitle="Overview of organization activity" />
      <section className="dashboard-grid">
        <div className="dashboard-stat">
          <Building2 size={24} />
          <span>Total Organizations</span>
          <strong>{organizations.length}</strong>
        </div>
        <div className="dashboard-stat">
          <Users size={24} />
          <span>Total Members</span>
          <strong>{totalMembers}</strong>
        </div>
        <div className="dashboard-stat">
          <Users size={24} />
          <span>Active Members</span>
          <strong>{activeMembers}</strong>
        </div>
      </section>
    </section>
  );
}
