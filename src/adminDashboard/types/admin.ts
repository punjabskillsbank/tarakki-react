export type Role = 'Admin' | 'Manager' | 'Member';

export type MemberStatus = 'Active' | 'Inactive';

export interface Person {
  name: string;
  email: string;
  initials: string;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  owner: Person;
  address: string;
  location: {
    city: string;
    country: string;
    postalCode?: string;
  };
  memberCount: number;
  addedAt: string;
}

export interface Member extends Person {
  id: string;
  organizationId: string;
  role: Role;
  status: MemberStatus;
  joinedAt: string;
  updatedAt: string;
}

export interface AdminDataSource {
  listOrganizations: () => Promise<Organization[]>;
  getOrganization: (organizationId: string) => Promise<Organization | undefined>;
  listMembers: (organizationId: string) => Promise<Member[]>;
}
