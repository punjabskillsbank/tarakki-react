import { useEffect, useMemo, useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import type { NavigationItem } from './components/layout/Sidebar';
import { MembersPage } from './features/members/MembersPage';
import { DashboardPage } from './features/organizations/DashboardPage';
import { OrganizationDetailPage } from './features/organizations/OrganizationDetailPage';
import { OrganizationListPage } from './features/organizations/OrganizationListPage';
import { useAdminData } from './hooks/useAdminData';
import './styles/adminDashboard.css';

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
      return <div className="state-panel">Loading admin data...</div>;
    }

    if (error) {
      return <div className="state-panel state-panel--error">{error}</div>;
    }

    if (activeItem === 'dashboard') {
      return <DashboardPage organizations={organizations} membersByOrganization={membersByOrganization} />;
    }

    if (!selectedOrganization) {
      return <div className="state-panel state-panel--error">No organization selected.</div>;
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
