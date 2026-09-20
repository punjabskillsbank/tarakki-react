import API from "./axios";
import config from "../config/indexConfig";

export interface BoardTaskResponse {
  taskId: number;
  boardId: number;
  groupId: number;
  title: string;
  position: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export default class TaskService {
  static async getTasks(boardId: number): Promise<BoardTaskResponse[]> {
    const baseURL = config.baseURLs.boardTaskService || "";
    const response = await API.get<BoardTaskResponse[]>(
      `${baseURL}/${boardId}/task`,
    );
    return response.data;
  }
}
