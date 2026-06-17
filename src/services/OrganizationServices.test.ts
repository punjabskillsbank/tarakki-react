import OrganizationService from "./OrganizationServices";
import API from "./axios";
import { isAxiosError } from "axios";
import {
  mockOrgPayload,
  mockOrgSuccessResponse,
} from "../test-utils/factories";
import config from "../config/indexConfig";

jest.mock("./axios");
jest.mock("axios", () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({ post: jest.fn() })),
  },
  isAxiosError: jest.fn(),
  create: jest.fn(() => ({ post: jest.fn() })),
}));

const mockedAPI = API as jest.Mocked<typeof API>;
const mockedIsAxiosError = isAxiosError as jest.MockedFunction<
  typeof isAxiosError
>;

describe("OrganizationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createOrganization", () => {
    it("successfully creates an organization", async () => {
      mockedAPI.post.mockResolvedValueOnce({ data: mockOrgSuccessResponse });

      const result = await OrganizationService.createOrganization(
        mockOrgPayload
      );

      expect(mockedAPI.post).toHaveBeenCalledWith(
        config.endpoints.organizations,
        mockOrgPayload
      );
      expect(result).toEqual(mockOrgSuccessResponse);
    });

    it("throws an error with message from axios response on failure", async () => {
      const errorMessage = "Organization already exists";
      mockedIsAxiosError.mockReturnValueOnce(true);
      mockedAPI.post.mockRejectedValueOnce({
        response: {
          data: { message: errorMessage },
        },
      });

      await expect(
        OrganizationService.createOrganization(mockOrgPayload)
      ).rejects.toThrow(errorMessage);
    });

    it("throws a default error message when axios response has no message", async () => {
      mockedIsAxiosError.mockReturnValueOnce(true);
      mockedAPI.post.mockRejectedValueOnce({
        response: {
          data: null,
        },
      });

      await expect(
        OrganizationService.createOrganization(mockOrgPayload)
      ).rejects.toThrow("Failed to create organization");
    });

    it("throws a default error message for non-axios errors", async () => {
      mockedIsAxiosError.mockReturnValueOnce(false);
      mockedAPI.post.mockRejectedValueOnce(new Error("Network Error"));

      await expect(
        OrganizationService.createOrganization(mockOrgPayload)
      ).rejects.toThrow("Failed to create organization");
    });
  });
});
