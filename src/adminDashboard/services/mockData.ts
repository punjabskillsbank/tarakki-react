import type { Member, Organization } from '../types/admin';

export const organizations: Organization[] = [
  {
    id: 'acme-corporation',
    name: 'Acme Corporation',
    description: 'Leading enterprise software solutions provider',
    owner: {
      name: 'John Smith',
      email: 'john@acme.com',
      initials: 'JS'
    },
    address: '123 Business Park',
    location: {
      city: 'New York, NY',
      state: "NY",
      country: 'USA',
      postalCode: '10001'
    },
    memberCount: 24,
    addedAt: 'Jan 15, 2026'
  },
  {
    id: 'tech-innovations-ltd',
    name: 'Tech Innovations Ltd',
    description: 'AI and cloud transformation company',
    owner: {
      name: 'Sarah Johnson',
      email: 'sarah@techinnovations.io',
      initials: 'SJ'
    },
    address: '45 Silicon Avenue',
    location: {
      city: 'San Francisco, CA',
      state: "NY",
      country: 'USA'
    },
    memberCount: 12,
    addedAt: 'Feb 3, 2026'
  },
  {
    id: 'digital-solutions-inc',
    name: 'Digital Solutions Inc',
    description: 'Digital consulting and automation services',
    owner: {
      name: 'Mike Chen',
      email: 'mike@digitalsol.com',
      initials: 'MC'
    },
    address: '88 Innovation Street',
    location: {
      city: 'Seattle, WA',
      state: "NY",
      country: 'USA'
    },
    memberCount: 8,
    addedAt: 'Mar 6, 2026'
  }
];

export const members: Member[] = [
  {
    id: 'alice-cooper',
    organizationId: 'acme-corporation',
    name: 'Alice Cooper',
    email: 'alice@acme.com',
    initials: 'AC',
    role: 'Admin',
    status: 'Active',
    joinedAt: 'Jan 12, 2026',
    updatedAt: 'Apr 8, 2026'
  },
  {
    id: 'grace-taylor',
    organizationId: 'acme-corporation',
    name: 'Grace Taylor',
    email: 'grace@acme.com',
    initials: 'GT',
    role: 'Member',
    status: 'Active',
    joinedAt: 'Feb 5, 2026',
    updatedAt: 'Apr 10, 2026'
  },
  {
    id: 'john-smith',
    organizationId: 'acme-corporation',
    name: 'John Smith',
    email: 'john@acme.com',
    initials: 'JS',
    role: 'Manager',
    status: 'Inactive',
    joinedAt: 'Mar 8, 2026',
    updatedAt: 'Apr 11, 2026'
  },
  {
    id: 'sarah-johnson',
    organizationId: 'tech-innovations-ltd',
    name: 'Sarah Johnson',
    email: 'sarah@techinnovations.io',
    initials: 'SJ',
    role: 'Admin',
    status: 'Active',
    joinedAt: 'Feb 3, 2026',
    updatedAt: 'Apr 7, 2026'
  },
  {
    id: 'nina-patel',
    organizationId: 'tech-innovations-ltd',
    name: 'Nina Patel',
    email: 'nina@techinnovations.io',
    initials: 'NP',
    role: 'Member',
    status: 'Active',
    joinedAt: 'Feb 18, 2026',
    updatedAt: 'Apr 6, 2026'
  },
  {
    id: 'mike-chen',
    organizationId: 'digital-solutions-inc',
    name: 'Mike Chen',
    email: 'mike@digitalsol.com',
    initials: 'MC',
    role: 'Admin',
    status: 'Active',
    joinedAt: 'Mar 6, 2026',
    updatedAt: 'Apr 9, 2026'
  }
];
