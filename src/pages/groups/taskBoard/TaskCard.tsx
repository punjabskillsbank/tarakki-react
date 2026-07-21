import { GripVertical } from "lucide-react";
import { PRIORITY_CFG } from "./constants";
import { Avatar } from "./Avatar";
import type { Task } from "./types";
import { formatDate } from "./utils";

type Props = { task: Task; onDragStart: () => void; onDragEnd: () => void; onClick: () => void; isDragging: boolean };

export function TaskCard({ task, onDragStart, onDragEnd, onClick, isDragging }: Props) {
  const due = formatDate(task.dueDate);
  const priority = PRIORITY_CFG[task.priority];
  return <div draggable onDragStart={onDragStart} onDragEnd={onDragEnd} onClick={onClick} className={`group relative cursor-pointer select-none rounded-lg border border-[#E6E9EF] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-all duration-150 hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)] ${isDragging ? "scale-95 rotate-1 opacity-40" : "hover:-translate-y-px"}`}><div className="px-3 py-3"><p className="mb-2.5 line-clamp-3 text-[12.5px] font-medium leading-snug text-[#1F2937]">{task.title}</p><div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="font-mono text-[10.5px] text-[#C4C4C4]">{task.ticketNum}</span><span style={{ color: priority.color }} title={priority.label}>{priority.icon}</span>{due && <span className={`text-[10.5px] ${due.overdue ? "text-[#E2445C]" : "text-[#9CA3AF]"}`}>{due.text}</span>}</div>{task.assignee && <Avatar member={task.assignee} size={22} />}</div></div><div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-60"><GripVertical size={12} className="text-[#C4C4C4]" /></div></div>;
}
