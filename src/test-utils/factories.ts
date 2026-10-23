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
export const MOCK_ORGANIZATION_ERROR = "Organization already exists";
export const MOCK_INVITATION_ERROR = "Member already invited";
export const FAILED_TO_CREATE_ORGANIZATION = "Failed to create organization";
export const FAILED_TO_INVITE_MEMBERS = "Failed to invite members";
export const FAILED_TO_FETCH_ORGANIZATION_MEMBERS =
  "Failed to fetch organization members";
export const MOCK_VALIDATION_ERROR = "Invalid format";
export const PASSWORD_TYPE = "password";
export const TEXT_TYPE = "text";
export const MOCK_FIRST_NAME = "John";
export const MOCK_LAST_NAME = "Doe";
export const MOCK_ACCOUNT_STATUS = "ACTIVE";
export const MOCK_ORG_ID = "org-123";
export const MOCK_ORGANIZATION_ID = 123;

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

export const MOCK_BOARD_ID = 42;
export const MOCK_BOARD_ERROR = "Board name already exists";
export const FAILED_TO_CREATE_BOARD = "Failed to create board";
export const MOCK_GROUP_ERROR = "Group name already exists";
export const FAILED_TO_CREATE_GROUP = "Failed to create group";

export const boardResponseFactory = (overrides = {}) => ({
  ...boardPayloadFactory(),
  boardId: MOCK_BOARD_ID,
  ...overrides,
});

export const boardMemberPayloadFactory = (overrides = {}) => ({
  boardId: MOCK_BOARD_ID,
  memberId: MOCK_MEMBER_ID,
  ...overrides,
});

export const groupPayloadFactory = (overrides = {}) => ({
  boardId: MOCK_BOARD_ID,
  groupName: "Sprint Backlog",
  position: 0,
  createdBy: MOCK_MEMBER_ID,
  ...overrides,
});

export const groupResponseFactory = (overrides = {}) => ({
  ...groupPayloadFactory(),
  groupId: 3,
  createdAt: "2026-09-05T00:00:00Z",
  updatedAt: "2026-09-05T00:00:00Z",
  ...overrides,
});

export const MOCK_TASK_ID = 7;

export const taskResponseFactory = (overrides = {}) => ({
  taskId: MOCK_TASK_ID,
  boardId: MOCK_BOARD_ID,
  groupId: 3,
  title: "Write tests",
  position: 1,
  createdBy: MOCK_MEMBER_ID,
  createdAt: "2026-09-05T00:00:00Z",
  updatedAt: "2026-09-05T00:00:00Z",
  ...overrides,
});

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
export const MOCK_MEMBER_ID_2 = "550e8400-e29b-41d4-a716-446655440001";
export const MOCK_ORG_MEMBER_ID = 101;
export const MOCK_ORG_MEMBER_ID_2 = 102;
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

export const organizationMemberResponseFactory = (overrides = {}) => ({
  orgMemberId: MOCK_ORG_MEMBER_ID,
  memberId: MOCK_MEMBER_ID,
  email: MOCK_EMAIL,
  ...overrides,
});
export const organizationMembersResponseFactory = (overrides = []) => [
  organizationMemberResponseFactory(),
  ...overrides,
];

export const MOCK_ORG_MEMBER_ID_3 = 103;
export const MOCK_EMAIL3 = "member3@example.com";
export const MOCK_INVALID_BOARD_ID = "invalid-board-id";
export const MOCK_BOARD_MEMBER_NETWORK_ERROR = "network failure";
export const MOCK_ALREADY_TIMED_OUT_ERROR = "Already timed out";
export const MOCK_ALREADY_BOARD_MEMBER_ERROR = "Member is already a member of board";
export const MOCK_UNRELATED_CONFLICT_ERROR = "A different conflict occurred";

export const boardLoadErrorFactory = () => new Error("board failure");
export const organizationMembersLoadErrorFactory = () =>
  new Error("organization members failure");
export const boardMemberNetworkErrorFactory = () =>
  new Error(MOCK_BOARD_MEMBER_NETWORK_ERROR);
export const alreadyTimedOutErrorFactory = () =>
  new Error(MOCK_ALREADY_TIMED_OUT_ERROR);
export const alreadyAddedConflictErrorFactory = () => ({
  isAxiosError: true,
  response: { status: 409, data: MOCK_ALREADY_BOARD_MEMBER_ERROR },
});
export const unrelatedConflictErrorFactory = () => ({
  isAxiosError: true,
  response: { status: 409, data: MOCK_UNRELATED_CONFLICT_ERROR },
});

