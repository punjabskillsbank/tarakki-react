import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The task-board feature lives in a nested folder. Force every import to use
  // this app's React runtime instead of a cached or nested resolution.
  resolve: {
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-runtime"],
  },
  server: {
    proxy: {
      "/api/members": {
        target: "http://localhost:8081",
        changeOrigin: true,
      },
      "/api/organizations": {
        target: "http://localhost:8082",
        changeOrigin: true,
      },
      "/api/boards": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
