import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TaskCard } from "./TaskCard";
import { taskBoardTaskFactory } from "../test-utils/factories";

describe("TaskCard", () => {
  it("renders the task and reports click and drag actions", () => {
    const task = taskBoardTaskFactory();
    const onClick = jest.fn();
    const onDragStart = jest.fn();
    const onDragEnd = jest.fn();

    render(
      <TaskCard
        task={task}
        onClick={onClick}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        isDragging={false}
      />,
    );

    const card = screen.getByText(task.title);
    fireEvent.click(card);
    fireEvent.dragStart(card);
    fireEvent.dragEnd(card);

    expect(screen.getByText(task.ticketNum)).toBeInTheDocument();
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onDragStart).toHaveBeenCalledTimes(1);
    expect(onDragEnd).toHaveBeenCalledTimes(1);
  });
});
