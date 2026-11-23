import API from "./axios";
import config from "../config/indexConfig";
import { MOCK_TOKEN } from "../test-utils/factories";

describe("API authentication interceptor", () => {
  const originalAdapter = API.defaults.adapter;

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    API.defaults.adapter = originalAdapter;
  });

  const captureAuthorizationHeader = async (url: string) => {
    let authorizationHeader: string | undefined;
    API.defaults.adapter = async (request) => {
      const header = request.headers.get("Authorization");
      authorizationHeader = typeof header === "string" ? header : undefined;
      return {
        data: {},
        status: 200,
        statusText: "OK",
        headers: {},
        config: request,
      };
    };

    await API.get(url);
    return authorizationHeader;
  };

  it("sends the stored JWT as a Bearer token to configured APIs", async () => {
    localStorage.setItem("token", MOCK_TOKEN);

    const header = await captureAuthorizationHeader(
      `${config.baseURLs.memberService}${config.endpoints.members}`,
    );

    expect(header).toBe(`Bearer ${MOCK_TOKEN}`);
  });

  it("does not send the JWT to an unconfigured origin", async () => {
    localStorage.setItem("token", MOCK_TOKEN);

    const header = await captureAuthorizationHeader(
      "https://example.com/resource",
    );

    expect(header).toBeUndefined();
  });

  it("does not send an existing JWT to the login endpoint", async () => {
    localStorage.setItem("token", MOCK_TOKEN);

    const header = await captureAuthorizationHeader(
      `${config.baseURLs.memberService}${config.endpoints.login}`,
    );

    expect(header).toBeUndefined();
  });
});
