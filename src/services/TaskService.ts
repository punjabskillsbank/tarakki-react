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

export interface CreateBoardTaskRequest {
  boardId: number;
  groupId: number;
  title: string;
  position: number;
  createdBy: string;
}

export interface UpdateBoardTaskRequest {
  title?: string;
  groupId?: number;
  position?: number;
}

export default class TaskService {
  static async getTasks(boardId: number): Promise<BoardTaskResponse[]> {
    const baseURL = config.baseURLs.boardTaskService || "";
    const response = await API.get<BoardTaskResponse[]>(
      `${baseURL}/${boardId}/task`,
    );
    return response.data;
  }

  static async createTask(
    boardId: number,
    task: CreateBoardTaskRequest,
  ): Promise<BoardTaskResponse> {
    const baseURL = config.baseURLs.boardTaskService || "";
    const response = await API.post<BoardTaskResponse>(
      `${baseURL}/${boardId}/task`,
      task,
    );
    return response.data;
  }

  static async updateTask(
    boardId: number,
    taskId: number,
    task: UpdateBoardTaskRequest,
  ): Promise<BoardTaskResponse> {
    const baseURL = config.baseURLs.boardTaskService || "";
    const response = await API.patch<BoardTaskResponse>(
      `${baseURL}/${boardId}/task/${taskId}`,
      task,
    );
    return response.data;
  }
}
