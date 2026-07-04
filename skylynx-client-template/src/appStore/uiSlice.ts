// ================================================
// File: UI State Slice
// Description: Tracks template UI state such as navigation drawer visibility and theme mode.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: uiSlice.ts
// Type: TypeScript Redux slice file
// ================================================

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UiState {
  mobileDrawerOpen: boolean;
  desktopDrawerOpen: boolean;
  themeMode: "light" | "dark";
}

const initialState: UiState = {
  mobileDrawerOpen: false,
  desktopDrawerOpen: false,
  themeMode: "light"
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setMobileDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileDrawerOpen = action.payload;
    },
    setDesktopDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.desktopDrawerOpen = action.payload;
    },
    toggleDesktopDrawer: (state) => {
      state.desktopDrawerOpen = !state.desktopDrawerOpen;
    },
    toggleThemeMode: (state) => {
      state.themeMode = state.themeMode === "light" ? "dark" : "light";
    }
  }
});

export const { setDesktopDrawerOpen, setMobileDrawerOpen, toggleDesktopDrawer, toggleThemeMode } = uiSlice.actions;

export default uiSlice.reducer;