import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/skycast-weather/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Typically, @ points to the "src" folder for better organization
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    hmr: process.env.DISABLE_HMR !== "true",
  },
});
