import API from './axios';

export interface CreateBoardPayload {
  orgId: number;
  boardName: string;
  boardDesc: string;
  createdBy: string;
}

export default class BoardService {
  static async createBoard(payload: CreateBoardPayload) {
    try {
      const response = await API.post('/boards', payload);
      return response.data;
    } catch (error: any) {
      console.log('Error creating board:', error.response?.data?.message || error.message);
      const message = error.response?.data?.message || error.response?.data || 'Failed to create board';
      throw new Error(typeof message === 'string' ? message : 'Failed to create board');
    }
  }
}
