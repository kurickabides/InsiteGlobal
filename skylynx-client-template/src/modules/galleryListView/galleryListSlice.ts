// ================================================
// ✅ Slice: galleryListSlice
// Description: Redux slice for gallery list view state
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: /modules/galleryListView/galleryListSlice.ts
// ================================================

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../appStore/store";
import { GalleryItem, GalleryState } from "./types";
import { ModuleRegistry } from "../../appStore/moduleStateRegistry";
import { selectModuleState } from "../../appStore/moduleStateSelector";
import { getCurrentNamespace } from "../../services/utils/resolvePortalNamespace";
import GalleryListView from "./galleryListView "; // ✅ This is the real visual component

const initialState: GalleryState = {
  items: [],
};

const galleryListSlice = createSlice({
  name: "galleryList",
  initialState,
  reducers: {
    setGalleryItems: (state, action: PayloadAction<GalleryItem[]>) => {
      state.items = action.payload;
    },
    clearGalleryItems: (state) => {
      state.items = [];
    },
  },
});

// ✅ Register module with reducer and component using correct shape
ModuleRegistry.register({
  namespace: getCurrentNamespace(),
  reducer: galleryListSlice.reducer,
  RouteRegistryEntry: {
    name: "gallerylist",
    component: GalleryListView,
    description: "Gallery List UI Component + State",
  },
});

export const { setGalleryItems, clearGalleryItems } = galleryListSlice.actions;

export const selectGalleryItems = (state: RootState): GalleryItem[] => {
  const gallery = selectModuleState<GalleryState>(state, "gallerylist");
  return gallery?.items ?? [];
};

export default galleryListSlice.reducer;
