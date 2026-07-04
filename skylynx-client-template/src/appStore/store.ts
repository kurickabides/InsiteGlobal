// ================================================
// File: Redux Store
// Description: Configures the base Redux store for presentation-driven POC templates.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: store.ts
// Type: TypeScript Redux store file
// ================================================

import { configureStore } from "@reduxjs/toolkit";
import presentationReducer from "@/appStore/presentationSlice";
import uiReducer from "@/appStore/uiSlice";
import esriMapReducer from "@/modules/esriMapModule/esriMapSlice";

export const store = configureStore({
  reducer: {
    presentation: presentationReducer,
    ui: uiReducer,
    esriMap: esriMapReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
