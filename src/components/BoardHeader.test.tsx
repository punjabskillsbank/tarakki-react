import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { BoardHeader } from "./BoardHeader";
import {
  TASK_BOARD_ADD_MEMBER_LABEL,
  TASK_BOARD_WORKSPACE_LABEL,
  taskBoardHeaderDataFactory,
} from "../test-utils/factories";

describe("BoardHeader", () => {
  it("calls onAddMember when the add member button is clicked", async () => {
    const user = userEvent.setup();
    const onAddMember = jest.fn();

    render(
      <BoardHeader
        {...taskBoardHeaderDataFactory()}
        onAddMember={onAddMember}
      />,
    );

    await user.click(screen.getByRole("button", { name: TASK_BOARD_ADD_MEMBER_LABEL }));

    expect(onAddMember).toHaveBeenCalledTimes(1);
  });

  it("shows the organization, workspace, and board names", () => {
    const headerData = taskBoardHeaderDataFactory({ members: [] });
    render(
      <BoardHeader
        {...headerData}
        onAddMember={jest.fn()}
      />,
    );

    expect(screen.getByText(headerData.orgName)).toBeInTheDocument();
    expect(screen.getByText(TASK_BOARD_WORKSPACE_LABEL)).toBeInTheDocument();
    expect(screen.getByText(headerData.boardName)).toBeInTheDocument();
  });
});
