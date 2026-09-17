import BoardService from "./BoardService";
import API from "./axios";
import config from "../config/indexConfig";
import {
  boardPayloadFactory,
  boardResponseFactory,
  FAILED_TO_CREATE_BOARD,
  MOCK_BOARD_ERROR,
  MOCK_BOARD_ID,
  MOCK_NETWORK_ERROR,
} from "../test-utils/factories";

jest.mock("./axios");

const mockedAPI = API as jest.Mocked<typeof API>;

describe("BoardService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createBoard", () => {
    it("creates a board", async () => {
      const payload = boardPayloadFactory();
      const response = boardResponseFactory();
      mockedAPI.post.mockResolvedValueOnce({ data: response });

      await expect(BoardService.createBoard(payload)).resolves.toEqual(response);

      expect(mockedAPI.post).toHaveBeenCalledWith(
        `${config.baseURLs.boardTaskService}${config.endpoints.boards}`,
        payload,
      );
    });

    it("uses the API error message when creation fails", async () => {
      mockedAPI.post.mockRejectedValueOnce({
        response: { data: { message: MOCK_BOARD_ERROR } },
      });

      await expect(
        BoardService.createBoard(boardPayloadFactory()),
      ).rejects.toThrow(MOCK_BOARD_ERROR);
    });

    it("uses the default error message when creation fails without one", async () => {
      mockedAPI.post.mockRejectedValueOnce(new Error(MOCK_NETWORK_ERROR));

      await expect(
        BoardService.createBoard(boardPayloadFactory()),
      ).rejects.toThrow(FAILED_TO_CREATE_BOARD);
    });
  });

  describe("getBoard", () => {
    it("fetches a board by ID", async () => {
      const response = boardResponseFactory();
      mockedAPI.get.mockResolvedValueOnce({ data: response });

      await expect(BoardService.getBoard(MOCK_BOARD_ID)).resolves.toEqual(
        response,
      );

      expect(mockedAPI.get).toHaveBeenCalledWith(
        `${config.baseURLs.boardTaskService}${config.endpoints.boards}/${MOCK_BOARD_ID}`,
      );
    });

    it("propagates fetch failures", async () => {
      const error = new Error(MOCK_NETWORK_ERROR);
      mockedAPI.get.mockRejectedValueOnce(error);

      await expect(BoardService.getBoard(MOCK_BOARD_ID)).rejects.toThrow(error);
    });
  });
});
