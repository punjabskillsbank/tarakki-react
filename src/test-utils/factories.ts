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
