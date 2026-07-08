// ================================================
// File: Demo Data Service
// Description: Loads NorthStar mock data and resolves story-specific map layers for presentation pages.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: demoDataService.ts
// Type: TypeScript service file
// ================================================

import { EsriLayerConfig, EsriMarkerConfig } from "../components/esri/types";

const mockDataRoot = "/mock-data";

export interface NorthStarDemoManifest {
  demoName: string;
  scenarioDate: string;
  stories: NorthStarDemoStory[];
  dataFiles: string[];
}

export interface NorthStarDemoStory {
  storyId: string;
  title: string;
  heroWorkOrderNumber: string;
  recommendedCrewName: string;
  summary: string;
  affectedCustomers?: number;
  mapFiles: string[];
}

export interface NorthStarWorkOrder {
  workOrderId: number;
  workOrderNumber: string;
  latitude: number;
  longitude: number;
  priority: string;
  status: string;
  storyId: string;
  affectedCustomers: number | null;
  relatedGeoJsonFiles: string[];
  customerGeoJsonFile: string | null;
  customerGeoJsonFilter: Record<string, string | number | boolean> | null;
}

interface GeoJsonFeature {
  type: "Feature";
  geometry: unknown;
  properties?: Record<string, string | number | boolean | null>;
}

interface GeoJsonFeatureCollection {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
}

export interface ResolvedStoryMap {
  manifest: NorthStarDemoManifest;
  story: NorthStarDemoStory;
  workOrder: NorthStarWorkOrder;
  layers: EsriLayerConfig[];
  markers: EsriMarkerConfig[];
  customerCount: number | null;
  cleanup: () => void;
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Unable to load ${path}: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

function toAbsoluteMockDataPath(fileNameOrPath: string): string {
  return fileNameOrPath.startsWith("/") ? fileNameOrPath : `${mockDataRoot}/${fileNameOrPath}`;
}

function toLayerTitle(path: string): string {
  return path
    .split("/")
    .pop()
    ?.replace(".geojson", "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") ?? "GeoJSON Layer";
}

function matchesFilter(feature: GeoJsonFeature, filter: Record<string, string | number | boolean>): boolean {
  return Object.entries(filter).every(([key, value]) => feature.properties?.[key] === value);
}

function createGeoJsonLayer(path: string, index: number, title = toLayerTitle(path)): EsriLayerConfig {
  return {
    id: `northstar-layer-${index}-${path.split("/").pop()?.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`,
    title,
    type: "geojson",
    url: path,
    visible: true,
    opacity: title.includes("Customer") ? 0.95 : 0.8
  };
}

export async function loadNorthStarDemoManifest(): Promise<NorthStarDemoManifest> {
  return fetchJson<NorthStarDemoManifest>(`${mockDataRoot}/northstar-demo-manifest.json`);
}

export async function loadNorthStarWorkOrders(): Promise<NorthStarWorkOrder[]> {
  return fetchJson<NorthStarWorkOrder[]>(`${mockDataRoot}/work-orders.json`);
}

export async function resolveStoryMap(storyId = "power-branch-outage"): Promise<ResolvedStoryMap> {
  const [manifest, workOrders] = await Promise.all([
    loadNorthStarDemoManifest(),
    loadNorthStarWorkOrders()
  ]);
  const story = manifest.stories.find((candidate) => candidate.storyId === storyId) ?? manifest.stories[0];

  if (!story) {
    throw new Error("The NorthStar demo manifest does not include any stories.");
  }

  const workOrder = workOrders.find((candidate) => candidate.workOrderNumber === story.heroWorkOrderNumber);

  if (!workOrder) {
    throw new Error(`No work order found for story ${story.storyId}.`);
  }

  const layers = workOrder.relatedGeoJsonFiles
    .map(toAbsoluteMockDataPath)
    .map((layerPath, index) => createGeoJsonLayer(layerPath, index));
  const objectUrls: string[] = [];
  let customerCount: number | null = null;

  if (workOrder.customerGeoJsonFile) {
    const customerGeoJson = await fetchJson<GeoJsonFeatureCollection>(workOrder.customerGeoJsonFile);
    const filteredFeatures = workOrder.customerGeoJsonFilter
      ? customerGeoJson.features.filter((feature) => matchesFilter(feature, workOrder.customerGeoJsonFilter ?? {}))
      : customerGeoJson.features;
    const filteredGeoJson: GeoJsonFeatureCollection = {
      ...customerGeoJson,
      features: filteredFeatures
    };
    const objectUrl = URL.createObjectURL(new Blob([JSON.stringify(filteredGeoJson)], { type: "application/geo+json" }));
    objectUrls.push(objectUrl);
    layers.push(createGeoJsonLayer(objectUrl, layers.length, "Affected Customers"));
    customerCount = filteredFeatures.length;
  }

  const markers: EsriMarkerConfig[] = [
    {
      id: workOrder.workOrderNumber,
      label: `${workOrder.workOrderNumber} · ${story.title}`,
      longitude: workOrder.longitude,
      latitude: workOrder.latitude,
      color: story.storyId.includes("gas") ? "#dc2626" : "#f59e0b",
      size: 16
    }
  ];

  return {
    manifest,
    story,
    workOrder,
    layers,
    markers,
    customerCount,
    cleanup: () => objectUrls.forEach((objectUrl) => URL.revokeObjectURL(objectUrl))
  };
}
