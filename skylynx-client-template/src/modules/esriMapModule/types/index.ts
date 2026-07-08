// ================================================
// Module Types: ESRIMapModule
// Description: Defines reusable Esri map module state, settings, and props for presentation-driven POCs.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: modules/esriMapModule/types/index.ts
// Type: TypeScript type definition file
// ================================================

import { ReactNode } from "react";
import { BasemapType, EsriMapControlOptions, EsriMapLayerConfig, EsriMapViewpoint } from "@/components/esri/types";

export interface ESRIMapModuleSettings extends EsriMapViewpoint {
  id: string;
  title: string;
  showTitle: boolean;
  basemap: BasemapType;
  height: number;
  controls: EsriMapControlOptions;
  layers: EsriMapLayerConfig[];
}

export interface ESRIMapModuleProps {
  settings?: Partial<ESRIMapModuleSettings>;
  onSettingsUpdate?: (settings: ESRIMapModuleSettings) => void;
  children?: ReactNode;
}

export interface ESRIMapModuleState {
  settings: ESRIMapModuleSettings;
}
