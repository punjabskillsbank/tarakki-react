import API from "./axios";
import { isAxiosError } from "axios";
import config from "../config/indexConfig";

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

export default class OrganizationService {
  static async createOrganization(data: CreateOrganizationData) {
    try {
      const response = await API.post(config.endpoints.organizations, data);
      return response.data;
    } catch (error: unknown) {
      const message = isAxiosError(error)
        ? error.response?.data?.message ||
          error.response?.data ||
          "Failed to create organization"
        : "Failed to create organization";
      throw new Error(
        typeof message === "string" ? message : "Failed to create organization"
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
      const message = isAxiosError(error)
        ? error.response?.data?.message ||
          error.response?.data ||
          "Failed to invite members"
        : "Failed to invite members";
      throw new Error(
        typeof message === "string" ? message : "Failed to invite members"
      );
    }
  }
}
