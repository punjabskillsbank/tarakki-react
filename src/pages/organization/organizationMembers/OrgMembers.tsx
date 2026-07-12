import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageBackground } from "../../../components/PageBackground";
import { PageHeader } from "../../../components/PageHeader";
import { Trash2 } from "lucide-react";
import config from "../../../config/indexConfig";
import toast from "react-hot-toast";

type OrgMember = {
  email: string;
  role: "ADMIN" | "MANAGER" | "MEMBER" | "";
};

export function OrgMembers() {
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  const handleSkip = () => {
    if (orgId) {
      navigate(config.routes.createBoardWithOrgId(orgId));
    } else {
      navigate(config.routes.organizationDecision);
    }
  };

  const addMember = () => {
    setMembers((prev) => [
      ...prev,
      {
        email: "",
        role: "",
      },
    ]);
  };
  const updateEmail = (index: number, value: string) => {
    setMembers((prev) =>
      prev.map((member, i) =>
        i === index ? { ...member, email: value } : member
      )
    );
  };
  const updateRole = (index: number, value: OrgMember["role"]) => {
    setMembers((prev) =>
      prev.map((member, i) =>
        i === index ? { ...member, role: value } : member
      )
    );
  };
  const deleteMember = (index: number) => {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const isDuplicateEmail = (email: string, currentIndex: number) => {
    if (!email.trim()) return false;

    return members.some(
      (member, index) =>
        index !== currentIndex &&
        member.email.trim().toLowerCase() === email.trim().toLowerCase()
    );
  };

  const handleInviteMembers = async () => {
    setSubmitted(true);

    const hasErrors = members.some((member, index) => {
      return (
        member.email.trim() === "" ||
        !isValidEmail(member.email) ||
        isDuplicateEmail(member.email, index) ||
        member.role === ""
      );
    });

    if (hasErrors) {
      return;
    }

    setIsInviting(true);

    try {
      // Later:
      // await OrgMemberService.inviteMembers(...)

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call delay, will remove this when actual API call is implemented
      toast.success("Invites sent successfully!");

      if (orgId) {
        navigate(config.routes.createBoardWithOrgId(orgId));
      } else {
        navigate(config.routes.organizationDecision);
      }
    } catch (error) {
      toast.error("Failed to send invites");
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="p-6">
      <PageBackground></PageBackground>
      <div>
        <PageHeader
          title="Invite Organization Members"
          subtitle="Invite your teammates to collaborate in your organization. You can always add more members later."
        />
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <p className="text-xl font-bold">Invite Members</p>
          <p className="text-gray-500 mb-4">
            Enter your teammates' email addresses and assign their roles before
            sending invites.
          </p>
          {members.length > 0 && (
            <>
              <div className="flex gap-4 mb-2">
                <div className="flex-2">
                  <p className="font-semibold text-gray-500">EMAIL ADDRESS</p>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-500">ROLE</p>
                </div>
              </div>
              {members.map((member, index) => {
                const missingEmail = submitted && member.email.trim() === "";

                const duplicate =
                  submitted && isDuplicateEmail(member.email, index);

                const invalidEmail =
                  submitted && !isValidEmail(member.email) && !missingEmail;

                const missingRole = submitted && member.role === "";
                return (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row gap-4 items-start md:items-center my-4">
                    <div className="w-full md:flex-[2]">
                      <input
                        className={`w-full rounded-xl p-3 border transition-colors 
                          ${
                            duplicate || invalidEmail || missingEmail
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        placeholder="Email Address"
                        value={member.email}
                        onChange={(e) => updateEmail(index, e.target.value)}
                      />
                      {missingEmail && (
                        <p className="text-sm text-red-500 mt-1">
                          Email address is required.
                        </p>
                      )}

                      {duplicate && (
                        <p className="text-sm text-red-500 mt-1">
                          Duplicate Email Address
                        </p>
                      )}

                      {invalidEmail && (
                        <p className="text-sm text-red-500 mt-1">
                          Invalid email address.
                        </p>
                      )}
                    </div>
                    <div className="w-full md:flex-1">
                      <select
                        className={`w-full rounded-xl p-3 border transition-colors
                        ${missingRole ? "border-red-500" : "border-gray-300"}`}
                        value={member.role}
                        onChange={(e) =>
                          updateRole(index, e.target.value as OrgMember["role"])
                        }>
                        <option value="">Select Role</option>
                        <option value="ADMIN">Admin</option>
                        <option value="MANAGER">Manager</option>
                        <option value="MEMBER">Member</option>
                      </select>
                      {missingRole && (
                        <p className="text-sm text-red-500 mt-1">
                          Please select a role.
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteMember(index)}
                      className="self-end md:self-auto h-10 w-10 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                );
              })}
              <hr></hr>
            </>
          )}

          <div
            className="m-2 mt-4 flex gap-2 border-gray-300 border border-dashed p-2 rounded-xl w-fit cursor-pointer hover:bg-gray-100"
            onClick={addMember}>
            <div className="w-7 h-7 rounded-full bg-gray-100 item-center justify-center flex">
              +
            </div>
            <p>Add another Member</p>
          </div>
          <hr></hr>
          <div className="mt-4 flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 rounded-xl border-gray-300 border"
              onClick={handleSkip}>
              Skip for Now
            </button>
            <button
              className="px-4 py-2 rounded-xl  bg-blue-500 text-white border-blue-500 border disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed"
              disabled={members.length === 0 || isInviting}
              onClick={handleInviteMembers}>
              {isInviting ? "Sending Invites..." : "Invite Members"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
