import AuthService, { type LoginError } from "./AuthService";
import API from "./axios";
import { loginCredentialsFactory, loginResponseFactory } from "../test-utils/factories";
import config from "../config/indexConfig";

jest.mock("./axios");
const mockedAPI = API as jest.Mocked<typeof API>;

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    const credentials = loginCredentialsFactory();

    it("successfully logs in and returns the token and member", async () => {
      const responseData = loginResponseFactory();
      mockedAPI.post.mockResolvedValueOnce({ data: responseData });

      const result = await AuthService.login(credentials);

      expect(mockedAPI.post).toHaveBeenCalledWith(
        `${config.baseURLs.memberService}${config.endpoints.login}`,
        credentials
      );
      expect(result).toEqual(responseData);
    });

    it("throws an error with message from response on failure", async () => {
      const errorMessage = "Invalid email or password";
      mockedAPI.post.mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          status: 401,
          data: errorMessage,
        },
      });

      await expect(AuthService.login(credentials)).rejects.toThrow(errorMessage);
    });

    it("preserves the response status on the thrown error so callers can distinguish 401s", async () => {
      mockedAPI.post.mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          status: 401,
          data: "Invalid email or password",
        },
      });

      try {
        await AuthService.login(credentials);
        fail("expected AuthService.login to throw");
      } catch (error: unknown) {
        expect((error as LoginError).response?.status).toBe(401);
      }
    });

    it("throws a default error message on failure if no message in response", async () => {
      mockedAPI.post.mockRejectedValueOnce(new Error("Network Error"));

      await expect(AuthService.login(credentials)).rejects.toThrow("Failed to log in");
    });
  });
});
