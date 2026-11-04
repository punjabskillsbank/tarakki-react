import { isAxiosError } from "axios";
import API from "./axios";
import SupportServices from "./SupportServices";
import config from "../config/indexConfig";

jest.mock("./axios");

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({ post: jest.fn(), get: jest.fn() })),
  },
  isAxiosError: jest.fn(),
  create: jest.fn(() => ({ post: jest.fn(), get: jest.fn() })),
}));

const mockedAPI = API as jest.Mocked<typeof API>;

const mockedIsAxiosError = isAxiosError as jest.MockedFunction<
  typeof isAxiosError
>;

const FAILED_TO_CREATE_SUPPORT_TICKET = "Failed to create support ticket";
const FAILED_TO_CREATE_SUPPORT_TICKET_MESSAGE =
  "Failed to create support ticket message";

const MOCK_SUPPORT_TICKET_ERROR = "Unable to create support ticket";
const MOCK_SUPPORT_MESSAGE_ERROR = "Unable to create support ticket message";
const MOCK_NETWORK_ERROR = "Network Error";

const mockTicketPayload = {
  memberId: "550e8400-e29b-41d4-a716-446655440000",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  subject: "Unable to log in",
  issueCategory: "ACCOUNT",
  issueType: "LOGIN_ISSUE",
  message: "I cannot log in to my account.",
};

const mockTicketMessagePayload = {
  ticketId: "ticket-123",
  userId: "550e8400-e29b-41d4-a716-446655440000",
  messageBody: "I cannot log in to my account.",
};

describe("SupportServices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createTicket", () => {
    it("creates a support ticket and returns the response data", async () => {
      const response = {
        ticketId: "ticket-123",
        subject: mockTicketPayload.subject,
        status: "OPEN",
      };

      mockedAPI.post.mockResolvedValueOnce({ data: response });

      await expect(
        SupportServices.createTicket(mockTicketPayload)
      ).resolves.toEqual(response);

      expect(mockedAPI.post).toHaveBeenCalledWith(
        config.endpoints.supportTickets,
        mockTicketPayload
      );
      expect(mockedAPI.post).toHaveBeenCalledTimes(1);
    });

    it("uses the API error message when ticket creation fails", async () => {
      mockedIsAxiosError.mockReturnValueOnce(true);

      mockedAPI.post.mockRejectedValueOnce({
        response: {
          data: { message: MOCK_SUPPORT_TICKET_ERROR },
        },
      });

      await expect(
        SupportServices.createTicket(mockTicketPayload)
      ).rejects.toThrow(MOCK_SUPPORT_TICKET_ERROR);
    });

    it("uses the API response string when the error data is a string", async () => {
      mockedIsAxiosError.mockReturnValueOnce(true);

      mockedAPI.post.mockRejectedValueOnce({
        response: {
          data: MOCK_SUPPORT_TICKET_ERROR,
        },
      });

      await expect(
        SupportServices.createTicket(mockTicketPayload)
      ).rejects.toThrow(MOCK_SUPPORT_TICKET_ERROR);
    });

    it("uses the default error message when the API provides no error message", async () => {
      mockedIsAxiosError.mockReturnValueOnce(true);

      mockedAPI.post.mockRejectedValueOnce({
        response: { data: null },
      });

      await expect(
        SupportServices.createTicket(mockTicketPayload)
      ).rejects.toThrow(FAILED_TO_CREATE_SUPPORT_TICKET);
    });

    it("uses the default error message when the Axios error has no response", async () => {
      mockedIsAxiosError.mockReturnValueOnce(true);

      mockedAPI.post.mockRejectedValueOnce({});

      await expect(
        SupportServices.createTicket(mockTicketPayload)
      ).rejects.toThrow(FAILED_TO_CREATE_SUPPORT_TICKET);
    });

    it("uses the default error message for non-Axios failures", async () => {
      mockedIsAxiosError.mockReturnValueOnce(false);

      mockedAPI.post.mockRejectedValueOnce(new Error(MOCK_NETWORK_ERROR));

      await expect(
        SupportServices.createTicket(mockTicketPayload)
      ).rejects.toThrow(FAILED_TO_CREATE_SUPPORT_TICKET);
    });
  });

  describe("createTicketMessage", () => {
    it("creates a support ticket message and returns the response data", async () => {
      const response = {
        messageId: "message-123",
        ticketId: mockTicketMessagePayload.ticketId,
        messageBody: mockTicketMessagePayload.messageBody,
      };

      mockedAPI.post.mockResolvedValueOnce({ data: response });

      await expect(
        SupportServices.createTicketMessage(mockTicketMessagePayload)
      ).resolves.toEqual(response);

      expect(mockedAPI.post).toHaveBeenCalledWith(
        config.endpoints.supportTicketMessages,
        mockTicketMessagePayload
      );
      expect(mockedAPI.post).toHaveBeenCalledTimes(1);
    });

    it("uses the API error message when message creation fails", async () => {
      mockedIsAxiosError.mockReturnValueOnce(true);

      mockedAPI.post.mockRejectedValueOnce({
        response: {
          data: { message: MOCK_SUPPORT_MESSAGE_ERROR },
        },
      });

      await expect(
        SupportServices.createTicketMessage(mockTicketMessagePayload)
      ).rejects.toThrow(MOCK_SUPPORT_MESSAGE_ERROR);
    });

    it("uses the API response string when the error data is a string", async () => {
      mockedIsAxiosError.mockReturnValueOnce(true);

      mockedAPI.post.mockRejectedValueOnce({
        response: {
          data: MOCK_SUPPORT_MESSAGE_ERROR,
        },
      });

      await expect(
        SupportServices.createTicketMessage(mockTicketMessagePayload)
      ).rejects.toThrow(MOCK_SUPPORT_MESSAGE_ERROR);
    });

    it("uses the default error message when the API provides no error message", async () => {
      mockedIsAxiosError.mockReturnValueOnce(true);

      mockedAPI.post.mockRejectedValueOnce({
        response: { data: null },
      });

      await expect(
        SupportServices.createTicketMessage(mockTicketMessagePayload)
      ).rejects.toThrow(FAILED_TO_CREATE_SUPPORT_TICKET_MESSAGE);
    });

    it("uses the default error message when the Axios error has no response", async () => {
      mockedIsAxiosError.mockReturnValueOnce(true);

      mockedAPI.post.mockRejectedValueOnce({});

      await expect(
        SupportServices.createTicketMessage(mockTicketMessagePayload)
      ).rejects.toThrow(FAILED_TO_CREATE_SUPPORT_TICKET_MESSAGE);
    });

    it("uses the default error message for non-Axios failures", async () => {
      mockedIsAxiosError.mockReturnValueOnce(false);

      mockedAPI.post.mockRejectedValueOnce(new Error(MOCK_NETWORK_ERROR));

      await expect(
        SupportServices.createTicketMessage(mockTicketMessagePayload)
      ).rejects.toThrow(FAILED_TO_CREATE_SUPPORT_TICKET_MESSAGE);
    });
  });
});
