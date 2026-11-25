const TOKEN_KEY = "token";
const MEMBER_ID_KEY = "memberId";
const FIRST_NAME_KEY = "firstName";
const LAST_NAME_KEY = "lastName";

const storage = () => (typeof window === "undefined" ? null : window.localStorage);

export const getToken = () => storage()?.getItem(TOKEN_KEY) ?? "";

export const setToken = (token: string) => {
  storage()?.setItem(TOKEN_KEY, token);
};

export const setMemberIdentity = (identity: {
  memberId: string;
  firstName: string;
  lastName: string;
}) => {
  const target = storage();
  if (!target) return;
  target.setItem(MEMBER_ID_KEY, identity.memberId);
  target.setItem(FIRST_NAME_KEY, identity.firstName);
  target.setItem(LAST_NAME_KEY, identity.lastName);
};

export const clearAuth = () => {
  const target = storage();
  if (!target) return;
  [TOKEN_KEY, MEMBER_ID_KEY, FIRST_NAME_KEY, LAST_NAME_KEY].forEach((key) =>
    target.removeItem(key),
  );
};
