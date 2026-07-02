// ================================================
// ✅ Vite Config for Esri ArcGIS JS API
// Description: Adds support for @arcgis/core (ESM), excludes from optimizeDeps
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: vite.config.ts
// ================================================

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
});
