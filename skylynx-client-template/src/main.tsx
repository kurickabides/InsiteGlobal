// ================================================
// File: Main Application Entry Point
// Description: Boots the React app with Redux, routing, theme, bootstrap, and baseline styles.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: main.tsx
// Type: React TypeScript entry file
// ================================================

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import App from "@/app";
import AppBootstrap from "@/appBootstrap";
import { store } from "@/appStore/store";
import { theme } from "@/theme/theme";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppBootstrap>
            <App />
          </AppBootstrap>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
