import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { AddMemberModal } from "./AddMemberModal";
import {
  boardMemberFactory,
  TASK_BOARD_ADD_SELECTED_MEMBER_LABEL,
  TASK_BOARD_EDIT_ACCESS_LABEL,
  TASK_BOARD_EMPTY_MEMBERS_MESSAGE,
  addMemberModalSubmissionErrorFactory,
} from "../test-utils/factories";

describe("AddMemberModal", () => {
  it("adds the selected member with view-only access and closes", async () => {
    const user = userEvent.setup();
    const member = boardMemberFactory();
    const onAdd = jest.fn().mockResolvedValue(undefined);
    const onClose = jest.fn();

    render(
      <AddMemberModal
        availableMembers={[member]}
        onAdd={onAdd}
        onClose={onClose}
      />,
    );

    await user.click(screen.getByRole("button", { name: member.name }));
    await user.click(
      screen.getByRole("button", { name: TASK_BOARD_ADD_SELECTED_MEMBER_LABEL }),
    );

    expect(onAdd).toHaveBeenCalledWith(member, false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("adds the selected member with edit access when enabled", async () => {
    const user = userEvent.setup();
    const member = boardMemberFactory();
    const onAdd = jest.fn().mockResolvedValue(undefined);

    render(
      <AddMemberModal
        availableMembers={[member]}
        onAdd={onAdd}
        onClose={jest.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: member.name }));
    await user.click(
      screen.getByRole("checkbox", {
        name: TASK_BOARD_EDIT_ACCESS_LABEL,
      }),
    );
    await user.click(
      screen.getByRole("button", { name: TASK_BOARD_ADD_SELECTED_MEMBER_LABEL }),
    );

    expect(onAdd).toHaveBeenCalledWith(member, true);
  });

  it("disables submission until a member is selected", () => {
    render(
      <AddMemberModal
        availableMembers={[boardMemberFactory()]}
        onAdd={jest.fn()}
        onClose={jest.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: TASK_BOARD_ADD_SELECTED_MEMBER_LABEL }),
    ).toBeDisabled();
  });

  it("shows the empty-state message when no organization members are available", () => {
    render(
      <AddMemberModal
        availableMembers={[]}
        onAdd={jest.fn()}
        onClose={jest.fn()}
      />,
    );

    expect(screen.getByText(TASK_BOARD_EMPTY_MEMBERS_MESSAGE)).toBeInTheDocument();
  });

  it("keeps the modal open when adding a member fails", async () => {
    const user = userEvent.setup();
    const member = boardMemberFactory();
    const onAdd = jest.fn().mockRejectedValue(addMemberModalSubmissionErrorFactory());
    const onClose = jest.fn();

    render(
      <AddMemberModal
        availableMembers={[member]}
        onAdd={onAdd}
        onClose={onClose}
      />,
    );

    await user.click(screen.getByRole("button", { name: member.name }));
    await user.click(
      screen.getByRole("button", { name: TASK_BOARD_ADD_SELECTED_MEMBER_LABEL }),
    );

    expect(onClose).not.toHaveBeenCalled();
  });
});
