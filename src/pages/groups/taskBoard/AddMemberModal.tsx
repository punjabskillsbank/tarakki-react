import { X } from "lucide-react";
import { useState } from "react";
import { PrimaryButton } from "../../../components/PrimaryButton";

export function AddMemberModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const add = () => {
    if (!name.trim()) return;
    onAdd(name.trim());
    onClose();
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
          Enter the member's name to add them to Punjab Skills Bank.
        </p>
        <input
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && add()}
          placeholder="Full name..."
          className="mb-4 w-full rounded-lg border border-[#E6E9EF] bg-[#F6F7FB] px-3 py-2.5 text-[13px] text-[#1F2937] outline-none transition-colors placeholder:text-[#C4C4C4] focus:border-[#0073EA]"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-[#E6E9EF] bg-[#F6F7FB] px-3 py-1.5 text-[12px] text-[#6B7280] transition-colors hover:bg-[#E6E9EF]"
          >
            Cancel
          </button>
          <PrimaryButton
            onClick={add}
            disabled={!name.trim()}
            className="h-auto px-4 py-1.5 text-[12px]"
          >
            Add Member
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
