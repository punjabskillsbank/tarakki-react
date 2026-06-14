import MemberServices from './MemberServices';
import API from './axios';
import { memberFactory } from '../test-utils/factories';
import config from '../config/indexConfig';

jest.mock('./axios');
const mockedAPI = API as jest.Mocked<typeof API>;

describe('MemberServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createMember', () => {
    const memberData = memberFactory();

    it('successfully creates a member', async () => {
      const responseData = { id: 1, ...memberData };
      mockedAPI.post.mockResolvedValueOnce({ data: responseData });

      const result = await MemberServices.createMember(memberData);

      expect(mockedAPI.post).toHaveBeenCalledWith(config.endpoints.members, memberData);
      expect(result).toEqual(responseData);
    });

    it('throws an error with message from response on failure', async () => {
      const errorMessage = 'Email already exists';
      mockedAPI.post.mockRejectedValueOnce({
        response: {
          data: { message: errorMessage },
        },
      });

      await expect(MemberServices.createMember(memberData)).rejects.toThrow(errorMessage);
    });

    it('throws a default error message on failure if no message in response', async () => {
      mockedAPI.post.mockRejectedValueOnce(new Error('Network Error'));

      await expect(MemberServices.createMember(memberData)).rejects.toThrow('Failed to create member');
    });
  });
});
