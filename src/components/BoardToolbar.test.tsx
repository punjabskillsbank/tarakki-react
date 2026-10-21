import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { BoardToolbar } from "./BoardToolbar";

describe("BoardToolbar", () => {
  it("reports create and search actions", async () => {
    const user = userEvent.setup();
    const onCreate = jest.fn();
    const onSearchChange = jest.fn();

    render(
      <BoardToolbar
        members={[]}
        search=""
        assigneeFilter={null}
        priorityFilter={null}
        groupBy="none"
        onSearchChange={onSearchChange}
        onAssigneeFilter={jest.fn()}
        onPriorityFilter={jest.fn()}
        onGroupByChange={jest.fn()}
        onCreate={onCreate}
      />,
    );

    await user.click(screen.getByRole("button", { name: /create/i }));
    await user.type(screen.getByPlaceholderText("Search board"), "query");

    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(onSearchChange).toHaveBeenCalled();
  });

  it("lets the user select a task grouping", async () => {
    const user = userEvent.setup();
    const onGroupByChange = jest.fn();

    render(
      <BoardToolbar
        members={[]}
        search=""
        assigneeFilter={null}
        priorityFilter={null}
        groupBy="none"
        onSearchChange={jest.fn()}
        onAssigneeFilter={jest.fn()}
        onPriorityFilter={jest.fn()}
        onGroupByChange={onGroupByChange}
        onCreate={jest.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /group by/i }));
    await user.click(screen.getByRole("menuitem", { name: "Created by" }));

    expect(onGroupByChange).toHaveBeenCalledWith("creator");
  });
});
