import API from "./axios";
import config from "../config/indexConfig";
import { isAxiosError } from "axios";

export default class MemberServices {
  static async createMember(memberData: {
    firstName: string;
    lastName: string;
    email?: string;
    passwordHash?: string;
    profilePhotoS3Key: string;
    accountStatus: string;
  }) {
    try {
      const baseURL = config.baseURLs.memberService || "";
      const response = await API.post(
        `${baseURL}${config.endpoints.members}`,
        memberData
      );
      return response.data;
    } catch (error: any) {
      console.log(
        "Error creating member at members:",
        error.response?.data?.message || error.message
      );
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to create member";
      throw new Error(
        typeof message === "string" ? message : "Failed to create member"
      );
    }
  }
  static async getMemberById(memberId: string) {
    try {
      const baseURL = config.baseURLs.memberService || "";
      const response = await API.get(
        `${baseURL}${config.endpoints.members}/${memberId}`,
        { headers: { "Cache-Control": "no-cache" } }
      );
      return response.data;
    } catch (error: any) {
      console.log(
        "Error fetching member details:",
        error.response?.data?.message || error.message
      );
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to fetch member details";
      throw new Error(
        typeof message === "string" ? message : "Failed to fetch member details"
      );
    }
  }
  static async getMemberByEmail(email: string) {
    try {
      const baseURL = config.baseURLs.memberService || "";
      const response = await API.get(
        `${baseURL}${config.endpoints.members}/email/${email}`,
        { headers: { "Cache-Control": "no-cache" } }
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = isAxiosError(error) ? error : undefined;
      const message =
        axiosError?.response?.data?.message ||
        axiosError?.response?.data ||
        "Failed to fetch member details";

      const customError = new Error(
        typeof message === "string" ? message : "Failed to fetch member details"
      ) as any;
      customError.response = axiosError?.response;
      throw customError;
    }
  }
}
