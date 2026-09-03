import { X } from "lucide-react";
import type { Member } from "./types";

export function AddMemberModal({
  onClose,
  onAdd,
  availableMembers,
}: {
  onClose: () => void;
  onAdd: (member: Member) => Promise<void>;
  availableMembers: Member[];
}) {
  const add = async (member: Member) => {
    try {
      await onAdd(member);
      onClose();
    } catch {
      // The page displays the server error and keeps the member picker open.
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="mx-4 w-full max-w-sm rounded-xl border border-[#E6E9EF] bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[14px] font-semibold text-[#1F2937]">
            Add Member
          </h3>
          <button
            onClick={onClose}
            className="rounded p-1 text-[#9CA3AF] transition-colors hover:bg-[#F3F4F6] hover:text-[#1F2937]"
          >
            <X size={15} />
          </button>
        </div>
        <p className="mb-3 text-[12px] text-[#9CA3AF]">
          Select an organization member to add to this board.
        </p>
        <div className="mb-4 max-h-52 space-y-1 overflow-y-auto">
          {availableMembers.length > 0 ? (
            availableMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => add(member)}
                className="w-full rounded-lg px-3 py-2 text-left text-[13px] text-[#1F2937] hover:bg-[#F6F7FB]"
              >
                {member.name}
              </button>
            ))
          ) : (
            <p className="py-3 text-center text-[12px] text-[#9CA3AF]">
              No organization members are available.
            </p>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-[#E6E9EF] bg-[#F6F7FB] px-3 py-1.5 text-[12px] text-[#6B7280] transition-colors hover:bg-[#E6E9EF]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
