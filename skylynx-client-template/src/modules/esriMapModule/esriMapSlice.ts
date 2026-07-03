// ================================================
// ✅ Slice: esriMapSlice
// Description: Redux slice for Esri map settings and tools
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: /modules/esriMapModule/esriMapSlice.ts
// ================================================

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../appStore/store";
import { ModuleRegistry } from "../../appStore/moduleStateRegistry";
import { getCurrentNamespace } from "../../services/utils/resolvePortalNamespace";
import { selectModuleState } from "../../appStore/moduleStateSelector";

import { ESRIMapModuleSettings, ESRIMapModuleState } from "./types";
import EsriMapModuleView from "../../components/esri/esriMapViewer";
import { BasemapType } from "../../components/esri/types";

// ✅ Initial state
const initialState: ESRIMapModuleState = {
  settings: {
    title: "Esri Map Viewer",
    showTitle: true,
    zoom: 13,
    center: [-122.67, 45.52], // Portland OR
    height: 600, // Default height
    basemap: BasemapType.Hybrid,
    showScaleBar: true,
    enableDraw: false,
    showLegend: true,
    showLayerList: true,
    layerVisibility: {},
  },
};

// ✅ Slice logic
const esriMapSlice = createSlice({
  name: "esrimapmodule",
  initialState,
  reducers: {
    updateEsriSettings: (
      state,
      action: PayloadAction<Partial<ESRIMapModuleSettings>>
    ) => {
      state.settings = { ...state.settings, ...action.payload };
    },
  },
});

// ✅ Register via ModuleRegistry
ModuleRegistry.register({
  namespace: getCurrentNamespace(),
  reducer: esriMapSlice.reducer,
  RouteRegistryEntry: {
    name: "esrimapmodule",
    component: EsriMapModuleView,
    description: "Esri Map Integration Module",
  },
});

// ✅ Selector (matches scoped pattern)
export const selectEsriMapSettings = (state: RootState): ESRIMapModuleSettings => {
  const mod = selectModuleState<ESRIMapModuleState>(state, "esrimapmodule");
  return mod?.settings ?? initialState.settings;
};

export const { updateEsriSettings } = esriMapSlice.actions;

export default esriMapSlice.reducer;
