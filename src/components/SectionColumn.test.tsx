import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { SectionColumn } from "./SectionColumn";
import {
  taskBoardSectionFactory,
  taskBoardTaskFactory,
  TASK_BOARD_CREATE_ISSUE_LABEL,
  TASK_BOARD_DELETE_GROUP_LABEL,
  TASK_BOARD_ACTION_MENU_BUTTON_INDEX,
  TASK_BOARD_COLLAPSE_BUTTON_INDEX,
  TASK_BOARD_RENAMED_SECTION_NAME,
  TASK_BOARD_RENAME_LABEL,
} from "../test-utils/factories";

describe("SectionColumn", () => {
  it("renders its task and reports issue creation", () => {
    const section = taskBoardSectionFactory();
    const task = taskBoardTaskFactory({ sectionId: section.id });
    const onCreateTask = jest.fn();

    render(
      <SectionColumn
        section={section}
        tasks={[task]}
        draggingTaskId={null}
        dragTarget={null}
        onRename={jest.fn()}
        onToggleCollapse={jest.fn()}
        onDelete={jest.fn()}
        onDragOver={jest.fn()}
        onDrop={jest.fn()}
        onDragStart={jest.fn()}
        onDragEnd={jest.fn()}
        onSelectTask={jest.fn()}
        onCreateTask={onCreateTask}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: TASK_BOARD_CREATE_ISSUE_LABEL }),
    );

    expect(screen.getByText(task.title)).toBeInTheDocument();
    expect(onCreateTask).toHaveBeenCalledWith(section.id);
  });

  it("renames and deletes a section through its action menu", async () => {
    const user = userEvent.setup();
    const section = taskBoardSectionFactory();
    const onRename = jest.fn();
    const onDelete = jest.fn();

    render(
      <SectionColumn
        section={section}
        tasks={[]}
        draggingTaskId={null}
        dragTarget={null}
        onRename={onRename}
        onToggleCollapse={jest.fn()}
        onDelete={onDelete}
        onDragOver={jest.fn()}
        onDrop={jest.fn()}
        onDragStart={jest.fn()}
        onDragEnd={jest.fn()}
        onSelectTask={jest.fn()}
        onCreateTask={jest.fn()}
      />,
    );

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[TASK_BOARD_ACTION_MENU_BUTTON_INDEX]);
    await user.click(screen.getByRole("button", { name: TASK_BOARD_RENAME_LABEL }));
    const input = screen.getByDisplayValue(section.name);
    await user.clear(input);
    await user.type(input, TASK_BOARD_RENAMED_SECTION_NAME);
    await user.keyboard("{Enter}");
    expect(onRename).toHaveBeenCalledWith(section.id, TASK_BOARD_RENAMED_SECTION_NAME);

    await user.click(buttons[TASK_BOARD_ACTION_MENU_BUTTON_INDEX]);
    await user.click(
      screen.getByRole("button", { name: TASK_BOARD_DELETE_GROUP_LABEL }),
    );
    expect(onDelete).toHaveBeenCalledWith(section.id);
  });

  it("reports drag targets and hides content when collapsed", () => {
    const section = taskBoardSectionFactory({ collapsed: true });
    const onDragOver = jest.fn();
    const onDrop = jest.fn();

    const { container } = render(
      <SectionColumn
        section={section}
        tasks={[taskBoardTaskFactory({ sectionId: section.id })]}
        draggingTaskId={null}
        dragTarget={null}
        onRename={jest.fn()}
        onToggleCollapse={jest.fn()}
        onDelete={jest.fn()}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragStart={jest.fn()}
        onDragEnd={jest.fn()}
        onSelectTask={jest.fn()}
        onCreateTask={jest.fn()}
      />,
    );

    fireEvent.dragOver(container.firstChild!);
    fireEvent.drop(container.firstChild!);

    expect(onDragOver).toHaveBeenCalledWith(section.id);
    expect(onDrop).toHaveBeenCalledWith(section.id);
    expect(
      screen.queryByRole("button", { name: TASK_BOARD_CREATE_ISSUE_LABEL }),
    ).not.toBeInTheDocument();
  });

  it("reports a collapse toggle for its section", async () => {
    const user = userEvent.setup();
    const section = taskBoardSectionFactory();
    const onToggleCollapse = jest.fn();

    render(
      <SectionColumn
        section={section}
        tasks={[]}
        draggingTaskId={null}
        dragTarget={null}
        onRename={jest.fn()}
        onToggleCollapse={onToggleCollapse}
        onDelete={jest.fn()}
        onDragOver={jest.fn()}
        onDrop={jest.fn()}
        onDragStart={jest.fn()}
        onDragEnd={jest.fn()}
        onSelectTask={jest.fn()}
        onCreateTask={jest.fn()}
      />,
    );

    await user.click(
      screen.getAllByRole("button")[TASK_BOARD_COLLAPSE_BUTTON_INDEX],
    );

    expect(onToggleCollapse).toHaveBeenCalledWith(section.id);
  });
});
