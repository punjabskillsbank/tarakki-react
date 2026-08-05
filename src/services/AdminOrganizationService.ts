import API from "./axios";
import type { AdminDataSource, Member, Organization } from "../types/admin";
import commonConfig from "../config/commonConfig";

interface AdminOrganizationResponse {
  orgId: number;
  orgName: string;
  orgDesc: string;
  owner?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
  orgAddress: string;
  orgCity: string;
  orgState: string;
  orgPostalCode?: string;
  orgCountry: string;
  totalMemberCount: number;
  
}

interface OrgMemberResponse {
  orgId: number;
  memberId: string;
  email: string;
  memberAccountStatus: "ACCEPTED" | "REJECTED" | "PENDING";
  orgMemberRole: "ORG_ADMIN" | "ORG_MEMBER";
  createdAt?: string;
  updatedAt?: string;
}

const getInitials = (firstName = "", lastName = "") =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "NA";

const mapOrganization = (
  org: AdminOrganizationResponse
): Organization => {
  const firstName = org.owner?.firstName ?? "";
  const lastName = org.owner?.lastName ?? "";

  return {
    id: String(org.orgId),
    name: org.orgName,
    description: org.orgDesc,
    owner: {
      name: `${firstName} ${lastName}`.trim() || "Unknown Owner",
      email: org.owner?.email ?? "",
      initials: getInitials(firstName, lastName),
    },
    address: org.orgAddress,
    location: {
      city: org.orgCity,
      state:org.orgState,
      country: org.orgCountry,
      postalCode: org.orgPostalCode,
    },
    memberCount: org.totalMemberCount ?? 0,
    addedAt: "",
  };
};

const mapMember = (member: OrgMemberResponse): Member => ({
  id: member.memberId,
  organizationId: String(member.orgId),
  // The organization-members endpoint provides an email but not a profile name.
  name: member.email,
  email: member.email,
  initials: member.email.slice(0, 2).toUpperCase() || "NA",
  role: member.orgMemberRole === "ORG_ADMIN" ? "Admin" : "Member",
  status: member.memberAccountStatus === "ACCEPTED" ? "Active" : "Inactive",
  joinedAt: member.createdAt ?? "",
  updatedAt: member.updatedAt ?? "",
});

export const adminOrganizationService: AdminDataSource = {
  async listOrganizations() {
    const response = await API.get<AdminOrganizationResponse[]>(
  commonConfig.endpoints.all_organizations
);

    return response.data.map(mapOrganization);
  },
  
  
  async getOrganization(organizationId) {
    const response = await API.get<AdminOrganizationResponse>(
      `${commonConfig.endpoints.organizations}/${organizationId}`,
      { params: { memberId: localStorage.getItem("memberId") ?? "" } }
    );

    return mapOrganization(response.data);
  },

  async listMembers(organizationId) {
    const response = await API.get<OrgMemberResponse[]>(
      `${commonConfig.endpoints.organizations}/${organizationId}/members`
    );

    return response.data.map(mapMember);
  },
};


