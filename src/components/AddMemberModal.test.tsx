import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { AddMemberModal } from "./AddMemberModal";
import { boardMemberFactory } from "../test-utils/factories";

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
      screen.getByRole("button", { name: /add selected member/i }),
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
        name: /allow this member to edit the board/i,
      }),
    );
    await user.click(
      screen.getByRole("button", { name: /add selected member/i }),
    );

    expect(onAdd).toHaveBeenCalledWith(member, true);
  });
});
