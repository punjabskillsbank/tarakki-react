import { isAxiosError } from "axios";
import GroupService from "./GroupService";
import type { CreateGroupPayload } from "./GroupService";
import API from "./axios";
import config from "../config/indexConfig";
import {
  FAILED_TO_CREATE_GROUP,
  groupPayloadFactory,
  groupResponseFactory,
  MOCK_BOARD_ID,
  MOCK_GROUP_ERROR,
} from "../test-utils/factories";

jest.mock("./axios");
jest.mock("axios", () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({ post: jest.fn() })),
  },
  isAxiosError: jest.fn(),
  create: jest.fn(() => ({ post: jest.fn() })),
}));

const mockedAPI = API as jest.Mocked<typeof API>;
const mockedIsAxiosError = isAxiosError as jest.MockedFunction<typeof isAxiosError>;

describe("GroupService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createGroup", () => {
    const boardId = MOCK_BOARD_ID;
    const groupPayload: CreateGroupPayload = groupPayloadFactory();

    it("successfully creates a group", async () => {
      const responseData = groupResponseFactory();

      mockedAPI.post.mockResolvedValueOnce({ data: responseData });

      const result = await GroupService.createGroup(boardId, groupPayload);

      expect(mockedAPI.post).toHaveBeenCalledWith(
        `${config.baseURLs.boardTaskService}${config.endpoints.boards}/${boardId}/groups`,
        groupPayload,
      );
      expect(result).toEqual(responseData);
    });

    it("throws an error with message from response on failure", async () => {
      mockedIsAxiosError.mockReturnValueOnce(true);
      mockedAPI.post.mockRejectedValueOnce({
        response: {
          data: { message: MOCK_GROUP_ERROR },
        },
      });

      await expect(GroupService.createGroup(boardId, groupPayload)).rejects.toThrow(
        MOCK_GROUP_ERROR,
      );
    });

    it("throws a default error message when no axios message exists", async () => {
      mockedIsAxiosError.mockReturnValueOnce(true);
      mockedAPI.post.mockRejectedValueOnce({
        response: {
          data: null,
        },
      });

      await expect(GroupService.createGroup(boardId, groupPayload)).rejects.toThrow(
        FAILED_TO_CREATE_GROUP,
      );
    });
  });
});
