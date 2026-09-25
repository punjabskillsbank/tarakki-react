import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { PageBackground } from "../../components/PageBackground";
import { PageHeader } from "../../components/PageHeader";
import { PrimaryButton } from "../../components/PrimaryButton";
import BoardMemberService from "../../services/BoardMemberService";
import BoardService from "../../services/BoardService";
import OrganizationService from "../../services/OrganizationServices";
import type { OrganizationMemberResponse } from "../../services/OrganizationServices";

export function AddBoardMembers() {
  const navigate = useNavigate();
  const { boardId } = useParams<{ boardId: string }>();
  const [members, setMembers] = useState<OrganizationMemberResponse[]>([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<Set<number>>(
    new Set(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const parsedBoardId = Number(boardId);
    if (!Number.isInteger(parsedBoardId)) {
      setIsLoading(false);
      toast.error("Board information is missing.");
      return;
    }

    let cancelled = false;

    const loadMembers = async () => {
      try {
        const board = await BoardService.getBoard(parsedBoardId);
        const organizationMembers = await OrganizationService.getOrganizationMembers(
          board.orgId,
        );
        if (!cancelled) setMembers(organizationMembers);
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load organization members:", error);
          toast.error("Members couldn't be loaded. Please try again.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadMembers();
    return () => {
      cancelled = true;
    };
  }, [boardId]);

  const toggleMember = (orgMemberId: number) => {
    setSelectedMemberIds((current) => {
      const next = new Set(current);
      if (next.has(orgMemberId)) next.delete(orgMemberId);
      else next.add(orgMemberId);
      return next;
    });
  };

  const goToBoard = () => {
    if (boardId) navigate(`/task-board/${boardId}`);
  };

  const availableMembers = members;

  const getErrorMessage = (error: unknown): string => {
    if (typeof error === "string" && error.trim()) return error.trim();

    if (error && typeof error === "object") {
      const maybeError = error as {
        response?: { data?: { message?: string } | string; status?: number };
        message?: string;
      };

      const responseData = maybeError.response?.data;
      if (typeof responseData === "string" && responseData.trim()) {
        return responseData.trim();
      }

      if (responseData && typeof responseData === "object") {
        const dataMessage = responseData.message;
        if (typeof dataMessage === "string" && dataMessage.trim()) {
          return dataMessage.trim();
        }
      }

      if (typeof maybeError.message === "string" && maybeError.message.trim()) {
        return maybeError.message.trim();
      }
    }

    return "Some members couldn't be added. Please try again.";
  };

  const isAlreadyAddedError = (error: unknown) => {
    if (!error || typeof error !== "object") return false;

    const maybeError = error as {
      response?: { status?: number };
      message?: string;
    };

    return (
      maybeError.response?.status === 409 ||
      maybeError.message?.toLowerCase().includes("already")
    );
  };

  const handleSubmit = async () => {
    const parsedBoardId = Number(boardId);
    if (!Number.isInteger(parsedBoardId)) {
      toast.error("Board information is missing.");
      return;
    }

    const selectedMembers = availableMembers.filter((member) =>
      selectedMemberIds.has(member.orgMemberId),
    );

    if (selectedMembers.length === 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const results = await Promise.allSettled(
        selectedMembers.map((member) =>
          BoardMemberService.addOrgMemberToBoard(
            parsedBoardId,
            member.orgMemberId,
            { email: member.email, canEdit: true, canView: true },
          ),
        ),
      );

      const successfulIds: number[] = [];
      const failedIds: number[] = [];

      results.forEach((result, index) => {
        const memberId = selectedMembers[index].orgMemberId;

        if (result.status === "fulfilled" || isAlreadyAddedError(result.reason)) {
          successfulIds.push(memberId);
          return;
        }

        failedIds.push(memberId);
      });

      setSelectedMemberIds((current) => {
        const next = new Set<number>();
        for (const memberId of current) {
          if (failedIds.includes(memberId)) next.add(memberId);
        }
        return next;
      });

      if (failedIds.length === 0) {
        toast.success("Board members added successfully!");
        goToBoard();
        return;
      }

      const failedReason = results.find(
        (result): result is PromiseRejectedResult =>
          result.status === "rejected" && !isAlreadyAddedError(result.reason),
      )?.reason;

      if (successfulIds.length > 0) {
        toast.success(`${successfulIds.length} member(s) added successfully.`);
      }
      toast.error(
        getErrorMessage(failedReason ?? "Some members couldn't be added. Please try again."),
      );
    } catch (error) {
      console.error("Failed to add board members:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F6F7FB] p-6">
      <PageBackground />
      <div className="relative z-10">
        <PageHeader
          title="Add Board Members"
          subtitle="Choose the teammates who should have access to this board. You can always add more later."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-4xl rounded-2xl bg-white/85 p-8 shadow-xl backdrop-blur-sm"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E6F0FF]">
              <Users className="h-5 w-5 text-[#0073EA]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Organization members</h2>
              <p className="text-sm text-gray-500">{selectedMemberIds.size} selected</p>
            </div>
          </div>

          {isLoading ? (
            <p className="py-10 text-center text-gray-500">Loading members...</p>
          ) : availableMembers.length === 0 ? (
            <p className="py-10 text-center text-gray-500">
              No organization members are available yet.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {availableMembers.map((member) => {
                const selected = selectedMemberIds.has(member.orgMemberId);
                return (
                  <button
                    key={member.orgMemberId}
                    type="button"
                    onClick={() => toggleMember(member.orgMemberId)}
                    className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
                      selected
                        ? "border-[#0073EA] bg-[#F0F6FF]"
                        : "border-gray-200 bg-white hover:border-[#9CC8FF]"
                    }`}
                    aria-pressed={selected}
                  >
                    <span>
                      <span className="block font-medium text-gray-900">{member.email}</span>
                      <span className="text-sm text-gray-500">Organization member</span>
                    </span>
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                        selected
                          ? "border-[#0073EA] bg-[#0073EA] text-white"
                          : "border-gray-300 text-transparent"
                      }`}
                    >
                      <Check className="h-4 w-4" />
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={goToBoard}
              className="rounded-xl border border-gray-300 px-4 py-2 text-gray-700"
            >
              Skip for now
            </button>
            <PrimaryButton
              onClick={handleSubmit}
              disabled={selectedMemberIds.size === 0 || isLoading}
              isLoading={isSubmitting}
            >
              Add Members
            </PrimaryButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}