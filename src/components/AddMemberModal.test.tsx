import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { AddMemberModal } from "./AddMemberModal";
import { boardMemberFactory } from "../test-utils/factories";

describe("AddMemberModal", () => {
  it("adds the selected member and closes", async () => {
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

    expect(onAdd).toHaveBeenCalledWith(member);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
