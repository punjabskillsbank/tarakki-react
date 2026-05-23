import type { AdminDataSource, Member, Organization } from '../types/admin';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api';

async function request<TResponse>(path: string): Promise<TResponse> {
  const response = await fetch(`${apiBaseUrl}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
}

export const apiAdminRepository: AdminDataSource = {
  listOrganizations() {
    return request<Organization[]>('/organizations');
  },

  getOrganization(organizationId) {
    return request<Organization>(`/organizations/${organizationId}`);
  },

  listMembers(organizationId) {
    return request<Member[]>(`/organizations/${organizationId}/members`);
  }
};
