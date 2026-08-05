import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../../components/AppShell';
import type { NavigationItem } from '../../components/Sidebar';
import { MembersPage } from './features/members/MembersPage';
import { DashboardPage } from './features/organizations/DashboardPage';
import { OrganizationDetailPage } from './features/organizations/OrganizationDetailPage';
import { OrganizationListPage } from './features/organizations/OrganizationListPage';
import { useAdminData } from './hooks/useAdminData';

type OrganizationView = 'list' | 'detail' | 'members';

export function AdminDashboard() {
  const { organizations, membersByOrganization, isLoading, error } = useAdminData();
  const [activeItem, setActiveItem] = useState<NavigationItem>('dashboard');
  const [organizationView, setOrganizationView] = useState<OrganizationView>('list');
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>('acme-corporation');

  const selectedOrganization = useMemo(
    () =>
      organizations.find((organization) => organization.id === selectedOrganizationId) ??
      organizations[0],
    [organizations, selectedOrganizationId]
  );

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [activeItem, organizationView, selectedOrganizationId]);

  const handleNavigate = (item: NavigationItem) => {
    setActiveItem(item);
    if (item === 'organizations') {
      setOrganizationView('list');
    }
  };

  const openOrganization = (organizationId: string) => {
    setActiveItem('organizations');
    setSelectedOrganizationId(organizationId);
    setOrganizationView('detail');
  };

  const renderWorkspace = () => {
    if (isLoading) {
      return (
        <div className="grid min-h-[220px] place-items-center rounded-lg border border-[#e7ebf2] bg-white text-base font-bold text-[#6b7280] shadow-[0_1px_2px_rgba(15,23,42,0.08),0_1px_4px_rgba(15,23,42,0.04)]">
          Loading admin data...
        </div>
      );
    }

    if (error) {
      return (
        <div className="grid min-h-[220px] place-items-center rounded-lg border border-[#e7ebf2] bg-white text-base font-bold text-[#f15d75] shadow-[0_1px_2px_rgba(15,23,42,0.08),0_1px_4px_rgba(15,23,42,0.04)]">
          {error}
        </div>
      );
    }

    if (activeItem === 'dashboard') {
      return <DashboardPage organizations={organizations} membersByOrganization={membersByOrganization} />;
    }

    if (!selectedOrganization) {
      return (
        <div className="grid min-h-[220px] place-items-center rounded-lg border border-[#e7ebf2] bg-white text-base font-bold text-[#f15d75] shadow-[0_1px_2px_rgba(15,23,42,0.08),0_1px_4px_rgba(15,23,42,0.04)]">
          No organization selected.
        </div>
      );
    }

    if (organizationView === 'detail') {
      return (
        <OrganizationDetailPage
          organization={selectedOrganization}
          onBack={() => setOrganizationView('list')}
          onViewMembers={() => setOrganizationView('members')}
        />
      );
    }

    if (organizationView === 'members') {
      return (
        <MembersPage
          organization={selectedOrganization}
          members={membersByOrganization[selectedOrganization.id] ?? []}
          onBack={() => setOrganizationView('detail')}
        />
      );
    }

    return <OrganizationListPage organizations={organizations} onOpenOrganization={openOrganization} />;
  };

  return (
    <AppShell activeItem={activeItem} onNavigate={handleNavigate}>
      {renderWorkspace()}
    </AppShell>
  );
}
