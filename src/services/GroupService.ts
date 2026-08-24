import API from './axios';
import config from '../config/indexConfig';

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
    const response = await API.post<CreateGroupResponse>(
      `${config.endpoints.boards}/${boardId}/groups`,
      payload,
    );
    return response.data;
  }
}