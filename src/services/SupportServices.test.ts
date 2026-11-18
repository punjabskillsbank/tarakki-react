import { isAxiosError } from "axios";
import API from "./axios";
import SupportServices from "./SupportServices";
import config from "../config/indexConfig";
import {
  FAILED_TO_CREATE_SUPPORT_TICKET,
  FAILED_TO_CREATE_SUPPORT_TICKET_MESSAGE,
  FAILED_TO_FETCH_SUPPORT_TICKETS,
  MOCK_NETWORK_ERROR,
  MOCK_SUPPORT_MESSAGE_ERROR,
  MOCK_SUPPORT_TICKET_ERROR,
  MOCK_SUPPORT_TICKETS_ERROR,
  MOCK_MEMBER_ID,
  mockTicketPayload,
  mockTicketMessagePayload,
  mockTickets,
} from "../test-utils/factories";

jest.mock("./axios");

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({
      post: jest.fn(),
      get: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    })),
  },
  isAxiosError: jest.fn(),
  create: jest.fn(() => ({
    post: jest.fn(),
    get: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  })),
}));

const mockedAPI = API as jest.Mocked<typeof API>;

const mockedIsAxiosError = isAxiosError as jest.MockedFunction<
  typeof isAxiosError
>;

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

  describe("getMemberSupportTickets", () => {
    it("fetches member support tickets and returns the response data", async () => {
      mockedAPI.get.mockResolvedValueOnce({ data: mockTickets });

      await expect(
        SupportServices.getMemberSupportTickets(MOCK_MEMBER_ID)
      ).resolves.toEqual(mockTickets);

      expect(mockedAPI.get).toHaveBeenCalledWith(
        config.endpoints.memberSupportTickets(MOCK_MEMBER_ID)
      );

      expect(mockedAPI.get).toHaveBeenCalledTimes(1);
    });

    it("returns an empty array when the member has no support tickets", async () => {
      mockedAPI.get.mockResolvedValueOnce({ data: [] });

      await expect(
        SupportServices.getMemberSupportTickets(MOCK_MEMBER_ID)
      ).resolves.toEqual([]);

      expect(mockedAPI.get).toHaveBeenCalledWith(
        config.endpoints.memberSupportTickets(MOCK_MEMBER_ID)
      );
    });

    it("uses the API error message when fetching tickets fails", async () => {
      mockedIsAxiosError.mockReturnValueOnce(true);

      mockedAPI.get.mockRejectedValueOnce({
        response: {
          data: { message: MOCK_SUPPORT_TICKETS_ERROR },
        },
      });

      await expect(
        SupportServices.getMemberSupportTickets(MOCK_MEMBER_ID)
      ).rejects.toThrow(MOCK_SUPPORT_TICKETS_ERROR);
    });

    it("uses the API response string when the error data is a string", async () => {
      mockedIsAxiosError.mockReturnValueOnce(true);

      mockedAPI.get.mockRejectedValueOnce({
        response: {
          data: MOCK_SUPPORT_TICKETS_ERROR,
        },
      });

      await expect(
        SupportServices.getMemberSupportTickets(MOCK_MEMBER_ID)
      ).rejects.toThrow(MOCK_SUPPORT_TICKETS_ERROR);
    });

    it("uses the default error message when the API provides no error message", async () => {
      mockedIsAxiosError.mockReturnValueOnce(true);

      mockedAPI.get.mockRejectedValueOnce({
        response: { data: null },
      });

      await expect(
        SupportServices.getMemberSupportTickets(MOCK_MEMBER_ID)
      ).rejects.toThrow(FAILED_TO_FETCH_SUPPORT_TICKETS);
    });

    it("uses the default error message when the Axios error has no response", async () => {
      mockedIsAxiosError.mockReturnValueOnce(true);

      mockedAPI.get.mockRejectedValueOnce({});

      await expect(
        SupportServices.getMemberSupportTickets(MOCK_MEMBER_ID)
      ).rejects.toThrow(FAILED_TO_FETCH_SUPPORT_TICKETS);
    });

    it("uses the default error message for non-Axios failures", async () => {
      mockedIsAxiosError.mockReturnValueOnce(false);

      mockedAPI.get.mockRejectedValueOnce(new Error(MOCK_NETWORK_ERROR));

      await expect(
        SupportServices.getMemberSupportTickets(MOCK_MEMBER_ID)
      ).rejects.toThrow(FAILED_TO_FETCH_SUPPORT_TICKETS);
    });
  });
});
