import API from './axios';
import config from '../config/indexConfig';

export default class MemberServices {
  static async createMember(memberData: {
    firstName: string;
    lastName: string;
    email?: string;
    profilePhotoS3Key: string;
    accountStatus: string;
  }) {
    try {
      const response = await API.post(config.endpoints.members, memberData);
      return response.data;
    } catch (error: any) {
      console.log('Error creating member at members:', error.response?.data?.message || error.message);
      const message = error.response?.data?.message || error.response?.data || 'Failed to create member';
      throw new Error(typeof message === 'string' ? message : 'Failed to create member');
    }
  }
}
