import API from "../../services/axios";
import type { AdminDataSource, Organization } from "../types/admin";

const members: any[] = [];

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

export const adminRepository: AdminDataSource = {
  async listOrganizations() {
    const response = await API.get<AdminOrganizationResponse[]>(
      "/admin/organizations/"
    );

    return response.data.map(mapOrganization);
  },

  async getOrganization(organizationId) {
    const organizations = await this.listOrganizations();

    return organizations.find(
      (organization) => organization.id === organizationId
    );
  },

  async listMembers(organizationId) {
    return members.filter(
      (member) => member.organizationId === organizationId
    );
  },
};
