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
      const response = await API.post<CreateGroupResponse>(
        `${config.endpoints.boards}/${boardId}/groups`,
        payload,
      );
      return response.data;
    } catch (error: unknown) {
      const message = isAxiosError(error)
        ? error.response?.data?.message ||
          error.response?.data ||
          "Failed to create group"
        : "Failed to create group";
      throw new Error(
        typeof message === "string" ? message : "Failed to create group",
        { cause: error },
      );
    }
  }
}
