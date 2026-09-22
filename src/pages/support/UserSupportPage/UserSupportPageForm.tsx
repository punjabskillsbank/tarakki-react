import { useState } from "react";
import { FormTextarea } from "../../../components/FormTextarea";
import { FormInput } from "../../../components/FormInput";
import { FormSelect } from "../../../components/FormSelect";
import { Upload } from "lucide-react";
import { PrimaryButton } from "../../../components/PrimaryButton";

const issueTypesByCategory = {
  ACCOUNT: [
    {
      value: "LOGIN_ISSUE",
      label: "Login Issue",
    },
    {
      value: "SIGNUP_ERROR",
      label: "Signup Error",
    },
    {
      value: "PASSWORD_RESET_LINK_NOT_RECEIVED",
      label: "Password Reset Link Not Received",
    },
    {
      value: "TWO_FACTOR_AUTH_LOCKOUT",
      label: "Two Factor Auth Lockout",
    },
    {
      value: "DELETE_OR_DEACTIVATE_ACCOUNT",
      label: "Delete or Deactivate Account",
    },
  ],

  BOARD: [
    {
      value: "FILE_UPLOAD_ERROR",
      label: "File Upload Error",
    },
    {
      value: "BOARD_PERFORMANCE",
      label: "Board Performance",
    },
    {
      value: "AUTOMATION_INTEGRATION_ERROR",
      label: "Automation Integration Error",
    },
    {
      value: "LOST_DATA_OR_MISSING_ITEMS",
      label: "Lost Data or Missing Items",
    },
  ],

  TEAM: [
    {
      value: "MEMBER_INVITE_ISSUE",
      label: "Member Invite Issue",
    },
    {
      value: "PERMISSION_MISMATCH",
      label: "Permission Mismatch",
    },
    {
      value: "NOTIFICATION_ISSUE",
      label: "Notification Issue",
    },
  ],

  GENERAL: [
    {
      value: "GENERAL_QUESTION",
      label: "General Question",
    },
    {
      value: "FEATURE_REQUEST",
      label: "Feature Request",
    },
    {
      value: "BUG_REPORT",
      label: "Bug Report",
    },
    {
      value: "OTHER",
      label: "Other",
    },
  ],
};
export function UserSupportPageForm() {
  const [category, setCategory] = useState("");
  const [issueType, setIssueType] = useState("");
  const issueTypeOptions = category
    ? issueTypesByCategory[category as keyof typeof issueTypesByCategory]
    : [];

  return (
    <div className="relative z-10 px-4 py-8 bg-white rounded-2xl shadow-xl">
      <p className="text-xl font-bold">Submit a Support Request</p>
      <p className="text-lg text-gray-500 pb-4">
        Describe your issue and our support team will get back to you as soon as
        possible.
      </p>
      <div className="flex flex-col gap-4 pb-4">
        <FormInput
          label="Subject"
          placeholder="Briefly describe your issue"
          value={""}
        />
        <FormSelect
          label="Category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setIssueType("");
          }}
          options={[
            { value: "", label: "Select a Category" },
            { value: "ACCOUNT", label: "ACCOUNT" },
            { value: "BOARD", label: "BOARD" },
            { value: "TEAM", label: "TEAM" },
            { value: "GENERAL", label: "GENERAL" },
          ]}
        />
        <FormSelect
          label="Issue Type"
          value={issueType}
          onChange={(e) => setIssueType(e.target.value)}
          options={[
            { value: "", label: "Select an Issue Type" },
            ...issueTypeOptions,
          ]}
        />
        <FormTextarea
          label="Message"
          id="supportMessage"
          placeholder="Explain your issue in detail..."
          rows={4}
          maxLength={500}
          showCount
          autoResize
        />
      </div>
      <label className="h-64 w-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center bg-gray-100 cursor-pointer hover:bg-gray-50 transition">
        <div className="mb-4 text-4xl h-20 w-20 flex items-center justify-center rounded-2xl bg-gray-100">
          <Upload
            size={32}
            className="text-gray-400"
          />
        </div>
        <p className="text-lg font-semibold text-gray-700">
          Attach screenshots or supporting files
        </p>
        <p className="mt-2 text-sm text-gray-400">PNG, JPG, PDF — Max 10 MB</p>
        <input
          type="file"
          className="hidden"></input>
      </label>
      <div className="flex gap-4 pt-4 justify-end">
        <button className="px-4 py-2 rounded-xl border-gray-300 border">
          Cancel
        </button>
        <PrimaryButton>Submit Request</PrimaryButton>
      </div>
    </div>
  );
}
