import { MessageSquare, User, X } from "lucide-react";
import { useState } from "react";
import { Avatar } from "./Avatar";
import { LABELS, PRIORITY_CFG, STATUS_CFG } from "./constants";
import type { Member, Priority, Section, Task, TaskStatus } from "./types";

type Props = {
  task: Task;
  sections: Section[];
  members: Member[];
  onClose: () => void;
  onUpdate: (task: Task) => void;
};

export function TaskDetailsModal({
  task,
  sections,
  members,
  onClose,
  onUpdate,
}: Props) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const section = sections.find((item) => item.id === task.sectionId);
  const saveTitle = () => {
    setEditingTitle(false);
    onUpdate({ ...task, title });
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="mx-4 flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-[#E6E9EF] bg-white shadow-2xl">
        <div className="flex items-start gap-3 border-b border-[#E6E9EF] px-6 py-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="rounded border border-[#E6E9EF] bg-[#F6F7FB] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#9CA3AF]">
                {task.ticketNum}
              </span>
              <span className="text-[11px] text-[#C4C4C4]">&middot;</span>
              <span className="text-[11px] text-[#9CA3AF]">
                Punjab Skills Bank &middot; {section?.name}
              </span>
            </div>
            {editingTitle ? (
              <input
                autoFocus
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                onBlur={saveTitle}
                onKeyDown={(event) => event.key === "Enter" && saveTitle()}
                className="w-full border-b-2 border-[#0073EA] bg-transparent text-[15px] font-semibold leading-snug text-[#1F2937] outline-none"
              />
            ) : (
              <h2
                onClick={() => setEditingTitle(true)}
                className="cursor-text text-[15px] font-semibold leading-snug text-[#1F2937] transition-colors hover:text-[#0073EA]"
              >
                {title}
              </h2>
            )}
          </div>
          <button
            onClick={onClose}
            className="mt-0.5 flex-shrink-0 rounded-lg p-1.5 text-[#9CA3AF] transition-colors hover:bg-[#F6F7FB] hover:text-[#1F2937]"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-4">
            <div>
              <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-widest text-[#C4C4C4]">
                Description
              </p>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                onBlur={() => onUpdate({ ...task, description })}
                rows={4}
                placeholder="Add a description..."
                className="w-full resize-none rounded-lg border border-[#E6E9EF] bg-[#F6F7FB] p-3 text-[13px] text-[#1F2937] outline-none transition-colors focus:border-[#0073EA]"
              />
            </div>
            <div>
              <p className="mb-2 text-[10.5px] font-bold uppercase tracking-widest text-[#C4C4C4]">
                Labels
              </p>
              <div className="flex flex-wrap gap-1.5">
                {LABELS.map((label) => {
                  const active = task.labels.some(
                    (taskLabel) => taskLabel.id === label.id,
                  );
                  return (
                    <button
                      key={label.id}
                      onClick={() =>
                        onUpdate({
                          ...task,
                          labels: active
                            ? task.labels.filter(
                                (taskLabel) => taskLabel.id !== label.id,
                              )
                            : [...task.labels, label],
                        })
                      }
                      className="rounded-md px-2.5 py-1 text-[11px] font-semibold text-white transition-all"
                      style={{
                        background: label.color,
                        opacity: active ? 1 : 0.3,
                      }}
                    >
                      {label.name}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-widest text-[#C4C4C4]">
                Activity
              </p>
              <div className="flex items-center gap-2 rounded-lg border border-[#E6E9EF] bg-[#F6F7FB] px-3 py-2.5 text-[12px] text-[#9CA3AF]">
                <MessageSquare size={13} />
                {task.comments} comment{task.comments !== 1 ? "s" : ""} &middot;
                Write a comment...
              </div>
            </div>
          </div>
          <aside className="w-48 flex-shrink-0 space-y-5 overflow-y-auto rounded-br-xl border-l border-[#E6E9EF] bg-[#FAFBFC] px-4 py-4">
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#C4C4C4]">
                Status
              </p>
              {(Object.keys(STATUS_CFG) as TaskStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => onUpdate({ ...task, status })}
                  className={`mb-0.5 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11.5px] transition-colors ${task.status === status ? "bg-[#E6F0FF] font-semibold text-[#0073EA]" : "text-[#4B5563] hover:bg-[#F3F4F6]"}`}
                >
                  <span style={{ color: STATUS_CFG[status].color }}>
                    {STATUS_CFG[status].icon}
                  </span>
                  {STATUS_CFG[status].label}
                </button>
              ))}
            </div>
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#C4C4C4]">
                Priority
              </p>
              {(
                ["critical", "high", "medium", "low", "none"] as Priority[]
              ).map((priority) => (
                <button
                  key={priority}
                  onClick={() => onUpdate({ ...task, priority })}
                  className={`mb-0.5 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11.5px] transition-colors ${task.priority === priority ? "bg-[#E6F0FF] font-semibold text-[#0073EA]" : "text-[#4B5563] hover:bg-[#F3F4F6]"}`}
                >
                  <span style={{ color: PRIORITY_CFG[priority].color }}>
                    {PRIORITY_CFG[priority].icon}
                  </span>
                  {PRIORITY_CFG[priority].label}
                </button>
              ))}
            </div>
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#C4C4C4]">
                Assignee
              </p>
              <button
                onClick={() => onUpdate({ ...task, assignee: null })}
                className={`mb-0.5 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[11.5px] transition-colors ${!task.assignee ? "bg-[#E6F0FF] font-semibold text-[#0073EA]" : "text-[#4B5563] hover:bg-[#F3F4F6]"}`}
              >
                <User size={12} className="text-[#C4C4C4]" /> Unassigned
              </button>
              {members.map((member) => (
                <button
                  key={member.id}
                  onClick={() => onUpdate({ ...task, assignee: member })}
                  className={`mb-0.5 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[11.5px] transition-colors ${task.assignee?.id === member.id ? "bg-[#E6F0FF] font-semibold text-[#0073EA]" : "text-[#4B5563] hover:bg-[#F3F4F6]"}`}
                >
                  <Avatar member={member} size={18} />
                  {member.name.split(" ")[0]}
                </button>
              ))}
            </div>
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#C4C4C4]">
                Due Date
              </p>
              <input
                type="date"
                value={task.dueDate ?? ""}
                onChange={(event) =>
                  onUpdate({ ...task, dueDate: event.target.value || null })
                }
                className="w-full rounded-lg border border-[#E6E9EF] bg-white px-2 py-1.5 text-[11.5px] text-[#1F2937] outline-none transition-colors focus:border-[#0073EA]"
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
