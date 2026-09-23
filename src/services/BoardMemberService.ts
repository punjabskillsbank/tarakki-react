import API from "./axios";
import config from "../config/indexConfig";

export default class BoardMemberService {
  static async addOrgMemberToBoard(
    boardId: number,
    orgMemberId: number,
    payload: { email: string; canEdit: boolean; canView: boolean },
  ): Promise<void> {
    const baseURL = config.baseURLs.boardTaskService || "";
    await API.post(
      `${baseURL}${config.endpoints.boardMember(boardId, orgMemberId)}`,
      payload,
    );
  }

  static async addMember(boardId: number, memberId: string): Promise<void> {
    const baseURL = config.baseURLs.boardTaskService || "";
    await API.post(`${baseURL}${config.endpoints.boardMembers}`, {
      boardId,
      memberId,
    });
  }
}
