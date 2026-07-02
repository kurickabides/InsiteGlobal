// ================================================
// ✅ Component: Main Pagefor the ULIP Demo
// Description: Adds support for @arcgis/core (ESM), excludes from optimizeDeps
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: main.tsx
// ================================================

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import App from "./App";
import { theme } from "./theme/theme";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
