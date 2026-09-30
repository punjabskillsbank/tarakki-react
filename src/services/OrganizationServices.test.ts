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
} from "../test-utils/factories";

jest.mock("./axios");
jest.mock("axios", () => {
  const createInstance = () => ({
    post: jest.fn(),
    get: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  });
  return {
    __esModule: true,
    default: {
      create: jest.fn(createInstance),
    },
    isAxiosError: jest.fn(),
    create: jest.fn(createInstance),
  };
});

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
      mockedAPI.post.mockRejectedValueOnce({
        response: { data: { message: MOCK_ORGANIZATION_ERROR } },
      });

      await expect(
        OrganizationService.createOrganization(mockOrgPayload),
      ).rejects.toThrow(MOCK_ORGANIZATION_ERROR);
    });

    it("uses the default error message when creation fails without one", async () => {
      mockedIsAxiosError.mockReturnValueOnce(true);
      mockedAPI.post.mockRejectedValueOnce({ response: { data: null } });

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
      mockedAPI.post.mockRejectedValueOnce({
        response: { data: { message: MOCK_INVITATION_ERROR } },
      });

      await expect(
        OrganizationService.inviteMember(MOCK_ORG_ID, mockInvitePayload),
      ).rejects.toThrow(MOCK_INVITATION_ERROR);
    });

    it("uses the default error message when invitation fails without one", async () => {
      mockedIsAxiosError.mockReturnValueOnce(true);
      mockedAPI.post.mockRejectedValueOnce({ response: { data: null } });

      await expect(
        OrganizationService.inviteMember(MOCK_ORG_ID, mockInvitePayload),
      ).rejects.toThrow(FAILED_TO_INVITE_MEMBERS);
    });
  });

  describe("getOrganizationMembers", () => {
    it("fetches organization members", async () => {
      const members = [organizationMemberResponseFactory()];
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
      mockedAPI.get.mockRejectedValueOnce({
        response: { data: { message: MOCK_INVITATION_ERROR } },
      });

      await expect(
        OrganizationService.getOrganizationMembers(MOCK_ORGANIZATION_ID),
      ).rejects.toThrow(MOCK_INVITATION_ERROR);
    });

    it("uses the default error message when member loading fails without one", async () => {
      mockedIsAxiosError.mockReturnValueOnce(true);
      mockedAPI.get.mockRejectedValueOnce({ response: { data: null } });

      await expect(
        OrganizationService.getOrganizationMembers(MOCK_ORGANIZATION_ID),
      ).rejects.toThrow(FAILED_TO_FETCH_ORGANIZATION_MEMBERS);
    });
  });
});
