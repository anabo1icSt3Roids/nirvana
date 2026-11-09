import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { localApiPlugin } from "./vite-api-plugin.js";

export default defineConfig({
  plugins: [react(), localApiPlugin()]
});
