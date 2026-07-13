import API from "../../services/axios";
import { adminOrganizationService } from "./AdminOrganizationService";
import commonConfig from "../../config/commonConfig";
import {
 mockApiOrganizations,
 mappedAcmeOrganization,
 mappedTechOrganization,
  mockOrganizationWithoutOwner,
  mockOrganizationWithoutMemberCount,
  mockOpenAIOrganization,
} from "../../test-utils/factories";

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
          ? "550e8400-e29b-41d4-a716-446655440000"
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
            memberId: "550e8400-e29b-41d4-a716-446655440000",
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
    it("should return an empty array when no members exist", async () => {
      const result = await adminOrganizationService.listMembers("1");

      expect(result).toEqual([]);
    });
  });
});
