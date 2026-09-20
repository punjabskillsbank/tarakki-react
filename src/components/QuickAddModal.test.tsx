import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { QuickAddModal } from "./QuickAddModal";
import {
  boardMemberFactory,
  taskBoardSectionFactory,
} from "../test-utils/factories";

describe("QuickAddModal", () => {
  it("creates an issue from the entered title", async () => {
    const user = userEvent.setup();
    const section = taskBoardSectionFactory();
    const onCreate = jest.fn();
    const onClose = jest.fn();

    render(
      <QuickAddModal
        initialSectionId={section.id}
        sections={[section]}
        members={[boardMemberFactory()]}
        onCreate={onCreate}
        onClose={onClose}
      />,
    );

    await user.type(screen.getByPlaceholderText("Issue summary..."), "New issue");
    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(onCreate).toHaveBeenCalledWith(
      expect.objectContaining({ title: "New issue", sectionId: section.id }),
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
