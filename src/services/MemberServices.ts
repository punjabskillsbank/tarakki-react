import API from './axios';

export default class MemberServices {
  static async createMember(memberData: {
    firstName: string;
    lastName: string;
    email?: string;
    profilePhotoS3Key: string;
    accountStatus: string;
  }) {
    try {
      const response = await API.post('/members', memberData);
      return response.data;
    } catch (error: any) {
      console.log('Error creating member:', error);
      throw new Error(error.response?.data?.message || 'Failed to create member');
    }
  }
}
