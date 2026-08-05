import API from "./axios";
import { adminOrganizationService } from "./AdminOrganizationService";
import commonConfig from "../config/commonConfig";
import {
 mockApiOrganizations,
 mappedAcmeOrganization,
 mappedTechOrganization,
  MOCK_MEMBER_ID,
  mockOrganizationWithoutOwner,
  mockOrganizationWithoutMemberCount,
  mockOpenAIOrganization,
} from "../test-utils/factories";

jest.mock("../../services/axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe("adminOrganizationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation((key: string) =>
        key === "memberId"
          ? MOCK_MEMBER_ID
          : null
      );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("listOrganizations", () => {
    it("should fetch and map organizations correctly", async () => {
      (API.get as jest.Mock).mockResolvedValue({
        data: mockApiOrganizations,
      });

      const result = await adminOrganizationService.listOrganizations();

      expect(API.get).toHaveBeenCalledTimes(1);
      expect(API.get).toHaveBeenCalledWith(
        commonConfig.endpoints.all_organizations
      );

      expect(result).toHaveLength(2);

      expect(result[0]).toEqual(mappedAcmeOrganization);
    });

    it("should return an empty array when no organizations exist", async () => {
      (API.get as jest.Mock).mockResolvedValue({
        data: [],
      });

      const result = await adminOrganizationService.listOrganizations();

      expect(result).toEqual([]);
    });

    it("should handle organizations with no owner", async () => {
      (API.get as jest.Mock).mockResolvedValue({
        data: [mockOrganizationWithoutOwner],
      });

      const result = await adminOrganizationService.listOrganizations();

      expect(result[0].owner).toEqual({
        name: "Unknown Owner",
        email: "",
        initials: "NA",
      });
    });

    it("should default memberCount to 0 when missing", async () => {
      (API.get as jest.Mock).mockResolvedValue({
        data: [mockOrganizationWithoutMemberCount],
      });

      const result = await adminOrganizationService.listOrganizations();

      expect(result[0].memberCount).toBe(0);
    });

    it("should generate owner initials correctly", async () => {
      (API.get as jest.Mock).mockResolvedValue({
        data: [mockOpenAIOrganization],
      });

      const result = await adminOrganizationService.listOrganizations();

      expect(result[0].owner.name).toBe("Sam Altman");
      expect(result[0].owner.initials).toBe("SA");
      expect(result[0].owner.email).toBe("sam@openai.com");
    });
  });

  describe("getOrganization", () => {
    it("should fetch and map a single organization", async () => {
      (API.get as jest.Mock).mockResolvedValue({
        data: mockApiOrganizations[1],
      });

      const result = await adminOrganizationService.getOrganization("2");

      expect(API.get).toHaveBeenCalledWith(
        `${commonConfig.endpoints.organizations}/2`,
        {
          params: {
            memberId: MOCK_MEMBER_ID,
          },
        }
      );

      expect(result).toEqual(mappedTechOrganization);
    });

    it("should propagate API errors", async () => {
      (API.get as jest.Mock).mockRejectedValue(
        new Error("Network Error")
      );

      await expect(
        adminOrganizationService.getOrganization("1")
      ).rejects.toThrow("Network Error");
    });
  });

  describe("listMembers", () => {
    it("should fetch and map organization members", async () => {
      (API.get as jest.Mock).mockResolvedValue({
        data: [
          {
            orgId: 1,
            memberId: MOCK_MEMBER_ID,
            email: "admin@example.com",
            memberAccountStatus: "ACCEPTED",
            orgMemberRole: "ORG_ADMIN",
            createdAt: "2026-08-04T10:00:00",
            updatedAt: "2026-08-04T11:00:00",
          },
        ],
      });

      const result = await adminOrganizationService.listMembers("1");

      expect(API.get).toHaveBeenCalledWith(
        `${commonConfig.endpoints.organizations}/1/members`
      );
      expect(result).toEqual([
        {
          id: MOCK_MEMBER_ID,
          organizationId: "1",
          name: "admin@example.com",
          email: "admin@example.com",
          initials: "AD",
          role: "Admin",
          status: "Active",
          joinedAt: "2026-08-04T10:00:00",
          updatedAt: "2026-08-04T11:00:00",
        },
      ]);
    });
  });
});
