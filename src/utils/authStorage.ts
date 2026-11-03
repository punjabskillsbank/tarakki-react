const TOKEN_KEY = "token";
const MEMBER_ID_KEY = "memberId";
const FIRST_NAME_KEY = "firstName";
const LAST_NAME_KEY = "lastName";

type MemberIdentity = {
  memberId: string;
  firstName: string;
  lastName: string;
};

const isBrowser = () => typeof window !== "undefined";

export const getToken = (): string => {
  if (!isBrowser()) return "";
  return localStorage.getItem(TOKEN_KEY) ?? "";
};

export const setToken = (token: string): void => {
  if (!isBrowser()) return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const getStoredMemberId = (): string => {
  if (!isBrowser()) return "";
  return localStorage.getItem(MEMBER_ID_KEY) ?? "";
};

export const setMemberIdentity = ({ memberId, firstName, lastName }: MemberIdentity): void => {
  if (!isBrowser()) return;
  localStorage.setItem(MEMBER_ID_KEY, memberId);
  localStorage.setItem(FIRST_NAME_KEY, firstName);
  localStorage.setItem(LAST_NAME_KEY, lastName);
};

export const clearAuth = (): void => {
  if (!isBrowser()) return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(MEMBER_ID_KEY);
  localStorage.removeItem(FIRST_NAME_KEY);
  localStorage.removeItem(LAST_NAME_KEY);
};
