export const MOCK_PASSWORD = "Password123!";
export const MOCK_INVALID_PASSWORD = "simplepwd";
export const MOCK_DIFFERENT_PASSWORD = "Different123!";
export const MOCK_EMAIL = "john@example.com";
export const MOCK_EMAIL2 = "johndoe@example.com";
export const EMAIL_VAL_TEST_ID = "email-val";
export const PASSWORD_VAL_TEST_ID = "password-val";
export const STEP1_TEST_ID = "step-1";
export const STEP2_TEST_ID = "step-2";
export const STEP3_TEST_ID = "step-3";
export const MOCK_SHORT_PASSWORD = "short";
export const PASSWORD_LABEL = "Password";
export const CONFIRM_PASSWORD_LABEL = "Confirm Password";
export const MOCK_NETWORK_ERROR = "Network Error";
export const MOCK_VALIDATION_ERROR = "Invalid format";
export const PASSWORD_TYPE = "password";
export const TEXT_TYPE = "text";
export const MOCK_FIRST_NAME = "John";
export const MOCK_LAST_NAME = "Doe";
export const MOCK_ACCOUNT_STATUS = "ACTIVE";
export const MOCK_ORG_ID = "org-123";

export const memberFactory = (overrides = {}) => {
  return {
    firstName: MOCK_FIRST_NAME,
    lastName: MOCK_LAST_NAME,
    email: MOCK_EMAIL,
    passwordHash: MOCK_PASSWORD,
    profilePhotoS3Key: "photo-key",
    accountStatus: MOCK_ACCOUNT_STATUS,
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

export const mockInviteMember = {
  email: "john@test.com",
  role: "ORG_MEMBER",
} as const;

export const mockInvitePayload = {
  email: "john@test.com",
  orgMemberRole: "ORG_MEMBER",
  orgId: MOCK_ORG_ID,
} as const;
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

// ─── Admin Dashboard Page Test Data ────────────────────────────────────────

export const adminOrganizationFactory = (overrides = {}) => {
  return {
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
    addedAt: "2024-01-01",
    ...overrides,
  };
};

export const adminMemberFactory = (overrides = {}) => {
  return {
    id: "member-1",
    organizationId: "1",
    name: "Alex Doe",
    email: "alex@example.com",
    initials: "AD",
    role: "Member" as const,
    status: "Active" as const,
    joinedAt: "2024-01-02",
    updatedAt: "2024-01-03",
    ...overrides,
  };
};

export const adminOrganizationsFactory = (overrides = []) => {
  return [
    adminOrganizationFactory(),
    adminOrganizationFactory({
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
      addedAt: "2024-02-01",
    }),
    ...overrides,
  ];
};

export const adminMembersByOrganizationFactory = (overrides = {}) => {
  return {
    "1": [
      adminMemberFactory(),
      adminMemberFactory({
        id: "member-2",
        name: "Priya Kumar",
        email: "priya@example.com",
        initials: "PK",
        role: "Admin" as const,
        status: "Inactive" as const,
        joinedAt: "2024-02-02",
        updatedAt: "2024-02-03",
      }),
    ],
    "2": [
      adminMemberFactory({
        id: "member-3",
        organizationId: "2",
        name: "Morgan Lee",
        email: "morgan@example.com",
        initials: "ML",
        role: "Manager" as const,
        status: "Active" as const,
        joinedAt: "2024-03-02",
        updatedAt: "2024-03-03",
      }),
    ],
    ...overrides,
  };
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

