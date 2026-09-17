import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SectionColumn } from "./SectionColumn";
import {
  taskBoardSectionFactory,
  taskBoardTaskFactory,
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

    fireEvent.click(screen.getByRole("button", { name: /create issue/i }));

    expect(screen.getByText(task.title)).toBeInTheDocument();
    expect(onCreateTask).toHaveBeenCalledWith(section.id);
  });
});
