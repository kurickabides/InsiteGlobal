// ================================================
// File: Vite Configuration
// Description: Configures Vite plugins, dev server, aliases, and build behavior for the Skylynx client template.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: vite.config.ts
// Type: TypeScript build configuration file
// ================================================

import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  server: {
    port: 5174
  }
});
