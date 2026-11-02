import API from "./axios";
import config from "../config/indexConfig";
import { getAxiosErrorMessage } from "../utils/errorUtils";

type CreateOrganizationData = {
  orgName: string;
  orgDesc: string;
  ownerId: string;
  orgAddress: string;
  orgCity: string;
  orgState: string;
  orgPostalCode: string;
  orgCountry: string;
};

type OrganizationMember = {
  orgId: string;
  email: string;
  orgMemberRole: "ORG_ADMIN" | "ORG_MEMBER" | "";
};

export type OrganizationMemberResponse = {
  orgMemberId: number;
  memberId: string;
  email: string;
};

export default class OrganizationService {
  static async createOrganization(data: CreateOrganizationData) {
    try {
      const baseURL = config.baseURLs.organizationService || "";
      const response = await API.post(
        `${baseURL}${config.endpoints.organizations}`,
        data
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(
        getAxiosErrorMessage(error, "Failed to create organization"),
      );
    }
  }
  static async inviteMember(orgId: string, data: OrganizationMember) {
    try {
      const response = await API.post(
        config.endpoints.organizationMember(orgId),
        data
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(
        getAxiosErrorMessage(error, "Failed to invite members"),
      );
    }
  }

  static async getOrganizationMembers(
    orgId: number,
  ): Promise<OrganizationMemberResponse[]> {
    try {
      const baseURL = config.baseURLs.organizationService || "";
      const response = await API.get<OrganizationMemberResponse[]>(
        `${baseURL}${config.endpoints.organizationMember(orgId)}`,
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(
        getAxiosErrorMessage(error, "Failed to fetch organization members"),
      );
    }
  }
}
