import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TaskDetailsModal } from "./TaskDetailsModal";
import {
  boardMemberFactory,
  taskBoardSectionFactory,
  taskBoardTaskFactory,
} from "../test-utils/factories";

describe("TaskDetailsModal", () => {
  it("renders task details and reports title updates", () => {
    const section = taskBoardSectionFactory();
    const task = taskBoardTaskFactory({ sectionId: section.id });
    const onUpdate = jest.fn();

    render(
      <TaskDetailsModal
        task={task}
        sections={[section]}
        members={[boardMemberFactory()]}
        onClose={jest.fn()}
        onUpdate={onUpdate}
      />,
    );

    fireEvent.click(screen.getByRole("heading", { name: task.title }));
    const titleInput = screen.getByDisplayValue(task.title);
    fireEvent.change(titleInput, { target: { value: `${task.title} updated` } });
    fireEvent.blur(titleInput);

    expect(screen.getByText(task.ticketNum)).toBeInTheDocument();
    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ title: `${task.title} updated` }),
    );
  });
});
