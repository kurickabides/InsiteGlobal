// ================================================
// ✅ Slice: protosTargetTypeSlice
// Description: Loads ProtosTargetType rows from DB via API
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// ================================================

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { TemplateType, ProtosTargetTypeState } from "./types";
import { fetchProtosTargetTypes } from "./skylynxPortalTreeAPI";

const initialState: ProtosTargetTypeState = {
  types: [],
  loading: false,
};

export const loadProtosTargetTypes = createAsyncThunk<TemplateType[]>(
  "/api/nimbus/templates/types",
  async (_, thunkAPI) => {
    try {
      return await fetchProtosTargetTypes(); // 🔁 no token needed
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to load target types."
      );
    }
  }
);

const protosTargetTypeSlice = createSlice({
  name: "protosTargetType",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProtosTargetTypes.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        loadProtosTargetTypes.fulfilled,
        (state, action: PayloadAction<TemplateType[]>) => {
          state.types = action.payload;
          state.loading = false;
        }
      )
      .addCase(loadProtosTargetTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default protosTargetTypeSlice.reducer;
