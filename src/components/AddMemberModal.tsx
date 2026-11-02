import { X } from "lucide-react";
import { useState } from "react";
import type { Member } from "../types/taskBoardtypes";

export function AddMemberModal({
  onClose,
  onAdd,
  availableMembers,
}: {
  onClose: () => void;
  onAdd: (member: Member, canEdit: boolean) => Promise<void>;
  availableMembers: Member[];
}) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [canEdit, setCanEdit] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const add = async (member: Member) => {
    try {
      setIsAdding(true);
      await onAdd(member, canEdit);
      onClose();
    } catch {
      // The page displays the server error and keeps the member picker open.
    } finally {
      setIsAdding(false);
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
          Select an organization member to add to this board, then choose their access.
        </p>
        <div className="mb-4 max-h-52 space-y-1 overflow-y-auto">
          {availableMembers.length > 0 ? (
            availableMembers.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => setSelectedMember(member)}
                aria-pressed={selectedMember?.id === member.id}
                className={`w-full rounded-lg px-3 py-2 text-left text-[13px] text-[#1F2937] ${
                  selectedMember?.id === member.id
                    ? "bg-[#E6F0FF] text-[#0073EA]"
                    : "hover:bg-[#F6F7FB]"
                }`}
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
        {selectedMember && (
          <label className="mb-4 flex cursor-pointer items-center justify-between rounded-lg bg-[#F6F7FB] px-3 py-2 text-[12px] text-[#1F2937]">
            Allow this member to edit the board
            <input
              type="checkbox"
              checked={canEdit}
              onChange={(event) => setCanEdit(event.target.checked)}
              className="h-4 w-4 accent-[#0073EA]"
            />
          </label>
        )}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-[#E6E9EF] bg-[#F6F7FB] px-3 py-1.5 text-[12px] text-[#6B7280] transition-colors hover:bg-[#E6E9EF]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedMember || isAdding}
            onClick={() => selectedMember && add(selectedMember)}
            className="rounded-lg bg-[#0073EA] px-3 py-1.5 text-[12px] text-white transition-colors hover:bg-[#0060C0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAdding ? "Adding..." : "Add Selected Member"}
          </button>
        </div>
      </div>
    </div>
  );
}
