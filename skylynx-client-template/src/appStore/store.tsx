// ================================================
// ✅ Store Configuration
// Description: Redux store setup with registered slices
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: appStore/store.ts
// ================================================

import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { ModuleRegistry } from "./moduleStateRegistry";

// Slice reducers
import authReducer from "../components/auth/authSlice";
import uiReducer from "../components/ui/uiSlice";
import skylynxPortalTreeReducer from "../components/core/skylynxPortalTreeSlice";
import protosTargetTypeReducer from "../components/core/protosTargetTypeSlice";
import targetRegistryReducer from "../components/core/targetRegistry/targetRegistrySlice"; // ✅ NEW

import { loadAuthState } from "../helpers/persistAuth";

const preloadedAuthState = loadAuthState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    skylynxPortalTree: skylynxPortalTreeReducer,
    protosTargetType: protosTargetTypeReducer,
    targetRegistry: targetRegistryReducer, // ✅ ADD THIS
    moduleRegistry: ModuleRegistry.getCombinedReducer(), // ✅ Still scoped
  },
  preloadedState: preloadedAuthState ? { auth: preloadedAuthState } : undefined,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
