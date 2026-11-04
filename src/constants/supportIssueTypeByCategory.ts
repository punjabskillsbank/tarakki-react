export const issueTypesByCategory = {
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

  BOARDS: [
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
