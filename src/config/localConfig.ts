const getEnv = (key: string, defaultValue: string): string => {
  try {
    const env = (0, eval)('typeof import.meta !== "undefined" ? import.meta.env : null');
    if (env && env[key]) {
      return env[key];
    }
  } catch {
    // Ignore error in non-ESM environments like Jest
  }
  const proc = (globalThis as any).process;
  if (proc && proc.env && proc.env[key]) {
    return proc.env[key] as string;
  }
  return defaultValue;
};

const localConfig = {
  baseURLs: {
    apiRoot: getEnv('VITE_API_ROOT', '/api'),
    memberService: getEnv('VITE_MEMBER_SERVICE_URL', 'http://localhost:8080'),
    organizationService: getEnv('VITE_ORGANIZATION_SERVICE_URL', 'http://localhost:8082'),
    boardTaskService: getEnv('VITE_BOARD_TASK_SERVICE_URL', 'http://localhost:8081'),
  },
};

export default localConfig;


