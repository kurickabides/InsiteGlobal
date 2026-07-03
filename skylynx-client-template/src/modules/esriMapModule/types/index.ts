// ================================================
// ✅ Module Types: ESRIMapModule
// Description: Props and settings interface for Esri map module
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: /modules/ESRIMapModule/types.ts
// ================================================

import { SkylynxModuleSettings } from "../../../components/ui/types/uiWrappers";
import { BasemapType } from "../../../components/esri/types";

export interface ESRIMapModuleSettings extends SkylynxModuleSettings {
  center: [number, number];
  zoom: number;
  basemap: BasemapType;
  showScaleBar: boolean;
  enableDraw: boolean;
  showLegend: boolean;
  showLayerList: boolean;
  layerVisibility?: Record<string, boolean>; // layerID => visible
}

export interface ESRIMapModuleProps {
  settings: ESRIMapModuleSettings;
  onSettingsUpdate: (settings: ESRIMapModuleSettings) => void;
  children?: React.ReactNode;
}
export interface ESRIMapModuleState {
  settings: ESRIMapModuleSettings;
}