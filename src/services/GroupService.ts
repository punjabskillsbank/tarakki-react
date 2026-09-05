import { isAxiosError } from "axios";
import API from "./axios";
import config from "../config/indexConfig";

export interface CreateGroupPayload {
  boardId: number;
  groupName: string;
  position: number;
  createdBy: string;
}

export interface CreateGroupResponse extends CreateGroupPayload {
  groupId: number;
  createdAt: string;
  updatedAt: string;
}

export default class GroupService {
  static async createGroup(
    boardId: number,
    payload: CreateGroupPayload,
  ): Promise<CreateGroupResponse> {
    try {
      const baseURL = config.baseURLs.boardTaskService || "";
      const response = await API.post<CreateGroupResponse>(
        `${baseURL}${config.endpoints.boards}/${boardId}/groups`,
        payload,
      );
      return response.data;
    } catch (error: unknown) {
      const message = isAxiosError(error)
        ? error.response?.data?.message ||
          error.response?.data ||
          "Failed to create group"
        : "Failed to create group";
      const finalMessage =
        typeof message === "string" ? message : "Failed to create group";
      const wrappedError = new Error(finalMessage);
      (wrappedError as Error & { cause?: unknown }).cause = error;
      throw wrappedError;
    }
  }
}
