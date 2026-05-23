import OrganisationService from "./OrganizationServices";
import API from "./axios";
import { isAxiosError } from "axios";
import {
  mockOrgPayload,
  mockOrgSuccessResponse,
} from "../test-utils/factories";

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

describe("OrganisationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createOrganisation", () => {
    it("successfully creates an organisation", async () => {
      mockedAPI.post.mockResolvedValueOnce({ data: mockOrgSuccessResponse });

      const result = await OrganisationService.createOrganisation(
        mockOrgPayload
      );

      expect(mockedAPI.post).toHaveBeenCalledWith(
        "/organizations",
        mockOrgPayload
      );
      expect(result).toEqual(mockOrgSuccessResponse);
    });

    it("throws an error with message from axios response on failure", async () => {
      const errorMessage = "Organisation already exists";
      mockedIsAxiosError.mockReturnValueOnce(true);
      mockedAPI.post.mockRejectedValueOnce({
        response: {
          data: { message: errorMessage },
        },
      });

      await expect(
        OrganisationService.createOrganisation(mockOrgPayload)
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
        OrganisationService.createOrganisation(mockOrgPayload)
      ).rejects.toThrow("Failed to create organisation");
    });

    it("throws a default error message for non-axios errors", async () => {
      mockedIsAxiosError.mockReturnValueOnce(false);
      mockedAPI.post.mockRejectedValueOnce(new Error("Network Error"));

      await expect(
        OrganisationService.createOrganisation(mockOrgPayload)
      ).rejects.toThrow("Failed to create organisation");
    });
  });
});
