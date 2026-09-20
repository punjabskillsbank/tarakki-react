const getEnv = (val: string | undefined, defaultValue: string): string => {
  if (val && typeof val === "string" && val.trim() !== "") {
    return val;
  }
  return defaultValue;
};

const formatServiceURL = (
  val: string | undefined,
  defaultValue: string
): string => {
  let url = getEnv(val, defaultValue);
  if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
    if (url.endsWith("/")) {
      url = url.slice(0, -1);
    }
    if (!url.endsWith("/api")) {
      url = url + "/api";
    }
  }
  return url;
};

const localConfig = {
  baseURLs: {
    apiRoot: getEnv(import.meta.env.VITE_API_ROOT, "/api"),
    memberService: formatServiceURL(
      import.meta.env.VITE_MEMBER_SERVICE_URL,
      "http://localhost:8080"
    ),
    organizationService: formatServiceURL(
      import.meta.env.VITE_ORGANIZATION_SERVICE_URL,
      "http://localhost:8082"
    ),
    boardTaskService: formatServiceURL(
      import.meta.env.VITE_BOARD_TASK_SERVICE_URL,
      "http://localhost:8081"
    ),
  },
};

export default localConfig;
