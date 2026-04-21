import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  // Ensure the repo name is exact and has both slashes
  base: "/skycast-weather/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Standardize to the src folder
    },
  },
  build: {
    outDir: "dist", // Explicitly tell Vite where to put the build
  },
});
