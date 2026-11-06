import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { QuickAddModal } from "./QuickAddModal";
import {
  boardMemberFactory,
  QUICK_ADD_MODAL_ASSIGNEE_LABEL,
  QUICK_ADD_MODAL_BLANK_TITLE,
  QUICK_ADD_MODAL_CANCEL_LABEL,
  QUICK_ADD_MODAL_DUE_DATE,
  QUICK_ADD_MODAL_DUE_DATE_LABEL,
  QUICK_ADD_MODAL_GROUP_LABEL,
  QUICK_ADD_MODAL_PRIORITY_LABEL,
  QUICK_ADD_MODAL_TITLE,
  QUICK_ADD_MODAL_TITLE_PLACEHOLDER,
  QUICK_ADD_MODAL_WHITESPACE_TITLE,
  quickAddModalPayloadFactory,
  TASK_BOARD_CREATE_LABEL,
  TASK_BOARD_PRIORITY_HIGH,
  taskBoardSectionFactory,
} from "../test-utils/factories";

describe("QuickAddModal", () => {
  it("creates an issue with the entered values and trims the title", async () => {
    const user = userEvent.setup();
    const section = taskBoardSectionFactory();
    const member = boardMemberFactory();
    const onCreate = jest.fn().mockResolvedValue(undefined);
    const onClose = jest.fn();

    render(
      <QuickAddModal
        initialSectionId={section.id}
        sections={[section]}
        members={[member]}
        onCreate={onCreate}
        onClose={onClose}
      />,
    );

    await user.type(
      screen.getByPlaceholderText(QUICK_ADD_MODAL_TITLE_PLACEHOLDER),
      QUICK_ADD_MODAL_WHITESPACE_TITLE,
    );
    await user.selectOptions(
      screen.getByLabelText(QUICK_ADD_MODAL_ASSIGNEE_LABEL),
      member.id,
    );
    await user.selectOptions(
      screen.getByLabelText(QUICK_ADD_MODAL_PRIORITY_LABEL),
      TASK_BOARD_PRIORITY_HIGH,
    );
    fireEvent.change(screen.getByLabelText(QUICK_ADD_MODAL_DUE_DATE_LABEL), {
      target: { value: QUICK_ADD_MODAL_DUE_DATE },
    });
    await user.click(screen.getByRole("button", { name: TASK_BOARD_CREATE_LABEL }));

    expect(onCreate).toHaveBeenCalledWith(
      quickAddModalPayloadFactory({
        title: QUICK_ADD_MODAL_TITLE,
        sectionId: section.id,
        assignee: member,
        dueDate: QUICK_ADD_MODAL_DUE_DATE,
        priority: TASK_BOARD_PRIORITY_HIGH,
      }),
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("uses the first section when no initial section is provided", () => {
    const section = taskBoardSectionFactory();

    render(
      <QuickAddModal
        initialSectionId={null}
        sections={[section]}
        members={[]}
        onCreate={jest.fn().mockResolvedValue(undefined)}
        onClose={jest.fn()}
      />,
    );

    expect(screen.getByLabelText(QUICK_ADD_MODAL_GROUP_LABEL)).toHaveValue(
      section.id,
    );
  });

  it("does not create an issue when the title is blank", async () => {
    const user = userEvent.setup();
    const section = taskBoardSectionFactory();
    const onCreate = jest.fn().mockResolvedValue(undefined);
    const onClose = jest.fn();

    render(
      <QuickAddModal
        initialSectionId={section.id}
        sections={[section]}
        members={[]}
        onCreate={onCreate}
        onClose={onClose}
      />,
    );

    const createButton = screen.getByRole("button", {
      name: TASK_BOARD_CREATE_LABEL,
    });
    expect(createButton).toBeDisabled();

    await user.type(
      screen.getByPlaceholderText(QUICK_ADD_MODAL_TITLE_PLACEHOLDER),
      QUICK_ADD_MODAL_BLANK_TITLE,
    );

    expect(createButton).toBeDisabled();
    await user.click(createButton);
    expect(onCreate).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("closes when the cancel button or backdrop is clicked", async () => {
    const user = userEvent.setup();
    const section = taskBoardSectionFactory();
    const onClose = jest.fn();
    const { container } = render(
      <QuickAddModal
        initialSectionId={section.id}
        sections={[section]}
        members={[]}
        onCreate={jest.fn().mockResolvedValue(undefined)}
        onClose={onClose}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: QUICK_ADD_MODAL_CANCEL_LABEL }),
    );
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.click(container.firstChild!);
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