export const addBoardMembersSubmissionErrorCases = (): [string, unknown, string][] => [
  ["string rejection", "  Permission denied  ", "Permission denied"],
  [
    "response string",
    { isAxiosError: true, response: { data: "  Request failed  " } },
    "Request failed",
  ],
  [
    "response message",
    {
      isAxiosError: true,
      response: { data: { message: "  Access denied  " } },
    },
    "Access denied",
  ],
  [
    "validation error map",
    {
      isAxiosError: true,
      response: { data: { email: "Invalid email", role: "Role is required" } },
    },
    "Invalid email, Role is required",
  ],
  ["Error instance", new Error("Network unavailable"), "Network unavailable"],
  [
    "unknown reason",
    42,
    "Some members couldn't be added. Please try again.",
  ],
];

export const boardMemberFactory = (overrides = {}) => ({
  id: MOCK_MEMBER_ID,
  name: MOCK_EMAIL,
  initials: "JO",
  color: "#0073EA",
  ...overrides,
});

export const taskBoardSectionFactory = (overrides = {}) => ({
  id: "3",
  name: "SPRINT BACKLOG",
  color: "#0073EA",
  collapsed: false,
  position: 0,
  ...overrides,
});

export const taskBoardTaskFactory = (overrides = {}) => ({
  id: String(MOCK_TASK_ID),
  ticketNum: `T-${MOCK_TASK_ID}`,
  title: "Write tests",
  description: "Task description",
  assignee: null,
  dueDate: null,
  priority: "medium" as const,
  status: "open" as const,
  labels: [],
  comments: 0,
  attachments: 0,
  sectionId: "3",
  ...overrides,
});

// Task-board component test data
export const TASK_BOARD_RENAMED_SECTION_NAME = "RENAMED SECTION";
export const TASK_BOARD_SEARCH_QUERY = "query";
export const TASK_BOARD_ORGANIZATION_NAME = "Acme";
export const TASK_BOARD_NAME = "Product";
export const TASK_BOARD_GROUP_BY_CREATOR = "creator" as const;
export const TASK_BOARD_PRIORITY_HIGH = "high" as const;
export const TASK_BOARD_EMPTY_MEMBERS_MESSAGE =
  "No organization members are available.";
export const TASK_BOARD_CREATE_ISSUE_LABEL = "Create issue";
export const TASK_BOARD_CREATE_LABEL = "Create";
export const TASK_BOARD_SEARCH_PLACEHOLDER = "Search board";
export const TASK_BOARD_GROUP_BY_LABEL = "Group by";
export const TASK_BOARD_CREATED_BY_LABEL = "Created by";
export const TASK_BOARD_ADD_MEMBER_LABEL = "Add Member";
export const TASK_BOARD_ADD_SELECTED_MEMBER_LABEL = "Add Selected Member";
export const TASK_BOARD_EDIT_ACCESS_LABEL =
  "Allow this member to edit the board";
export const TASK_BOARD_WORKSPACE_LABEL = "Tarakki";
export const TASK_BOARD_RENAME_LABEL = "Rename";
export const TASK_BOARD_DELETE_GROUP_LABEL = "Delete group";
export const TASK_BOARD_PRIORITY_LABEL = "Priority";
export const TASK_BOARD_FILTER_LABEL = "Filter";
export const TASK_BOARD_HIGH_PRIORITY_LABEL = "High";
export const TASK_BOARD_ACTION_MENU_BUTTON_INDEX = 2;
export const TASK_BOARD_COLLAPSE_BUTTON_INDEX = 1;
export const addMemberModalSubmissionErrorFactory = () => new Error();

// Board page test data
export const CREATE_BOARD_HEADING = "Create Board";
export const CREATE_BOARD_NAME_LABEL = "Board Name";
export const CREATE_BOARD_DESCRIPTION_LABEL = "Board Description";
export const CREATE_BOARD_NAME_REQUIRED_ERROR = "Board name is required";
export const CREATE_BOARD_DESCRIPTION_REQUIRED_ERROR = "Board description is required";
export const CREATE_BOARD_SUCCESS_MESSAGE = "Board created successfully!";
export const CREATE_BOARD_FAILURE_MESSAGE = "Board couldn't be created. Please try again.";
export const CREATE_BOARD_ORGANIZATION_MISSING_MESSAGE = "Organization ID not found.";
export const CREATE_BOARD_NAME_CHARACTER_COUNT = "0 / 100";
export const CREATE_BOARD_DESCRIPTION_CHARACTER_COUNT = "0 / 500";
export const CREATE_BOARD_NAME_MAX_LENGTH = "100";
export const CREATE_BOARD_DESCRIPTION_MAX_LENGTH = "500";
export const createBoardApiErrorFactory = () => new Error("API Error");

