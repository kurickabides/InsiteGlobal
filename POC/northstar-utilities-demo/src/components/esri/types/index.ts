// ================================================
// File: Field Map Viewer Types
// Description: Defines reusable local map configuration, markers, layers, controls, and viewer callbacks.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: index.ts
// Type: TypeScript type definition file
// ================================================

export type EsriBasemap =
  | "streets-vector"
  | "topo-vector"
  | "hybrid"
  | "satellite"
  | "dark-gray-vector"
  | "gray-vector"
  | "navigation-vector"
  | "osm";

export type EsriLayerType = "feature" | "geojson" | "map-image" | "tile" | "vector-tile";

export interface EsriViewpoint {
  center: [number, number];
  zoom: number;
}

export interface EsriLayerConfig {
  id: string;
  title: string;
  url: string;
  type: EsriLayerType;
  visible?: boolean;
  opacity?: number;
}

export interface EsriMarkerConfig {
  id: string;
  label: string;
  longitude: number;
  latitude: number;
  color: string;
  outlineColor?: string;
  size?: number;
}

export interface EsriMapControlOptions {
  attribution?: boolean;
  compass?: boolean;
  zoom?: boolean;
}

export interface EsriMapViewerProps extends EsriViewpoint {
  id?: string;
  title?: string;
  basemap?: EsriBasemap;
  height?: number;
  layers?: EsriLayerConfig[];
  markers?: EsriMarkerConfig[];
  controls?: EsriMapControlOptions;
  onReady?: (view: null) => void;
  onViewpointChange?: (viewpoint: EsriViewpoint) => void;
}
