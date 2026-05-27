import BoardService from './BoardService';
import API from './axios';
import { boardPayloadFactory } from '../test-utils/factories';

jest.mock('./axios');
const mockedAPI = API as jest.Mocked<typeof API>;

describe('BoardService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBoard', () => {
    const boardPayload = boardPayloadFactory();

    it('successfully creates a board', async () => {
      const responseData = { id: 1, ...boardPayload };
      mockedAPI.post.mockResolvedValueOnce({ data: responseData });

      const result = await BoardService.createBoard(boardPayload);

      expect(mockedAPI.post).toHaveBeenCalledWith('/boards', boardPayload);
      expect(result).toEqual(responseData);
    });

    it('throws an error with message from response on failure', async () => {
      const errorMessage = 'Board name already exists';
      mockedAPI.post.mockRejectedValueOnce({
        response: {
          data: { message: errorMessage },
        },
      });

      await expect(BoardService.createBoard(boardPayload)).rejects.toThrow(errorMessage);
    });

    it('throws a default error message on failure if no message in response', async () => {
      mockedAPI.post.mockRejectedValueOnce(new Error('Network Error'));

      await expect(BoardService.createBoard(boardPayload)).rejects.toThrow('Failed to create board');
    });
  });
});
