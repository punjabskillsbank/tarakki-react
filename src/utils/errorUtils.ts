import { isAxiosError } from "axios";

const getResponseErrorMessage = (data: unknown): string | undefined => {
  if (typeof data === "string" && data.trim()) return data.trim();
  if (!data || typeof data !== "object") return undefined;

  const responseData = data as Record<string, unknown>;
  const message = responseData.message;
  if (typeof message === "string" && message.trim()) return message.trim();

  const fieldMessages = Object.values(responseData).filter(
    (value): value is string => typeof value === "string" && Boolean(value.trim()),
  );
  return fieldMessages.length > 0
    ? fieldMessages.map((value) => value.trim()).join(", ")
    : undefined;
};

export const getAxiosErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (!isAxiosError(error)) return fallback;
  return getResponseErrorMessage(error.response?.data) ?? fallback;
};

export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "string" && error.trim()) return error.trim();

  if (isAxiosError(error)) {
    const responseMessage = getResponseErrorMessage(error.response?.data);
    const message =
      typeof error.message === "string" ? error.message.trim() : "";
    return (
      responseMessage ??
      (message || fallback)
    );
  }

  if (error instanceof Error && error.message.trim()) return error.message.trim();
  return fallback;
};
