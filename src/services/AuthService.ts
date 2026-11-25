import API from "./axios";
import config from "../config/indexConfig";

export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  member: {
    memberId: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default class AuthService {
  static async login(email: string, password: string): Promise<LoginResponse> {
    const response = await API.post<LoginResponse>(
      `${config.baseURLs.memberService}${config.endpoints.login}`,
      {
      email,
      password,
      },
    );
    return response.data;
  }
}
