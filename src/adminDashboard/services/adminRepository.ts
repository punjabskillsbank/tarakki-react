import type { AdminDataSource } from '../types/admin';
import { members, organizations } from './mockData';

const wait = (milliseconds = 120) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });

export const adminRepository: AdminDataSource = {
  async listOrganizations() {
    await wait();
    return organizations;
  },

  async getOrganization(organizationId) {
    await wait();
    return organizations.find((organization) => organization.id === organizationId);
  },

  async listMembers(organizationId) {
    await wait();
    return members.filter((member) => member.organizationId === organizationId);
  }
};
