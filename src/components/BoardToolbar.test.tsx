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
        onSearchChange={onSearchChange}
        onAssigneeFilter={jest.fn()}
        onPriorityFilter={jest.fn()}
        onCreate={onCreate}
      />,
    );

    await user.click(screen.getByRole("button", { name: /create/i }));
    await user.type(screen.getByPlaceholderText("Search board"), "query");

    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(onSearchChange).toHaveBeenCalled();
  });
});
