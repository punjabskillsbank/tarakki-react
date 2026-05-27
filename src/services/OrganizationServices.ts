import API from "./axios";
import { isAxiosError } from "axios";

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

export default class OrganizationService {
  static async createOrganization(data: CreateOrganizationData) {
    try {
      const response = await API.post("/organizations", data);
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
}
