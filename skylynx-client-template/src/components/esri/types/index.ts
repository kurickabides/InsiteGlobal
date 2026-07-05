// ================================================
// Component: Esri Map Viewer Types
// Description: Defines reusable map window configuration, layer definitions, controls, and imperative viewer API.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: components/esri/types/index.ts
// Type: TypeScript type definition file
// ================================================

import type MapView from "@arcgis/core/views/MapView";

export enum BasemapType {
  Topo = "topo-vector",
  Streets = "streets-vector",
  Satellite = "satellite",
  Hybrid = "hybrid",
  Terrain = "terrain",
  DarkGray = "dark-gray-vector",
  LightGray = "gray-vector",
  NationalGeographic = "national-geographic",
  Oceans = "oceans",
  Imagery = "imagery",
  OpenStreetMap = "osm",
  Navigation = "navigation-vector"
}

export type EsriMapLayerType = "feature" | "map-image" | "tile" | "vector-tile";

export interface EsriMapViewpoint {
  center: [number, number];
  zoom: number;
}

export interface EsriMapLayerConfig {
  id: string;
  title: string;
  url: string;
  type: EsriMapLayerType;
  visible?: boolean;
  opacity?: number;
}

export interface EsriMapControlOptions {
  zoom?: boolean;
  compass?: boolean;
  attribution?: boolean;
  popup?: boolean;
}

export interface EsriMapViewerHandle {
  getView: () => MapView | null;
  goTo: (viewpoint: Partial<EsriMapViewpoint>) => Promise<void>;
  setBasemap: (basemap: BasemapType) => void;
}

export interface EsriMapViewerProps {
  id?: string;
  title?: string;
  center: [number, number];
  zoom: number;
  basemap?: BasemapType;
  height?: number;
  layers?: EsriMapLayerConfig[];
  controls?: EsriMapControlOptions;
  onReady?: (view: MapView) => void;
  onViewpointChange?: (viewpoint: EsriMapViewpoint) => void;
}
