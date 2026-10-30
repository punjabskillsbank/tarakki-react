import BoardMemberService from "./BoardMemberService";
import API from "./axios";
import config from "../config/indexConfig";
import {
  boardMemberPayloadFactory,
  boardMemberAccessFactory,
  boardMemberNetworkErrorFactory,
  boardMembersResponseFactory,
  MOCK_EMAIL,
  MOCK_BOARD_MEMBER_NETWORK_ERROR,
  MOCK_ORG_MEMBER_ID,
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
      const error = boardMemberNetworkErrorFactory();
      mockedAPI.post.mockRejectedValueOnce(error);

      await expect(
        BoardMemberService.addMember(payload.boardId, payload.memberId),
      ).rejects.toThrow(error);
    });
  });

  describe("getBoardMembers", () => {
    it("fetches existing members for a board", async () => {
      const payload = boardMemberPayloadFactory();
      const members = boardMembersResponseFactory();
      mockedAPI.get.mockResolvedValueOnce({ data: members });

      await expect(BoardMemberService.getBoardMembers(payload.boardId)).resolves.toEqual(members);
      expect(mockedAPI.get).toHaveBeenCalledWith(
        `${config.baseURLs.boardTaskService}${config.endpoints.boardMembersForBoard(payload.boardId)}`,
      );
    });

    it("propagates board-member loading failures", async () => {
      const payload = boardMemberPayloadFactory();
      const error = boardMemberNetworkErrorFactory();
      mockedAPI.get.mockRejectedValueOnce(error);

      await expect(BoardMemberService.getBoardMembers(payload.boardId)).rejects.toThrow(
        MOCK_BOARD_MEMBER_NETWORK_ERROR,
      );
    });
  });

  describe("addOrgMemberToBoard", () => {
    it("posts an organization member to the board path", async () => {
      mockedAPI.post.mockResolvedValueOnce({ data: undefined });

      const payload = boardMemberAccessFactory(MOCK_EMAIL, true);
      const board = boardMemberPayloadFactory();
      await BoardMemberService.addOrgMemberToBoard(
        board.boardId,
        MOCK_ORG_MEMBER_ID,
        payload,
      );

      expect(mockedAPI.post).toHaveBeenCalledWith(
        `${config.baseURLs.boardTaskService}${config.endpoints.boardMember(board.boardId, MOCK_ORG_MEMBER_ID)}`,
        payload,
      );
    });

    it("propagates organization-member addition failures", async () => {
      const payload = boardMemberAccessFactory(MOCK_EMAIL);
      const board = boardMemberPayloadFactory();
      const error = boardMemberNetworkErrorFactory();
      mockedAPI.post.mockRejectedValueOnce(error);

      await expect(
        BoardMemberService.addOrgMemberToBoard(
          board.boardId,
          MOCK_ORG_MEMBER_ID,
          payload,
        ),
      ).rejects.toThrow(MOCK_BOARD_MEMBER_NETWORK_ERROR);
    });
  });
});
