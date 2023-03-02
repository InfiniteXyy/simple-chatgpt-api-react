import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import environment from "vite-plugin-environment";

export default defineConfig({
  plugins: [react(), environment("all")],
});
