import TaskService from "./TaskService";
import API from "./axios";
import config from "../config/indexConfig";
import {
  MOCK_BOARD_ID,
  MOCK_NETWORK_ERROR,
  taskResponseFactory,
} from "../test-utils/factories";

jest.mock("./axios");

const mockedAPI = API as jest.Mocked<typeof API>;

describe("TaskService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTasks", () => {
    it("fetches and returns the tasks for a board", async () => {
      const tasks = [taskResponseFactory()];
      mockedAPI.get.mockResolvedValueOnce({ data: tasks });

      const result = await TaskService.getTasks(MOCK_BOARD_ID);

      expect(mockedAPI.get).toHaveBeenCalledWith(
        `${config.baseURLs.boardTaskService}/${MOCK_BOARD_ID}/task`,
      );
      expect(result).toEqual(tasks);
    });

    it("propagates request failures", async () => {
      const error = new Error(MOCK_NETWORK_ERROR);
      mockedAPI.get.mockRejectedValueOnce(error);

      await expect(TaskService.getTasks(MOCK_BOARD_ID)).rejects.toThrow(error);
    });
  });
});
