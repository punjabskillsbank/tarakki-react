import {
  getToken,
  setToken,
  getStoredMemberId,
  setMemberIdentity,
  clearAuth,
} from "./authStorage";
import { MOCK_TOKEN, MOCK_MEMBER_ID, MOCK_FIRST_NAME, MOCK_LAST_NAME } from "../test-utils/factories";

describe("authStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns an empty string when no token is stored", () => {
    expect(getToken()).toBe("");
  });

  it("round-trips the token through localStorage", () => {
    setToken(MOCK_TOKEN);
    expect(getToken()).toBe(MOCK_TOKEN);
  });

  it("returns an empty string when no member id is stored", () => {
    expect(getStoredMemberId()).toBe("");
  });

  it("round-trips the member identity through localStorage", () => {
    setMemberIdentity({ memberId: MOCK_MEMBER_ID, firstName: MOCK_FIRST_NAME, lastName: MOCK_LAST_NAME });

    expect(getStoredMemberId()).toBe(MOCK_MEMBER_ID);
    expect(localStorage.getItem("firstName")).toBe(MOCK_FIRST_NAME);
    expect(localStorage.getItem("lastName")).toBe(MOCK_LAST_NAME);
  });

  it("clears the token and member identity", () => {
    setToken(MOCK_TOKEN);
    setMemberIdentity({ memberId: MOCK_MEMBER_ID, firstName: MOCK_FIRST_NAME, lastName: MOCK_LAST_NAME });

    clearAuth();

    expect(getToken()).toBe("");
    expect(getStoredMemberId()).toBe("");
    expect(localStorage.getItem("firstName")).toBeNull();
    expect(localStorage.getItem("lastName")).toBeNull();
  });
});
