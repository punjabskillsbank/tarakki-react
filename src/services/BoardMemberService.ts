import API from "./axios";
import config from "../config/indexConfig";

export default class BoardMemberService {
  static async addMember(boardId: number, memberId: string): Promise<void> {
    const baseURL = config.baseURLs.boardTaskService || "";
    await API.post(`${baseURL}${config.endpoints.boardMembers}`, {
      boardId,
      memberId,
    });
  }
}
