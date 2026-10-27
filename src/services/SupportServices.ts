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
export type SupportTicketMessageData = {
  ticketId: string;
  userId: string;
  messageBody: string;
};

export default class SupportServices {
  static async createTicket(data: SupportTicketData) {
    try {
      const response = await API.post(config.endpoints.supportTickets, data);

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
  static async createTicketMessage(data: SupportTicketMessageData) {
    try {
      const response = await API.post(
        config.endpoints.supportTicketMessages,
        data
      );

      return response.data;
    } catch (error: unknown) {
      const message = isAxiosError(error)
        ? error.response?.data?.message ||
          error.response?.data ||
          "Failed to create support ticket message"
        : "Failed to create support ticket message";

      throw new Error(
        typeof message === "string"
          ? message
          : "Failed to create support ticket message"
      );
    }
  }
}
