// ================================================
// ✅ Component: EsriMapViewer Types
// Description: Props and settings interfaces for ESRI map viewer
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: components/esriMapViewer/types.ts
// ================================================



// ================================================
// ✅ Enum: BasemapType
// Description: Supported Esri JS API basemap identifiers
// Source: https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap
// ================================================

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

export interface EsriMapViewerProps {
  center: [number, number];
  zoom: number;
  basemap?: BasemapType;
  height?: number; // ✅ now explicitly passed
}