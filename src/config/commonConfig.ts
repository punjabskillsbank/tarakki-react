const commonConfig = {
  baseURLs: {
    apiRoot: '/api',
  },
   routes: {
    onboarding: "/",
    organizationDecision: "/organization-decision",
    createOrganization: "/create-organization",
    createBoard: "/create-board/:orgId",
    createBoardWithOrgId: (orgId: string | number) => `/create-board/${orgId}`,
  },
  endpoints: {
    boards: "/boards",
    members: "/members",
    organizations: "/organizations",
    all_organizations: "/admin/organizations/",
  },
};

export default commonConfig;

