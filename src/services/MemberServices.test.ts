import MemberServices from "./MemberServices";
import API from "./axios";
import { memberFactory, MOCK_MEMBER_ID } from "../test-utils/factories";
import config from "../config/indexConfig";

jest.mock("./axios");
const mockedAPI = API as jest.Mocked<typeof API>;

describe("MemberServices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createMember", () => {
    const memberData = memberFactory();

    it("successfully creates a member", async () => {
      const responseData = { id: 1, ...memberData };
      mockedAPI.post.mockResolvedValueOnce({ data: responseData });

      const result = await MemberServices.createMember(memberData);

      expect(mockedAPI.post).toHaveBeenCalledWith(
        config.endpoints.members,
        memberData
      );
      expect(result).toEqual(responseData);
    });

    it("throws an error with message from response on failure", async () => {
      const errorMessage = "Email already exists";
      mockedAPI.post.mockRejectedValueOnce({
        response: {
          data: { message: errorMessage },
        },
      });

      await expect(MemberServices.createMember(memberData)).rejects.toThrow(
        errorMessage
      );
    });

    it("throws a default error message on failure if no message in response", async () => {
      mockedAPI.post.mockRejectedValueOnce(new Error("Network Error"));

      await expect(MemberServices.createMember(memberData)).rejects.toThrow(
        "Failed to create member"
      );
    });
  });

  describe("getMemberById", () => {
    it("successfully fetches a member by ID", async () => {
      const memberData = memberFactory();
      const memberId = MOCK_MEMBER_ID;
      mockedAPI.get.mockResolvedValueOnce({
        data: memberData,
      });
      const result = await MemberServices.getMemberById(memberId);
      expect(mockedAPI.get).toHaveBeenCalledWith(`/members/${memberId}`);
      expect(result).toEqual(memberData);
    });

    it("throws an error with message from response on failure", async () => {
      const errorMessage = "Member not found";
      mockedAPI.get.mockRejectedValueOnce({
        response: {
          data: {
            message: errorMessage,
          },
        },
      });
      await expect(MemberServices.getMemberById("123")).rejects.toThrow(
        errorMessage
      );
    });

    it("throws a default error message on failure if no message in response", async () => {
      mockedAPI.get.mockRejectedValueOnce(new Error("Network Error"));
      await expect(MemberServices.getMemberById("123")).rejects.toThrow(
        "Failed to fetch member details"
      );
    });
  });

  describe("getMemberByEmail", () => {
    it("successfully fetches a member by email", async () => {
      const memberData = memberFactory();
      const email = "john.doe@example.com";
      mockedAPI.get.mockResolvedValueOnce({
        data: memberData,
      });
      const result = await MemberServices.getMemberByEmail(email);
      expect(mockedAPI.get).toHaveBeenCalledWith(`/members/email/${email}`);
      expect(result).toEqual(memberData);
    });

    it("throws an error with message from response on failure", async () => {
      const errorMessage = "Member not found";
      mockedAPI.get.mockRejectedValueOnce({
        response: {
          data: {
            message: errorMessage,
          },
        },
      });
      await expect(
        MemberServices.getMemberByEmail("john.doe@example.com")
      ).rejects.toThrow(errorMessage);
    });
  });
});
