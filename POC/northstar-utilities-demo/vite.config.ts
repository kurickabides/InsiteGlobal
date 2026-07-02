// ================================================
// File: Vite Configuration
// Description: Configures Vite plugins, dev server, and build behavior.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: vite.config.ts
// Type: TypeScript build configuration file
// ================================================

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
});
