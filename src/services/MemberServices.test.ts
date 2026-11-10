import MemberServices from "./MemberServices";
import API from "./axios";
import {
  FAILED_TO_CREATE_MEMBER,
  FAILED_TO_FETCH_MEMBER_DETAILS,
  MOCK_CACHE_CONTROL_HEADER,
  MOCK_CACHE_CONTROL_VALUE,
  MOCK_MEMBER_ALREADY_EXISTS_ERROR,
  MOCK_MEMBER_ID,
  MOCK_MEMBER_NOT_FOUND_ERROR,
  MOCK_NETWORK_ERROR,
  memberFactory,
  memberServiceResponseErrorFactory,
  memberSignupResponseFactory,
} from "../test-utils/factories";
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
      const responseData = memberSignupResponseFactory();
      mockedAPI.post.mockResolvedValueOnce({ data: responseData });

      const result = await MemberServices.createMember(memberData);

      expect(mockedAPI.post).toHaveBeenCalledWith(
        `${config.baseURLs.memberService}${config.endpoints.members}`,
        memberData
      );
      expect(result).toEqual(responseData);
    });

    it("throws an error with message from response on failure", async () => {
      mockedAPI.post.mockRejectedValueOnce({
        response: {
          data: { message: MOCK_MEMBER_ALREADY_EXISTS_ERROR },
        },
      });

      await expect(MemberServices.createMember(memberData)).rejects.toThrow(
        MOCK_MEMBER_ALREADY_EXISTS_ERROR
      );
    });

    it("throws a default error message on failure if no message in response", async () => {
      mockedAPI.post.mockRejectedValueOnce(new Error(MOCK_NETWORK_ERROR));

      await expect(MemberServices.createMember(memberData)).rejects.toThrow(
        FAILED_TO_CREATE_MEMBER
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
      expect(mockedAPI.get).toHaveBeenCalledWith(
        `${config.baseURLs.memberService}${config.endpoints.members}/${memberId}`,
        {
          headers: {
            [MOCK_CACHE_CONTROL_HEADER]: MOCK_CACHE_CONTROL_VALUE,
          },
        }
      );
      expect(result).toEqual(memberData);
    });

    it("throws an error with message from response on failure", async () => {
      mockedAPI.get.mockRejectedValueOnce({
        response: {
          data: {
            message: MOCK_MEMBER_NOT_FOUND_ERROR,
          },
        },
      });
      await expect(
        MemberServices.getMemberById(MOCK_MEMBER_ID)
      ).rejects.toThrow(
        MOCK_MEMBER_NOT_FOUND_ERROR
      );
    });

    it("throws a default error message on failure if no message in response", async () => {
      mockedAPI.get.mockRejectedValueOnce(new Error(MOCK_NETWORK_ERROR));
      await expect(
        MemberServices.getMemberById(MOCK_MEMBER_ID)
      ).rejects.toThrow(
        FAILED_TO_FETCH_MEMBER_DETAILS
      );
    });
  });

  describe("getMemberByEmail", () => {
    it("successfully fetches a member by email", async () => {
      const memberData = memberFactory();
      const email = memberData.email;
      mockedAPI.get.mockResolvedValueOnce({
        data: memberData,
      });
      const result = await MemberServices.getMemberByEmail(email);
      expect(mockedAPI.get).toHaveBeenCalledWith(
        `${config.baseURLs.memberService}${config.endpoints.members}/email/${email}`,
        {
          headers: {
            [MOCK_CACHE_CONTROL_HEADER]: MOCK_CACHE_CONTROL_VALUE,
          },
        }
      );
      expect(result).toEqual(memberData);
    });

    it("throws an error with message from response on failure", async () => {
      const member = memberFactory();
      mockedAPI.get.mockRejectedValueOnce(
        memberServiceResponseErrorFactory(MOCK_MEMBER_NOT_FOUND_ERROR)
      );
      await expect(
        MemberServices.getMemberByEmail(member.email)
      ).rejects.toThrow(MOCK_MEMBER_NOT_FOUND_ERROR);
    });

    it("throws a default error message on failure if no response is available", async () => {
      mockedAPI.get.mockRejectedValueOnce(new Error(MOCK_NETWORK_ERROR));

      await expect(
        MemberServices.getMemberByEmail(memberFactory().email)
      ).rejects.toThrow(FAILED_TO_FETCH_MEMBER_DETAILS);
    });
  });
});
