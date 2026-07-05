import API from "../../services/axios";
import { adminOrganizationService } from "./AdminOrganizationService";
import { mockApiOrganizations,mockOrganizationWithoutOwner,mockOrganizationWithoutMemberCount, mockOpenAIOrganization } from "../../test-utils/factories";


jest.mock("../../services/axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe("adminOrganizationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  describe("listOrganizations", () => {
    it("should fetch and map organizations correctly", async () => {
      (API.get as jest.Mock).mockResolvedValue({
        data: mockApiOrganizations,
      });

      const result = await adminOrganizationService.listOrganizations();

      expect(API.get).toHaveBeenCalledTimes(1);
      expect(API.get).toHaveBeenCalledWith("/admin/organizations/");

      expect(result).toEqual(mockApiOrganizations);
    });

    it("should handle organizations with no owner", async () => {
      (API.get as jest.Mock).mockResolvedValue({
        data: mockOrganizationWithoutOwner,
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
        data:mockOrganizationWithoutMemberCount,
      });

      const result = await adminOrganizationService.listOrganizations();

      expect(result[0].memberCount).toBe(0);
    });

    it("should generate initials correctly", async () => {
      (API.get as jest.Mock).mockResolvedValue({
        data: mockOpenAIOrganization,
      });

      const result = await adminOrganizationService.listOrganizations();

      expect(result[0].owner.initials).toBe("SA");
      expect(result[0].owner.name).toBe("Sam Altman");
    });
  });

  describe("getOrganization", () => {
    it("should return the organization when found", async () => {
      (API.get as jest.Mock).mockResolvedValue({
        data: mockApiOrganizations,
      });

      const result = await adminOrganizationService.getOrganization("2");

      expect(result).toBeDefined();
      expect(result?.id).toBe("2");
      expect(result?.name).toBe("Tech Innovations Ltd");
    });

    it("should return undefined when organization does not exist", async () => {
      (API.get as jest.Mock).mockResolvedValue({
        data: mockApiOrganizations,
      });

      const result = await adminOrganizationService.getOrganization("999");

      expect(result).toBeUndefined();
    });
  });

describe("listMembers", () => {
  it("should return an empty array for Acme Corporation", async () => {
    const result = await adminOrganizationService.listMembers("acme-corporation");

    expect(result).toEqual([]);
  });

  it("should return an empty array for Tech Innovations Ltd", async () => {
    const result = await adminOrganizationService.listMembers(
      "tech-innovations-ltd"
    );

    expect(result).toEqual([]);
  });

  it("should return an empty array for Digital Solutions Inc", async () => {
    const result = await adminOrganizationService.listMembers(
      "digital-solutions-inc"
    );

    expect(result).toEqual([]);
  });

  it("should return an empty array for an unknown organization", async () => {
    const result = await adminOrganizationService.listMembers("unknown-org");

    expect(result).toEqual([]);
  });
});
});