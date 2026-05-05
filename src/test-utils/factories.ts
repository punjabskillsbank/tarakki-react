export const memberFactory = (overrides = {}) => {
  return {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    profilePhotoS3Key: 'photo-key',
    accountStatus: 'ACTIVE',
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
