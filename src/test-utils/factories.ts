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
