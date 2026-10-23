import { Filter, Plus, Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { Avatar } from "./Avatar";
import { PRIORITY_CFG } from "../constants/taskBoardConstant";
import type { Member, Priority } from "../types/taskBoardtypes";

export type TaskGroupBy = "none" | "assignee" | "creator" | "priority";

type Props = {
  members: Member[];
  search: string;
  assigneeFilter: string | null;
  priorityFilter: Priority | null;
  groupBy: TaskGroupBy;
  onSearchChange: (value: string) => void;
  onAssigneeFilter: (id: string | null) => void;
  onPriorityFilter: (priority: Priority | null) => void;
  onGroupByChange: (groupBy: TaskGroupBy) => void;
  onCreate: () => void;
};

export function BoardToolbar({
  members,
  search,
  assigneeFilter,
  priorityFilter,
  groupBy,
  onSearchChange,
  onAssigneeFilter,
  onPriorityFilter,
  onGroupByChange,
  onCreate,
}: Props) {
  const [showGroupMenu, setShowGroupMenu] = useState(false);

  return (
    <div className="flex flex-shrink-0 items-center gap-2 border-b border-[#E6E9EF] bg-white px-5 py-2.5">
      <button
        onClick={onCreate}
        className="flex items-center gap-1.5 rounded-md bg-[#0073EA] px-3 py-1.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#0060C0]"
      >
        <Plus size={14} /> Create
      </button>
      <div className="mx-1 h-4 w-px bg-[#E6E9EF]" />
      <div className="relative">
        <Search
          size={13}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#C4C4C4]"
        />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search board"
          className="w-44 rounded-md border border-[#E6E9EF] bg-[#F6F7FB] py-1.5 pl-8 pr-8 text-[12px] text-[#1F2937] outline-none transition-colors placeholder:text-[#C4C4C4] focus:border-[#0073EA]"
        />
      </div>
      <div className="ml-1 flex items-center -space-x-1">
        {members.map((member) => (
          <button
            key={member.id}
            onClick={() =>
              onAssigneeFilter(assigneeFilter === member.id ? null : member.id)
            }
            className={`relative transition-all ${assigneeFilter === member.id ? "z-10 scale-110 rounded-full ring-2 ring-[#0073EA] ring-offset-1" : "hover:z-10 hover:scale-110"}`}
          >
            <Avatar member={member} size={26} />
          </button>
        ))}
      </div>
      <div className="group relative ml-1">
        <button
          className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[12px] transition-colors ${priorityFilter ? "border-[#0073EA]/30 bg-[#E6F0FF] font-semibold text-[#0073EA]" : "border-[#E6E9EF] bg-white text-[#6B7280] hover:bg-[#F3F4F6]"}`}
        >
          <Filter size={12} />
          Filter
          {priorityFilter && (
            <span
              onClick={(event) => {
                event.stopPropagation();
                onPriorityFilter(null);
              }}
              className="ml-0.5 text-[#0073EA] hover:text-[#E2445C]"
            >
              <X size={10} />
            </span>
          )}
        </button>
        <div className="absolute left-0 top-9 z-30 hidden w-36 rounded-lg border border-[#E6E9EF] bg-white py-1 shadow-lg group-hover:block">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#C4C4C4]">
            Priority
          </div>
          {(["critical", "high", "medium", "low"] as Priority[]).map(
            (priority) => (
              <button
                key={priority}
                onClick={() =>
                  onPriorityFilter(
                    priorityFilter === priority ? null : priority,
                  )
                }
                className={`flex w-full items-center gap-2 px-3 py-1.5 text-[12px] transition-colors hover:bg-[#F3F4F6] ${priorityFilter === priority ? "font-semibold text-[#0073EA]" : "text-[#1F2937]"}`}
              >
                <span style={{ color: PRIORITY_CFG[priority].color }}>
                  {PRIORITY_CFG[priority].icon}
                </span>
                {PRIORITY_CFG[priority].label}
              </button>
            ),
          )}
        </div>
      </div>
      <div className="relative">
        <button
          aria-expanded={showGroupMenu}
          aria-haspopup="menu"
          onClick={() => setShowGroupMenu((visible) => !visible)}
          className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[12px] transition-colors ${groupBy !== "none" ? "border-[#0073EA]/30 bg-[#E6F0FF] font-semibold text-[#0073EA]" : "border-[#E6E9EF] bg-white text-[#6B7280] hover:bg-[#F3F4F6]"}`}
        >
          <SlidersHorizontal size={12} /> Group by
        </button>
        {showGroupMenu && (
          <div
            role="menu"
            className="absolute right-0 top-9 z-30 w-40 rounded-lg border border-[#E6E9EF] bg-white py-1 shadow-lg"
          >
            {(
              [
                ["none", "No grouping"],
                ["assignee", "Assignee"],
                ["creator", "Created by"],
                ["priority", "Priority"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                role="menuitem"
                onClick={() => {
                  onGroupByChange(value);
                  setShowGroupMenu(false);
                }}
                className={`w-full px-3 py-1.5 text-left text-[12px] transition-colors hover:bg-[#F3F4F6] ${groupBy === value ? "font-semibold text-[#0073EA]" : "text-[#1F2937]"}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
