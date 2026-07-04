// ================================================
// Slice: esriMapSlice
// Description: Redux slice for reusable Esri map window settings and controls.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: modules/esriMapModule/esriMapSlice.ts
// Type: TypeScript Redux slice file
// ================================================

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/appStore/store";
import { BasemapType, EsriMapLayerConfig, EsriMapViewpoint } from "@/components/esri/types";
import { ESRIMapModuleSettings, ESRIMapModuleState } from "@/modules/esriMapModule/types";

export const defaultEsriMapSettings: ESRIMapModuleSettings = {
  id: "default-esri-map",
  title: "Reusable Esri Map Window",
  showTitle: true,
  zoom: 13,
  center: [-122.67, 45.52],
  height: 520,
  basemap: BasemapType.Hybrid,
  controls: {
    attribution: true,
    compass: true,
    popup: true,
    zoom: true
  },
  layers: []
};

const initialState: ESRIMapModuleState = {
  settings: defaultEsriMapSettings
};

const esriMapSlice = createSlice({
  name: "esriMap",
  initialState,
  reducers: {
    updateEsriSettings: (state, action: PayloadAction<Partial<ESRIMapModuleSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    setEsriViewpoint: (state, action: PayloadAction<Partial<EsriMapViewpoint>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    setEsriBasemap: (state, action: PayloadAction<BasemapType>) => {
      state.settings.basemap = action.payload;
    },
    setEsriLayers: (state, action: PayloadAction<EsriMapLayerConfig[]>) => {
      state.settings.layers = action.payload;
    },
    resetEsriMap: (state) => {
      state.settings = defaultEsriMapSettings;
    }
  }
});

export const selectEsriMapSettings = (state: RootState): ESRIMapModuleSettings => state.esriMap.settings;

export const { resetEsriMap, setEsriBasemap, setEsriLayers, setEsriViewpoint, updateEsriSettings } = esriMapSlice.actions;

export default esriMapSlice.reducer;