export const BOARD_INFORMATION_MISSING_MESSAGE = "Board information is missing.";
export const BOARD_MEMBERS_LOADING_LABEL = "Loading members...";
export const BOARD_MEMBERS_HEADING = "Organization members";
export const BOARD_MEMBERS_NONE_AVAILABLE_MESSAGE =
  "No organization members are available yet.";
export const BOARD_MEMBERS_NO_ORGANIZATION_MEMBERS_MESSAGE =
  "This organization has no members yet.";
export const BOARD_MEMBERS_ALL_ADDED_MESSAGE =
  "All organization members have already been added to this board.";
export const BOARD_MEMBERS_LOAD_FAILURE_MESSAGE =
  "Members couldn't be loaded. Please try again.";
export const BOARD_MEMBERS_LOAD_ALERT_MESSAGE =
  "Unable to load organization members.";
export const BOARD_MEMBERS_SKIP_LABEL = "Skip for now";
export const BOARD_MEMBERS_SUBMIT_LABEL = "Add Members";
export const BOARD_MEMBERS_EDIT_ACCESS_LABEL = "Added members can edit this board";
export const BOARD_MEMBERS_RETRY_LABEL = "Try again";
export const BOARD_MEMBERS_SUCCESS_MESSAGE = "Board members added successfully!";
export const BOARD_MEMBER_ARIA_PRESSED_ATTRIBUTE = "aria-pressed";
export const BOARD_MEMBER_SELECTED_VALUE = "true";
export const BOARD_MEMBER_UNSELECTED_VALUE = "false";
export const boardSelectedCountLabel = (count: number) => `${count} selected`;
export const boardMembersAddedCountMessage = (count: number) =>
  `${count} member(s) added successfully.`;
export const boardRouteFactory = (boardId: string | number) => `/task-board/${boardId}`;
export const addBoardMembersRouteFactory = (boardId: string | number) =>
  `/add-board-members/${boardId}`;
export const caseInsensitiveRegexFactory = (value: string) => new RegExp(value, "i");
export const boardMemberAccessFactory = (email: string, canEdit = false) => ({
  email,
  canEdit,
  canView: true,
});
export const boardMemberResponseFactory = (overrides = {}) => ({
  boardMemberId: 1,
  boardId: MOCK_BOARD_ID,
  memberId: MOCK_MEMBER_ID,
  role: "BOARD_ADMIN",
  canEdit: true,
  canView: true,
  ...overrides,
});
export const boardMembersResponseFactory = (overrides = []) => [
  boardMemberResponseFactory(),
  ...overrides,
];
export const axiosErrorResponseFactory = (message?: string) => ({
  response: { data: message ? { message } : null },
});

export const TASK_BOARD_EMPTY_MESSAGE = "This board has no groups yet";
export const TASK_BOARD_CREATE_FIRST_GROUP_LABEL = "Create first group";
export const TASK_BOARD_GROUP_NAME_PLACEHOLDER = "Group name...";
export const TASK_BOARD_ADD_GROUP_LABEL = "Add";
export const TASK_BOARD_NO_PRIORITY_LABEL = "No priority";
export const TASK_BOARD_TASK_LOAD_FAILURE_MESSAGE =
  "Tasks couldn't be loaded. Please try again.";

export const taskBoardToolbarDataFactory = (overrides = {}) => ({
  members: [boardMemberFactory()],
  search: "",
  assigneeFilter: null,
  priorityFilter: null,
  groupBy: "none" as const,
  ...overrides,
});

export const taskBoardHeaderDataFactory = (overrides = {}) => ({
  members: [boardMemberFactory()],
  orgName: TASK_BOARD_ORGANIZATION_NAME,
  boardName: TASK_BOARD_NAME,
  ...overrides,
});

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

export const ORGANIZATIONS_PAGE_SUMMARY = "Manage all organizations";
export const TOTAL_ORGANIZATIONS_LABEL = "Total Organizations";
export const OPEN_ORGANIZATION_LABEL_PREFIX = "Open ";

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
