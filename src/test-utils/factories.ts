export const memberFactory = (overrides = {}) => {
  return {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    profilePhotoS3Key: "photo-key",
    accountStatus: "ACTIVE",
    ...overrides,
  };
};

export const boardPayloadFactory = (overrides = {}) => {
  return {
    orgId: 2,
    boardName: "New Board",
    boardDesc: "Description here",
    createdBy: "f9dbfe85-7f75-41d8-8c77-0d0dde8010c0",
    ...overrides,
  };
};

/*
export const onboardingDataFactory = (overrides = {}) => {
  return {
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    purpose: 'Work',
    role: 'Business owner',
    teamSize: '1-10',
    ...overrides,
  };
};
*/

// ─── Organization ─────────────────────────────────────────────────────────────
export const MOCK_MEMBER_ID = "550e8400-e29b-41d4-a716-446655440000";
export const STEP1_INPUT_PLACEHOLDER = "name@company.com";

export const mockOrgFormData = {
  orgName: "Test Organization",
  orgDesc: "A test organization description",
  orgAddress: "123 Main St",
  orgCity: "Test City",
  orgState: "Test State",
  orgPostalCode: "132001",
  orgCountry: "Test Country",
};

export const mockOrgPayload = {
  ...mockOrgFormData,
  ownerId: MOCK_MEMBER_ID,
};

export const mockOrgSuccessResponse = {
  orgId: "org-abc-123",
  orgName: mockOrgFormData.orgName,
};

export const mockOrgValidationError = {
  status: 400,
  response: {
    status: 400,
    data: {
      errors: { orgName: "Name already exists" },
      message: "Validation failed",
    },
  },
};


// ─── Admin Organization ───────────────────────────────────────────────────────

export const mockApiOrganizations = [
  {
    orgId: 1,
    orgName: "Acme Corporation",
    orgDesc: "Leading enterprise software solutions provider",
    owner: {
      firstName: "John",
      lastName: "Smith",
      email: "john@acme.com",
    },
    orgAddress: "123 Business Park",
    orgCity: "New York",
    orgState: "NY",
    orgPostalCode: "10001",
    orgCountry: "USA",
    totalMemberCount: 24,
  },
  {
    orgId: 2,
    orgName: "Tech Innovations Ltd",
    orgDesc: "AI and cloud transformation company",
    owner: {
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah@techinnovations.io",
    },
    orgAddress: "45 Silicon Avenue",
    orgCity: "San Francisco",
    orgState: "CA",
    orgPostalCode: "94105",
    orgCountry: "USA",
    totalMemberCount: 12,
  },
];


export const mockOrganizationWithoutOwner = {
  orgId: 3,
  orgName: "Test Org",
  orgDesc: "Testing",
  owner: null,
  orgAddress: "Test Address",
  orgCity: "Test City",
  orgState: "Punjab",
  orgPostalCode: "140001",
  orgCountry: "India",
  totalMemberCount: 5,
};

export const mockOrganizationWithoutMemberCount = {
  orgId: 4,
  orgName: "Demo Org",
  orgDesc: "Demo",
  owner: null,
  orgAddress: "Demo Address",
  orgCity: "Demo City",
  orgState: "Punjab",
  orgPostalCode: "140001",
  orgCountry: "India",
  totalMemberCount: undefined,
};

export const mockOpenAIOrganization = {
  orgId: 5,
  orgName: "OpenAI",
  orgDesc: "AI Research",
  owner: {
    firstName: "Sam",
    lastName: "Altman",
    email: "sam@openai.com",
  },
  orgAddress: "Address",
  orgCity: "San Francisco",
  orgState: "CA",
  orgPostalCode: "94107",
  orgCountry: "USA",
  totalMemberCount: 10,
};

export const mappedAcmeOrganization = {
  id: "1",
  name: "Acme Corporation",
  description: "Leading enterprise software solutions provider",
  owner: {
    name: "John Smith",
    email: "john@acme.com",
    initials: "JS",
  },
  address: "123 Business Park",
  location: {
    city: "New York",
    state: "NY",
    country: "USA",
    postalCode: "10001",
  },
  memberCount: 24,
  addedAt: "",
};

export const mappedTechOrganization = {
  id: "2",
  name: "Tech Innovations Ltd",
  description: "AI and cloud transformation company",
  owner: {
    name: "Sarah Johnson",
    email: "sarah@techinnovations.io",
    initials: "SJ",
  },
  address: "45 Silicon Avenue",
  location: {
    city: "San Francisco",
    state: "CA",
    country: "USA",
    postalCode: "94105",
  },
  memberCount: 12,
  addedAt: "",
};

// ─── Admin Dashboard Layout Test Data ───────────────────────────────────────

export const appShellPropsFactory = (overrides = {}) => {
  return {
    activeItem: 'dashboard' as const,
    children: 'Dashboard content',
    onNavigate: () => undefined,
    ...overrides,
  };
};

export const sidebarPropsFactory = (overrides = {}) => {
  return {
    activeItem: 'dashboard' as const,
    onNavigate: () => undefined,
    ...overrides,
  };
};

export const topbarPropsFactory = (overrides = {}) => {
  return {
    ...overrides,
  };
};

