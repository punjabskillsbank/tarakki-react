import BoardMemberService from "./BoardMemberService";
import API from "./axios";
import config from "../config/indexConfig";
import {
  boardMemberPayloadFactory,
  MOCK_NETWORK_ERROR,
} from "../test-utils/factories";

jest.mock("./axios");

const mockedAPI = API as jest.Mocked<typeof API>;

describe("BoardMemberService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addMember", () => {
    it("adds a member to a board", async () => {
      const payload = boardMemberPayloadFactory();
      mockedAPI.post.mockResolvedValueOnce({ data: undefined });

      await expect(
        BoardMemberService.addMember(payload.boardId, payload.memberId),
      ).resolves.toBeUndefined();

      expect(mockedAPI.post).toHaveBeenCalledWith(
        `${config.baseURLs.boardTaskService}${config.endpoints.boardMembers}`,
        payload,
      );
    });

    it("propagates request failures", async () => {
      const payload = boardMemberPayloadFactory();
      const error = new Error(MOCK_NETWORK_ERROR);
      mockedAPI.post.mockRejectedValueOnce(error);

      await expect(
        BoardMemberService.addMember(payload.boardId, payload.memberId),
      ).rejects.toThrow(error);
    });
  });

  describe("addOrgMemberToBoard", () => {
    it("posts an organization member to the board path", async () => {
      mockedAPI.post.mockResolvedValueOnce({ data: undefined });

      await BoardMemberService.addOrgMemberToBoard(42, 7, {
        email: "member@example.com",
        canEdit: true,
        canView: true,
      });

      expect(mockedAPI.post).toHaveBeenCalledWith(
        `${config.baseURLs.boardTaskService}${config.endpoints.boardMember(42, 7)}`,
        {
          email: "member@example.com",
          canEdit: true,
          canView: true,
        },
      );
    });
  });
});
