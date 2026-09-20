import API from "./axios";
import config from "../config/indexConfig";
import { isAxiosError, type AxiosResponse } from "axios";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type MemberSummary = {
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePhotoS3Key: string;
  accountStatus: string;
};

export type LoginResponse = {
  token: string;
  tokenType: string;
  expiresIn: number;
  member: MemberSummary;
};

export type LoginError = Error & { response?: AxiosResponse };

export default class AuthService {
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const baseURL = config.baseURLs.memberService || "";
      const response = await API.post(
        `${baseURL}${config.endpoints.login}`,
        credentials
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = isAxiosError(error) ? error : undefined;
      const message =
        axiosError?.response?.data?.message ||
        axiosError?.response?.data ||
        "Failed to log in";

      const customError: LoginError = new Error(
        typeof message === "string" ? message : "Failed to log in"
      );
      customError.response = axiosError?.response;
      throw customError;
    }
  }
}
