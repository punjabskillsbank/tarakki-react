import { Bell, ChevronRight, UserPlus } from "lucide-react";
import { Avatar } from "./Avatar";
import type { Member } from "./types";

export function BoardHeader({
  members,
  onAddMember,
}: {
  members: Member[];
  onAddMember: () => void;
}) {
  return (
    <div className="flex h-[52px] flex-shrink-0 items-center gap-4 border-b border-[#E6E9EF] bg-white px-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#0073EA] text-[11px] font-bold text-white">
          T
        </div>
        <span className="text-[13px] font-bold text-[#1F2937]">
          {"{orgName}"}
        </span>
      </div>
      <div className="h-4 w-px bg-[#E6E9EF]" />
      <div className="flex items-center gap-1.5 text-[12px] text-[#9CA3AF]">
        <span>{"{workspaceName}"}</span>
        <ChevronRight size={12} className="text-[#C4C4C4]" />
        <span className="font-semibold text-[#1F2937]">{"{boardName}"}</span>
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        {members.length > 0 && (
          <div className="flex items-center -space-x-1.5">
            {members.slice(0, 5).map((member) => (
              <Avatar key={member.id} member={member} size={28} />
            ))}
          </div>
        )}
        <button
          onClick={onAddMember}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium text-[#0073EA] transition-colors hover:bg-[#E6F0FF]"
        >
          <UserPlus size={13} />
          Add Member
        </button>
        <div className="mx-1 h-4 w-px bg-[#E6E9EF]" />
        <button className="rounded-md p-1.5 text-[#9CA3AF] transition-colors hover:bg-[#F3F4F6] hover:text-[#1F2937]">
          <Bell size={15} />
        </button>
      </div>
    </div>
  );
}
