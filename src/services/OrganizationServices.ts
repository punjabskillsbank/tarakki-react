import API from "./axios";
import { isAxiosError } from "axios";

type CreateOrganisationData = {
  orgName: string;
  orgDesc: string;
  ownerId: string;
  orgAddress: string;
  orgCity: string;
  orgState: string;
  orgPostalCode: string;
  orgCountry: string;
};

export default class OrganisationService {
  static async createOrganisation(data: CreateOrganisationData) {
    try {
      const response = await API.post("/organizations", data);
      return response.data;
    } catch (error: unknown) {
      const message = isAxiosError(error)
        ? error.response?.data?.message ||
          error.response?.data ||
          "Failed to create organisation"
        : "Failed to create organisation";
      throw new Error(
        typeof message === "string" ? message : "Failed to create organisation"
      );
    }
  }
}
