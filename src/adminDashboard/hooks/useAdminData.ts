import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminRepository } from '../services/adminRepository';
import type { AdminDataSource, Member, Organization } from '../types/admin';

interface AdminDataState {
  organizations: Organization[];
  membersByOrganization: Record<string, Member[]>;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useAdminData(dataSource: AdminDataSource = adminRepository): AdminDataState {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [membersByOrganization, setMembersByOrganization] = useState<Record<string, Member[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nextOrganizations = await dataSource.listOrganizations();
      const memberEntries = await Promise.all(
        nextOrganizations.map(async (organization) => [
          organization.id,
          await dataSource.listMembers(organization.id)
        ] as const)
      );

      setOrganizations(nextOrganizations);
      setMembersByOrganization(Object.fromEntries(memberEntries));
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
      refresh
    }),
    [organizations, membersByOrganization, isLoading, error, refresh]
  );
}
