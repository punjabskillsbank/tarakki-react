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
import { adminOrganizationService } from "../../services/AdminOrganizationService";
import {
  boardResponseFactory,
  groupPayloadFactory,
  groupResponseFactory,
  MOCK_BOARD_ID,
  MOCK_NETWORK_ERROR,
  mappedTechOrganization,
  organizationMemberResponseFactory,
  taskResponseFactory,
  boardMemberAccessFactory,
  boardMemberResponseFactory,
  TASK_BOARD_ADD_GROUP_LABEL,
  TASK_BOARD_ADD_MEMBER_LABEL,
  TASK_BOARD_ADD_SELECTED_MEMBER_LABEL,
  TASK_BOARD_CREATE_FIRST_GROUP_LABEL,
  TASK_BOARD_EMPTY_MESSAGE,
  TASK_BOARD_GROUP_BY_LABEL,
  TASK_BOARD_GROUP_NAME_PLACEHOLDER,
  TASK_BOARD_NO_PRIORITY_LABEL,
  TASK_BOARD_PRIORITY_LABEL,
  TASK_BOARD_TASK_LOAD_FAILURE_MESSAGE,
} from "../../test-utils/factories";

jest.mock("../../services/BoardMemberService");
jest.mock("../../services/BoardService");
jest.mock("../../services/GroupService");
jest.mock("../../services/OrganizationServices");
jest.mock("../../services/AdminOrganizationService");
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
const mockedAdminOrganizationService = adminOrganizationService as jest.Mocked<
  typeof adminOrganizationService
>;
const mockedTaskService = TaskService as jest.Mocked<typeof TaskService>;

const board = boardResponseFactory();
const organizationMember = organizationMemberResponseFactory();

const configureLoadedBoard = () => {
  mockedTaskService.getTasks.mockResolvedValue([taskResponseFactory()]);
  mockedBoardService.getBoard.mockResolvedValue(board);
  mockedBoardMemberService.getBoardMembers.mockResolvedValue([]);
  mockedOrganizationService.getOrganizationMembers.mockResolvedValue([
    organizationMember,
  ]);
  mockedAdminOrganizationService.getOrganization.mockResolvedValue(
    mappedTechOrganization,
  );
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
      await screen.findByText(TASK_BOARD_EMPTY_MESSAGE),
    ).toBeInTheDocument();
    expect(mockedTaskService.getTasks).toHaveBeenCalledWith(MOCK_BOARD_ID);
    expect(mockedBoardService.getBoard).toHaveBeenCalledWith(MOCK_BOARD_ID);
    expect(mockedOrganizationService.getOrganizationMembers).toHaveBeenCalledWith(
      board.orgId,
    );
    expect(mockedAdminOrganizationService.getOrganization).toHaveBeenCalledWith(
      String(board.orgId),
    );
    expect(
      await screen.findByText(mappedTechOrganization.name),
    ).toBeInTheDocument();
    expect(screen.getByText(board.boardName)).toBeInTheDocument();
  });

  it("groups task cards by priority", async () => {
    const user = userEvent.setup();
    mockedGroupService.createGroup.mockResolvedValue(groupResponseFactory());

    render(<TaskBoard />);

    await user.click(
      await screen.findByRole("button", { name: TASK_BOARD_CREATE_FIRST_GROUP_LABEL }),
    );
    const payload = groupPayloadFactory();
    await user.type(screen.getByPlaceholderText(TASK_BOARD_GROUP_NAME_PLACEHOLDER), payload.groupName);
    await user.click(screen.getByRole("button", { name: TASK_BOARD_ADD_GROUP_LABEL }));
    await user.click(screen.getByRole("button", { name: TASK_BOARD_GROUP_BY_LABEL }));
    await user.click(screen.getByRole("menuitem", { name: TASK_BOARD_PRIORITY_LABEL }));

    expect(await screen.findByText(TASK_BOARD_NO_PRIORITY_LABEL)).toBeInTheDocument();
    expect(screen.getByText(taskResponseFactory().title)).toBeInTheDocument();
  });

  it("creates a group from the empty-board action", async () => {
    const user = userEvent.setup();
    const payload = groupPayloadFactory();
    const response = groupResponseFactory();
    mockedGroupService.createGroup.mockResolvedValue(response);

    render(<TaskBoard />);

    await user.click(
      await screen.findByRole("button", { name: TASK_BOARD_CREATE_FIRST_GROUP_LABEL }),
    );
    await user.type(screen.getByPlaceholderText(TASK_BOARD_GROUP_NAME_PLACEHOLDER), payload.groupName);
    await user.click(screen.getByRole("button", { name: TASK_BOARD_ADD_GROUP_LABEL }));

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
    mockedBoardMemberService.addOrgMemberToBoard.mockResolvedValue();

    render(<TaskBoard />);

    await user.click(
      await screen.findByRole("button", { name: TASK_BOARD_ADD_MEMBER_LABEL }),
    );
    await user.click(
      await screen.findByRole("button", { name: organizationMember.email }),
    );
    await user.click(screen.getByRole("button", { name: TASK_BOARD_ADD_SELECTED_MEMBER_LABEL }));

    await waitFor(() => {
      expect(mockedBoardMemberService.addOrgMemberToBoard).toHaveBeenCalledWith(
        MOCK_BOARD_ID,
        organizationMember.orgMemberId,
        boardMemberAccessFactory(organizationMember.email),
      );
    });
  });

  it("does not offer a member who is already on the board", async () => {
    mockedBoardMemberService.getBoardMembers.mockResolvedValue([
      boardMemberResponseFactory({ memberId: organizationMember.memberId }),
    ]);

    render(<TaskBoard />);

    await screen.findByText(TASK_BOARD_EMPTY_MESSAGE);
    await userEvent.click(screen.getByRole("button", { name: TASK_BOARD_ADD_MEMBER_LABEL }));

    expect(
      screen.queryByRole("button", { name: organizationMember.email }),
    ).not.toBeInTheDocument();
  });

  it("shows an error when board data cannot be loaded", async () => {
    mockedTaskService.getTasks.mockRejectedValueOnce(
      new Error(MOCK_NETWORK_ERROR),
    );

    render(<TaskBoard />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        TASK_BOARD_TASK_LOAD_FAILURE_MESSAGE,
      );
    });
  });
});
