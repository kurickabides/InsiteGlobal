// ================================================
// File: Field Map Module Types
// Description: Defines the NorthStar local map module settings and props.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: index.ts
// Type: TypeScript type definition file
// ================================================

import { ReactNode } from "react";
import { EsriBasemap, EsriLayerConfig, EsriMapControlOptions, EsriMarkerConfig, EsriViewpoint } from "../../../components/esri/types";

export interface EsriMapModuleSettings extends EsriViewpoint {
  id: string;
  title: string;
  basemap: EsriBasemap;
  height: number;
  controls: EsriMapControlOptions;
  layers: EsriLayerConfig[];
  markers: EsriMarkerConfig[];
}

export interface EsriMapModuleProps {
  settings?: Partial<EsriMapModuleSettings>;
  children?: ReactNode;
}
