import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ToastItem, UIState } from "./types";
import { RootState, AppThunk } from "../../appStore/store";

const initialUIState: UIState = {
  isLoading: false,
  notification: {
    status: "idle",
    message: "",
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState: initialUIState,
  reducers: {
    showToast(state, action: PayloadAction<ToastItem>) {
        state.notification = action.payload;
    },
    hideToast(state) {
        //Hide Toast
        state.isLoading = false;
        state.notification.status = "idle";
    },
    updateToastMessage(state, action: PayloadAction<string>) {
      state.notification.message = action.payload;
    },
    animateToastMessage(state, action: PayloadAction<string>) {
      //for future use
      //state.notification.message = action.payload;
    },
  },
});

//export State interface
export const selectUI = (state: RootState) => state.ui;

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
