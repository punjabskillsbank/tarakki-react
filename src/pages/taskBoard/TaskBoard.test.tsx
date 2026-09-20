import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import toast from "react-hot-toast";
import TaskBoard from "./TaskBoard";
import BoardMemberService from "../../services/BoardMemberService";
import BoardService from "../../services/BoardService";
import GroupService from "../../services/GroupService";
import OrganizationService from "../../services/OrganizationServices";
import TaskService from "../../services/TaskService";
import {
  boardResponseFactory,
  groupPayloadFactory,
  groupResponseFactory,
  MOCK_BOARD_ID,
  MOCK_NETWORK_ERROR,
  organizationMemberResponseFactory,
  taskResponseFactory,
} from "../../test-utils/factories";

jest.mock("../../services/BoardMemberService");
jest.mock("../../services/BoardService");
jest.mock("../../services/GroupService");
jest.mock("../../services/OrganizationServices");
jest.mock("../../services/TaskService");
jest.mock("react-hot-toast", () => ({ error: jest.fn() }));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ boardId: String(MOCK_BOARD_ID) }),
}));

const mockedBoardMemberService = BoardMemberService as jest.Mocked<
  typeof BoardMemberService
>;
const mockedBoardService = BoardService as jest.Mocked<typeof BoardService>;
const mockedGroupService = GroupService as jest.Mocked<typeof GroupService>;
const mockedOrganizationService = OrganizationService as jest.Mocked<
  typeof OrganizationService
>;
const mockedTaskService = TaskService as jest.Mocked<typeof TaskService>;

const board = boardResponseFactory();
const organizationMember = organizationMemberResponseFactory();

const configureLoadedBoard = () => {
  mockedTaskService.getTasks.mockResolvedValue([taskResponseFactory()]);
  mockedBoardService.getBoard.mockResolvedValue(board);
  mockedOrganizationService.getOrganizationMembers.mockResolvedValue([
    organizationMember,
  ]);
};

describe("TaskBoard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    localStorage.clear();
    localStorage.setItem("memberId", organizationMember.memberId);
    configureLoadedBoard();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("loads board data and shows the empty-board state", async () => {
    render(<TaskBoard />);

    expect(
      await screen.findByText("This board has no groups yet"),
    ).toBeInTheDocument();
    expect(mockedTaskService.getTasks).toHaveBeenCalledWith(MOCK_BOARD_ID);
    expect(mockedBoardService.getBoard).toHaveBeenCalledWith(MOCK_BOARD_ID);
    expect(mockedOrganizationService.getOrganizationMembers).toHaveBeenCalledWith(
      board.orgId,
    );
  });

  it("creates a group from the empty-board action", async () => {
    const user = userEvent.setup();
    const payload = groupPayloadFactory();
    const response = groupResponseFactory();
    mockedGroupService.createGroup.mockResolvedValue(response);

    render(<TaskBoard />);

    await user.click(
      await screen.findByRole("button", { name: "Create first group" }),
    );
    await user.type(screen.getByPlaceholderText("Group name..."), payload.groupName);
    await user.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => {
      expect(mockedGroupService.createGroup).toHaveBeenCalledWith(
        MOCK_BOARD_ID,
        payload,
      );
    });
    expect(screen.getByText(response.groupName.toUpperCase())).toBeInTheDocument();
  });

  it("adds an organization member to the board", async () => {
    const user = userEvent.setup();
    mockedBoardMemberService.addMember.mockResolvedValue();

    render(<TaskBoard />);

    await user.click(
      await screen.findByRole("button", { name: "Add Member" }),
    );
    await user.click(
      await screen.findByRole("button", { name: organizationMember.email }),
    );

    await waitFor(() => {
      expect(mockedBoardMemberService.addMember).toHaveBeenCalledWith(
        MOCK_BOARD_ID,
        organizationMember.memberId,
      );
    });
  });

  it("shows an error when board data cannot be loaded", async () => {
    mockedTaskService.getTasks.mockRejectedValueOnce(
      new Error(MOCK_NETWORK_ERROR),
    );

    render(<TaskBoard />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Tasks couldn't be loaded. Please try again.",
      );
    });
  });
});
