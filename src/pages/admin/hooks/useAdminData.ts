import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminOrganizationService } from '../../../services/AdminOrganizationService';
import type { AdminDataSource, Member, Organization } from '../../../types/admin';

interface AdminDataState {
  organizations: Organization[];
  membersByOrganization: Record<string, Member[]>;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  loadMembersForOrganization: (organizationId: string) => Promise<Member[]>;
}

export function useAdminData(dataSource: AdminDataSource = adminOrganizationService): AdminDataState {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [membersByOrganization, setMembersByOrganization] = useState<Record<string, Member[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMembersForOrganization = useCallback(
    async (organizationId: string) => {
      if (organizationId in membersByOrganization) {
        return membersByOrganization[organizationId];
      }

      try {
        const nextMembers = await dataSource.listMembers(organizationId);
        setMembersByOrganization((currentMembers) => ({
          ...currentMembers,
          [organizationId]: nextMembers,
        }));
        return nextMembers;
      } catch {
        setError('Unable to load organization members.');
        return [];
      }
    },
    [dataSource, membersByOrganization]
  );

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nextOrganizations = await dataSource.listOrganizations();
      setOrganizations(nextOrganizations);
    } catch {
      setError('Unable to load admin data.');
    } finally {
      setIsLoading(false);
    }
  }, [dataSource]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return useMemo(
    () => ({
      organizations,
      membersByOrganization,
      isLoading,
      error,
      refresh,
      loadMembersForOrganization
    }),
    [organizations, membersByOrganization, isLoading, error, refresh, loadMembersForOrganization]
  );
}
