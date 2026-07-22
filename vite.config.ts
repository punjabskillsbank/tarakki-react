import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), tailwindcss()],
    define: {
      "process.env.VITE_MEMBER_SERVICE_URL": JSON.stringify(
        env.VITE_MEMBER_SERVICE_URL || process.env.VITE_MEMBER_SERVICE_URL || ""
      ),
      "process.env.VITE_ORGANIZATION_SERVICE_URL": JSON.stringify(
        env.VITE_ORGANIZATION_SERVICE_URL || process.env.VITE_ORGANIZATION_SERVICE_URL || ""
      ),
      "process.env.VITE_BOARD_TASK_SERVICE_URL": JSON.stringify(
        env.VITE_BOARD_TASK_SERVICE_URL || process.env.VITE_BOARD_TASK_SERVICE_URL || ""
      ),
      "process.env.VITE_API_ROOT": JSON.stringify(
        env.VITE_API_ROOT || process.env.VITE_API_ROOT || ""
      ),
    },
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
