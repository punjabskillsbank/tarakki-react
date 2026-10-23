import API from "./axios";
import config from "../config/indexConfig";

export type BoardMemberResponse = {
  boardMemberId: number;
  boardId: number;
  memberId: string;
  role: string;
  canEdit: boolean;
  canView: boolean;
};

export default class BoardMemberService {
  static async getBoardMembers(boardId: number): Promise<BoardMemberResponse[]> {
    const baseURL = config.baseURLs.boardTaskService || "";
    const response = await API.get<BoardMemberResponse[]>(
      `${baseURL}${config.endpoints.boardMembersForBoard(boardId)}`,
    );
    return response.data;
  }

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
