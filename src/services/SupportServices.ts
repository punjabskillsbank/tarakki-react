import API from "./axios";
import { isAxiosError } from "axios";
import config from "../config/indexConfig";

export type SupportTicketData = {
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  issueCategory: string;
  issueType: string;
  message: string;
};

export default class SupportServices {
  static async createTicket(data: SupportTicketData) {
    try {
      const baseURL = config.baseURLs.apiRoot || "";

      const response = await API.post(
        `${baseURL}${config.endpoints.supportTickets}`,
        data
      );

      return response.data;
    } catch (error: unknown) {
      const message = isAxiosError(error)
        ? error.response?.data?.message ||
          error.response?.data ||
          "Failed to create support ticket"
        : "Failed to create support ticket";

      throw new Error(
        typeof message === "string"
          ? message
          : "Failed to create support ticket"
      );
    }
  }
}
