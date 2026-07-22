import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";

dotenv.config();

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const memberService = env.VITE_MEMBER_SERVICE_URL || process.env.VITE_MEMBER_SERVICE_URL;
  const orgService = env.VITE_ORGANIZATION_SERVICE_URL || process.env.VITE_ORGANIZATION_SERVICE_URL;
  const boardService = env.VITE_BOARD_TASK_SERVICE_URL || process.env.VITE_BOARD_TASK_SERVICE_URL;
  const apiRoot = env.VITE_API_ROOT || process.env.VITE_API_ROOT;

  const defineVars: Record<string, string> = {};
  if (memberService && memberService.trim() !== "") {
    defineVars["process.env.VITE_MEMBER_SERVICE_URL"] = JSON.stringify(memberService);
  }
  if (orgService && orgService.trim() !== "") {
    defineVars["process.env.VITE_ORGANIZATION_SERVICE_URL"] = JSON.stringify(orgService);
  }
  if (boardService && boardService.trim() !== "") {
    defineVars["process.env.VITE_BOARD_TASK_SERVICE_URL"] = JSON.stringify(boardService);
  }
  if (apiRoot && apiRoot.trim() !== "") {
    defineVars["process.env.VITE_API_ROOT"] = JSON.stringify(apiRoot);
  }

  return {
    plugins: [react(), tailwindcss()],
    define: defineVars,
    server: {
      proxy: {
        "/api/members": {
          target: "http://localhost:8080",
          changeOrigin: true,
        },
        "/api/organizations": {
          target: "http://localhost:8082",
          changeOrigin: true,
        },
        "/api/boards": {
          target: "http://localhost:8081",
          changeOrigin: true,
        },
      },
    },
  };
});
