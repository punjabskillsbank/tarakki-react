import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  experimental: {
    bundledDev: false,
  },
  server: {
    forwardConsole: false,
    proxy: {

      "/api/admin": {
        target: "http://localhost:8081",
        changeOrigin: true,
      },

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
        '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
