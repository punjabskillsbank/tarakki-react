import API from './axios';
import config from '../config/indexConfig';

export interface CreateBoardPayload {
  orgId: number;
  boardName: string;
  boardDesc: string;
  createdBy: string;
}

export type CreateBoardResponse = CreateBoardPayload;

export default class BoardService {
  static async createBoard(payload: CreateBoardPayload): Promise<CreateBoardResponse> {
    try {
      const baseURL = config.baseURLs.boardTaskService || "";
      const response = await API.post<CreateBoardResponse>(
        `${baseURL}${config.endpoints.boards}`,
        payload
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data || 'Failed to create board';
      throw new Error(typeof message === 'string' ? message : 'Failed to create board');
    }
  }
}
