import API from './axios';

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
      const response = await API.post<CreateBoardResponse>('/boards', payload);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data || 'Failed to create board';
      throw new Error(typeof message === 'string' ? message : 'Failed to create board');
    }
  }
}
