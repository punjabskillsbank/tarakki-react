import { isAxiosError } from "axios";
import GroupService, { CreateGroupPayload } from "./GroupService";
import API from "./axios";
import config from "../config/indexConfig";

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
    const boardId = 42;
    const groupPayload: CreateGroupPayload = {
      boardId,
      groupName: "Sprint Backlog",
      position: 1,
      createdBy: "user-1",
    };

    it("successfully creates a group", async () => {
      const responseData = {
        ...groupPayload,
        groupId: 7,
        createdAt: "2026-09-05T00:00:00Z",
        updatedAt: "2026-09-05T00:00:00Z",
      };

      mockedAPI.post.mockResolvedValueOnce({ data: responseData });

      const result = await GroupService.createGroup(boardId, groupPayload);

      expect(mockedAPI.post).toHaveBeenCalledWith(
        `${config.baseURLs.boardTaskService}${config.endpoints.boards}/${boardId}/groups`,
        groupPayload,
      );
      expect(result).toEqual(responseData);
    });

    it("throws an error with message from response on failure", async () => {
      const errorMessage = "Group name already exists";
      mockedIsAxiosError.mockReturnValueOnce(true);
      mockedAPI.post.mockRejectedValueOnce({
        response: {
          data: { message: errorMessage },
        },
      });

      await expect(GroupService.createGroup(boardId, groupPayload)).rejects.toThrow(
        errorMessage,
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
        "Failed to create group",
      );
    });
  });
});
