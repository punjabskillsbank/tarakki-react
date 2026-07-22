declare const process: { env: Record<string, string | undefined> };

const getEnv = (val: string | undefined, defaultValue: string): string => {
  if (val && typeof val === 'string' && val.trim() !== '') {
    return val;
  }
  return defaultValue;
};

const localConfig = {
  baseURLs: {
    apiRoot: getEnv(process.env.VITE_API_ROOT, '/api'),
    memberService: getEnv(process.env.VITE_MEMBER_SERVICE_URL, 'http://localhost:8080'),
    organizationService: getEnv(process.env.VITE_ORGANIZATION_SERVICE_URL, 'http://localhost:8082'),
    boardTaskService: getEnv(process.env.VITE_BOARD_TASK_SERVICE_URL, 'http://localhost:8081'),
  },
};

export default localConfig;


