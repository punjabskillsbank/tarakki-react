import API from "../../services/axios";
import { adminRepository } from "./adminRepository";

jest.mock("../../services/axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe("adminRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockApiOrganizations = [
    {
      orgId: 1,
      orgName: "Acme Corporation",
      orgDesc: "Leading enterprise software solutions provider",
      owner: {
        firstName: "John",
        lastName: "Smith",
        email: "john@acme.com",
      },
      orgAddress: "123 Business Park",
      orgCity: "New York",
      orgState: "NY",
      orgPostalCode: "10001",
      orgCountry: "USA",
      totalMemberCount: 24,
    },
    {
      orgId: 2,
      orgName: "Tech Innovations Ltd",
      orgDesc: "AI and cloud transformation company",
      owner: {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah@techinnovations.io",
      },
      orgAddress: "45 Silicon Avenue",
      orgCity: "San Francisco",
      orgState: "CA",
      orgPostalCode: "94105",
      orgCountry: "USA",
      totalMemberCount: 12,
    },
  ];

  describe("listOrganizations", () => {
    it("should fetch and map organizations correctly", async () => {
      (API.get as jest.Mock).mockResolvedValue({
        data: mockApiOrganizations,
      });

      const result = await adminRepository.listOrganizations();

      expect(API.get).toHaveBeenCalledTimes(1);
      expect(API.get).toHaveBeenCalledWith("/admin/organizations/");

      expect(result).toEqual([
        {
          id: "1",
          name: "Acme Corporation",
          description: "Leading enterprise software solutions provider",
          owner: {
            name: "John Smith",
            email: "john@acme.com",
            initials: "JS",
          },
          address: "123 Business Park",
          location: {
            city: "New York",
            state: "NY",
            country: "USA",
            postalCode: "10001",
          },
          memberCount: 24,
          addedAt: "",
        },
        {
          id: "2",
          name: "Tech Innovations Ltd",
          description: "AI and cloud transformation company",
          owner: {
            name: "Sarah Johnson",
            email: "sarah@techinnovations.io",
            initials: "SJ",
          },
          address: "45 Silicon Avenue",
          location: {
            city: "San Francisco",
            state: "CA",
            country: "USA",
            postalCode: "94105",
          },
          memberCount: 12,
          addedAt: "",
        },
      ]);
    });

    it("should handle organizations with no owner", async () => {
      (API.get as jest.Mock).mockResolvedValue({
        data: [
          {
            orgId: 3,
            orgName: "Test Org",
            orgDesc: "Testing",
            owner: null,
            orgAddress: "Test Address",
            orgCity: "Test City",
            orgState: "Punjab",
            orgPostalCode: "140001",
            orgCountry: "India",
            totalMemberCount: 5,
          },
        ],
      });

      const result = await adminRepository.listOrganizations();

      expect(result[0].owner).toEqual({
        name: "Unknown Owner",
        email: "",
        initials: "NA",
      });
    });

    it("should default memberCount to 0 when missing", async () => {
      (API.get as jest.Mock).mockResolvedValue({
        data: [
          {
            orgId: 4,
            orgName: "Demo Org",
            orgDesc: "Demo",
            owner: null,
            orgAddress: "Demo Address",
            orgCity: "Demo City",
            orgState: "Punjab",
            orgPostalCode: "140001",
            orgCountry: "India",
            totalMemberCount: undefined,
          },
        ],
      });

      const result = await adminRepository.listOrganizations();

      expect(result[0].memberCount).toBe(0);
    });

    it("should generate initials correctly", async () => {
      (API.get as jest.Mock).mockResolvedValue({
        data: [
          {
            orgId: 5,
            orgName: "OpenAI",
            orgDesc: "AI Research",
            owner: {
              firstName: "Sam",
              lastName: "Altman",
              email: "sam@openai.com",
            },
            orgAddress: "Address",
            orgCity: "San Francisco",
            orgState: "CA",
            orgPostalCode: "94107",
            orgCountry: "USA",
            totalMemberCount: 10,
          },
        ],
      });

      const result = await adminRepository.listOrganizations();

      expect(result[0].owner.initials).toBe("SA");
      expect(result[0].owner.name).toBe("Sam Altman");
    });
  });

  describe("getOrganization", () => {
    it("should return the organization when found", async () => {
      (API.get as jest.Mock).mockResolvedValue({
        data: mockApiOrganizations,
      });

      const result = await adminRepository.getOrganization("2");

      expect(result).toBeDefined();
      expect(result?.id).toBe("2");
      expect(result?.name).toBe("Tech Innovations Ltd");
    });

    it("should return undefined when organization does not exist", async () => {
      (API.get as jest.Mock).mockResolvedValue({
        data: mockApiOrganizations,
      });

      const result = await adminRepository.getOrganization("999");

      expect(result).toBeUndefined();
    });
  });

  describe("listMembers", () => {
    it("should return members belonging to Acme Corporation", async () => {
      const result = await adminRepository.listMembers("acme-corporation");

      expect(result).toHaveLength(3);
      expect(
        result.every(
          (member) => member.organizationId === "acme-corporation"
        )
      ).toBe(true);
    });

    it("should return members belonging to Tech Innovations Ltd", async () => {
      const result = await adminRepository.listMembers(
        "tech-innovations-ltd"
      );

      expect(result).toHaveLength(2);
      expect(
        result.every(
          (member) =>
            member.organizationId === "tech-innovations-ltd"
        )
      ).toBe(true);
    });

    it("should return members belonging to Digital Solutions Inc", async () => {
      const result = await adminRepository.listMembers(
        "digital-solutions-inc"
      );

      expect(result).toHaveLength(1);
      expect(result[0].organizationId).toBe(
        "digital-solutions-inc"
      );
    });

    it("should return an empty array for an unknown organization", async () => {
      const result = await adminRepository.listMembers("unknown-org");

      expect(result).toEqual([]);
    });
  });
});