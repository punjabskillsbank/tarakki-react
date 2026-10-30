import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { BoardToolbar } from "./BoardToolbar";
import {
  TASK_BOARD_CREATE_LABEL,
  TASK_BOARD_CREATED_BY_LABEL,
  TASK_BOARD_FILTER_LABEL,
  TASK_BOARD_GROUP_BY_CREATOR,
  TASK_BOARD_GROUP_BY_LABEL,
  TASK_BOARD_PRIORITY_HIGH,
  TASK_BOARD_HIGH_PRIORITY_LABEL,
  TASK_BOARD_SEARCH_PLACEHOLDER,
  TASK_BOARD_SEARCH_QUERY,
  taskBoardToolbarDataFactory,
} from "../test-utils/factories";

describe("BoardToolbar", () => {
  it("reports create and search actions", async () => {
    const user = userEvent.setup();
    const onCreate = jest.fn();
    const onSearchChange = jest.fn();

    render(
      <BoardToolbar
        {...taskBoardToolbarDataFactory({ members: [] })}
        onSearchChange={onSearchChange}
        onAssigneeFilter={jest.fn()}
        onPriorityFilter={jest.fn()}
        onGroupByChange={jest.fn()}
        onCreate={onCreate}
      />,
    );

    await user.click(screen.getByRole("button", { name: TASK_BOARD_CREATE_LABEL }));
    await user.type(
      screen.getByPlaceholderText(TASK_BOARD_SEARCH_PLACEHOLDER),
      TASK_BOARD_SEARCH_QUERY,
    );

    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(onSearchChange).toHaveBeenCalled();
  });

  it("lets the user select a task grouping", async () => {
    const user = userEvent.setup();
    const onGroupByChange = jest.fn();

    render(
      <BoardToolbar
        {...taskBoardToolbarDataFactory({ members: [] })}
        onSearchChange={jest.fn()}
        onAssigneeFilter={jest.fn()}
        onPriorityFilter={jest.fn()}
        onGroupByChange={onGroupByChange}
        onCreate={jest.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: TASK_BOARD_GROUP_BY_LABEL }));
    await user.click(screen.getByRole("menuitem", { name: TASK_BOARD_CREATED_BY_LABEL }));

    expect(onGroupByChange).toHaveBeenCalledWith(TASK_BOARD_GROUP_BY_CREATOR);
  });

  it("reports priority selection", async () => {
    const user = userEvent.setup();
    const onPriorityFilter = jest.fn();

    render(
      <BoardToolbar
        {...taskBoardToolbarDataFactory({ members: [] })}
        onSearchChange={jest.fn()}
        onAssigneeFilter={jest.fn()}
        onPriorityFilter={onPriorityFilter}
        onGroupByChange={jest.fn()}
        onCreate={jest.fn()}
      />,
    );

    await user.hover(screen.getByRole("button", { name: TASK_BOARD_FILTER_LABEL }));
    await user.click(screen.getByRole("button", { name: TASK_BOARD_HIGH_PRIORITY_LABEL }));

    expect(onPriorityFilter).toHaveBeenCalledWith(TASK_BOARD_PRIORITY_HIGH);
  });

  it("reports assignee filter selection", async () => {
    const user = userEvent.setup();
    const toolbarData = taskBoardToolbarDataFactory();
    const onAssigneeFilter = jest.fn();
    const member = toolbarData.members[0];

    render(
      <BoardToolbar
        {...toolbarData}
        onSearchChange={jest.fn()}
        onAssigneeFilter={onAssigneeFilter}
        onPriorityFilter={jest.fn()}
        onGroupByChange={jest.fn()}
        onCreate={jest.fn()}
      />,
    );

    await user.click(screen.getByTitle(member.name).closest("button")!);

    expect(onAssigneeFilter).toHaveBeenCalledWith(member.id);
  });
});
