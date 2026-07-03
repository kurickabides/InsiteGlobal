// ================================================
// ✅ Slice: targetRegistrySlice
// Description: Redux slice to manage resolved target metadata by namespace
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: components/core/targetRegistry/targetRegistrySlice.ts
// ================================================

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTargetMeta } from "./targetApi";
import {
  ITargetRegistryEntry,
  TargetRegistryState,
  TargetRegistryStateCollection,
  RegistryStatus,
} from "../types";

// ✅ Initial state
const initialState: TargetRegistryStateCollection = {};

// ✅ Thunk: loadTargetMeta
export const loadTargetMeta = createAsyncThunk<
  {
    targetID: string;
    targetType: string;
    data: Record<string, any>;
    namespace: string;
  },
  {
    targetID: string;
    targetType: string;
    namespace: string;
  }
>(
  "targetRegistry/loadTargetMeta",
  async ({ targetID, targetType, namespace }) => {
    const data = await fetchTargetMeta(targetType, targetID);
    return { targetID, targetType, data, namespace };
  }
);

// ✅ Slice definition
export const targetRegistrySlice = createSlice({
  name: "targetRegistry",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadTargetMeta.pending, (state, action) => {
        const { namespace } = action.meta.arg;
        if (!state[namespace]) {
          state[namespace] = {
            targets: {},
            lastResolvedAt: "",
            status: RegistryStatus.Ok,
          };
        }
        state[namespace].status = RegistryStatus.Loading;
      })
      .addCase(loadTargetMeta.fulfilled, (state, action) => {
        const { targetID, targetType, data, namespace } = action.payload;
        const key = `${targetType}_${targetID}`;

        if (!state[namespace]) {
          state[namespace] = {
            targets: {},
            lastResolvedAt: "",
            status: RegistryStatus.Ok,
          };
        }

        state[namespace].targets[key] = { data };
        state[namespace].lastResolvedAt = new Date().toISOString();
        state[namespace].status = RegistryStatus.Ok;
      })
      .addCase(loadTargetMeta.rejected, (state, action) => {
        const { namespace } = action.meta.arg;
        if (!state[namespace]) {
          state[namespace] = {
            targets: {},
            lastResolvedAt: "",
            status: RegistryStatus.Ok,
          };
        }
        state[namespace].status = RegistryStatus.Error;
        console.error("Target load failed:", action.error.message);
      });
  },
});

export default targetRegistrySlice.reducer;
