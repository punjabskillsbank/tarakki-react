import { isAxiosError } from "axios";
import API from "./axios";
import OrganizationService from "./OrganizationServices";
import config from "../config/indexConfig";
import {
  FAILED_TO_CREATE_ORGANIZATION,
  FAILED_TO_FETCH_ORGANIZATION_MEMBERS,
  FAILED_TO_INVITE_MEMBERS,
  MOCK_INVITATION_ERROR,
  MOCK_NETWORK_ERROR,
  MOCK_ORGANIZATION_ERROR,
  MOCK_ORG_ID,
  MOCK_ORGANIZATION_ID,
  mockInvitePayload,
  mockOrgPayload,
  mockOrgSuccessResponse,
  organizationMemberResponseFactory,
  organizationMembersResponseFactory,
  axiosErrorResponseFactory,
} from "../test-utils/factories";

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

describe("OrganizationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createOrganization", () => {
    it("creates an organization", async () => {
      mockedAPI.post.mockResolvedValueOnce({ data: mockOrgSuccessResponse });

      await expect(
        OrganizationService.createOrganization(mockOrgPayload),
      ).resolves.toEqual(mockOrgSuccessResponse);

      expect(mockedAPI.post).toHaveBeenCalledWith(
        `${config.baseURLs.organizationService}${config.endpoints.organizations}`,
        mockOrgPayload,
      );
    });

    it("uses the API error message when creation fails", async () => {
      mockedIsAxiosError.mockReturnValueOnce(true);
      mockedAPI.post.mockRejectedValueOnce(
        axiosErrorResponseFactory(MOCK_ORGANIZATION_ERROR),
      );

      await expect(
        OrganizationService.createOrganization(mockOrgPayload),
      ).rejects.toThrow(MOCK_ORGANIZATION_ERROR);
    });

    it("uses the default error message when creation fails without one", async () => {
      mockedIsAxiosError.mockReturnValueOnce(true);
      mockedAPI.post.mockRejectedValueOnce(axiosErrorResponseFactory());

      await expect(
        OrganizationService.createOrganization(mockOrgPayload),
      ).rejects.toThrow(FAILED_TO_CREATE_ORGANIZATION);
    });

    it("uses the default error message for non-Axios failures", async () => {
      mockedIsAxiosError.mockReturnValueOnce(false);
      mockedAPI.post.mockRejectedValueOnce(new Error(MOCK_NETWORK_ERROR));

      await expect(
        OrganizationService.createOrganization(mockOrgPayload),
      ).rejects.toThrow(FAILED_TO_CREATE_ORGANIZATION);
    });
  });

  describe("inviteMember", () => {
    it("invites an organization member", async () => {
      const response = organizationMemberResponseFactory();
      mockedAPI.post.mockResolvedValueOnce({ data: response });

      await expect(
        OrganizationService.inviteMember(MOCK_ORG_ID, mockInvitePayload),
      ).resolves.toEqual(response);

      expect(mockedAPI.post).toHaveBeenCalledWith(
        config.endpoints.organizationMember(MOCK_ORG_ID),
        mockInvitePayload,
      );
    });

    it("uses the API error message when inviting a member fails", async () => {
      mockedIsAxiosError.mockReturnValueOnce(true);
      mockedAPI.post.mockRejectedValueOnce(
        axiosErrorResponseFactory(MOCK_INVITATION_ERROR),
      );

      await expect(
        OrganizationService.inviteMember(MOCK_ORG_ID, mockInvitePayload),
      ).rejects.toThrow(MOCK_INVITATION_ERROR);
    });

    it("uses the default error message when invitation fails without one", async () => {
      mockedIsAxiosError.mockReturnValueOnce(true);
      mockedAPI.post.mockRejectedValueOnce(axiosErrorResponseFactory());

      await expect(
        OrganizationService.inviteMember(MOCK_ORG_ID, mockInvitePayload),
      ).rejects.toThrow(FAILED_TO_INVITE_MEMBERS);
    });

    it("uses the default message for a non-Axios invitation failure", async () => {
      mockedIsAxiosError.mockReturnValueOnce(false);
      mockedAPI.post.mockRejectedValueOnce(new Error(MOCK_NETWORK_ERROR));

      await expect(
        OrganizationService.inviteMember(MOCK_ORG_ID, mockInvitePayload),
      ).rejects.toThrow(FAILED_TO_INVITE_MEMBERS);
    });
  });

  describe("getOrganizationMembers", () => {
    it("fetches organization members", async () => {
      const members = organizationMembersResponseFactory();
      mockedAPI.get.mockResolvedValueOnce({ data: members });

      await expect(
        OrganizationService.getOrganizationMembers(MOCK_ORGANIZATION_ID),
      ).resolves.toEqual(members);

      expect(mockedAPI.get).toHaveBeenCalledWith(
        `${config.baseURLs.organizationService}${config.endpoints.organizationMember(MOCK_ORGANIZATION_ID)}`,
      );
    });

    it("uses the API error message when member loading fails", async () => {
      mockedIsAxiosError.mockReturnValueOnce(true);
      mockedAPI.get.mockRejectedValueOnce(
        axiosErrorResponseFactory(MOCK_INVITATION_ERROR),
      );

      await expect(
        OrganizationService.getOrganizationMembers(MOCK_ORGANIZATION_ID),
      ).rejects.toThrow(MOCK_INVITATION_ERROR);
    });

    it("joins field validation messages when member loading fails", async () => {
      mockedIsAxiosError.mockReturnValueOnce(true);
      mockedAPI.get.mockRejectedValueOnce({
        response: {
          data: {
            email: "Email is invalid",
            role: "Role is required",
          },
        },
      });

      await expect(
        OrganizationService.getOrganizationMembers(MOCK_ORGANIZATION_ID),
      ).rejects.toThrow("Email is invalid, Role is required");
    });

    it("uses the default error message when member loading fails without one", async () => {
      mockedIsAxiosError.mockReturnValueOnce(true);
      mockedAPI.get.mockRejectedValueOnce(axiosErrorResponseFactory());

      await expect(
        OrganizationService.getOrganizationMembers(MOCK_ORGANIZATION_ID),
      ).rejects.toThrow(FAILED_TO_FETCH_ORGANIZATION_MEMBERS);
    });

    it("uses the default message for a non-Axios member-loading failure", async () => {
      mockedIsAxiosError.mockReturnValueOnce(false);
      mockedAPI.get.mockRejectedValueOnce(new Error(MOCK_NETWORK_ERROR));

      await expect(
        OrganizationService.getOrganizationMembers(MOCK_ORGANIZATION_ID),
      ).rejects.toThrow(FAILED_TO_FETCH_ORGANIZATION_MEMBERS);
    });
  });
});
