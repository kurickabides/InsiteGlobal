// ================================================
// File: Free Map Viewer
// Description: Renders a dependency-free SVG map window for NorthStar presentation surfaces.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: EsriMapViewer.tsx
// Type: React TypeScript component file
// ================================================

import { CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { EsriLayerConfig, EsriMapViewerProps, EsriMarkerConfig } from "./types";

type Position = [number, number];

interface GeoJsonFeature {
  type: "Feature";
  geometry: GeoJsonGeometry | null;
  properties?: Record<string, string | number | boolean | null>;
}

interface GeoJsonFeatureCollection {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
}

type GeoJsonGeometry =
  | { type: "Point"; coordinates: Position }
  | { type: "MultiPoint"; coordinates: Position[] }
  | { type: "LineString"; coordinates: Position[] }
  | { type: "MultiLineString"; coordinates: Position[][] }
  | { type: "Polygon"; coordinates: Position[][] }
  | { type: "MultiPolygon"; coordinates: Position[][][] };

interface LoadedLayer {
  config: EsriLayerConfig;
  data: GeoJsonFeatureCollection;
}

interface Bounds {
  minLon: number;
  maxLon: number;
  minLat: number;
  maxLat: number;
}

function expandBounds(bounds: Bounds, [lon, lat]: Position): Bounds {
  return {
    minLon: Math.min(bounds.minLon, lon),
    maxLon: Math.max(bounds.maxLon, lon),
    minLat: Math.min(bounds.minLat, lat),
    maxLat: Math.max(bounds.maxLat, lat)
  };
}

function visitPositions(geometry: GeoJsonGeometry | null, visitor: (position: Position) => void) {
  if (!geometry) {
    return;
  }

  if (geometry.type === "Point") {
    visitor(geometry.coordinates);
  } else if (geometry.type === "MultiPoint" || geometry.type === "LineString") {
    geometry.coordinates.forEach(visitor);
  } else if (geometry.type === "MultiLineString" || geometry.type === "Polygon") {
    geometry.coordinates.flat().forEach(visitor);
  } else {
    geometry.coordinates.flat(2).forEach(visitor);
  }
}

function getBounds(layers: LoadedLayer[], markers: EsriMarkerConfig[], center: Position): Bounds {
  let bounds: Bounds = {
    minLon: center[0],
    maxLon: center[0],
    minLat: center[1],
    maxLat: center[1]
  };

  layers.forEach((layer) => {
    layer.data.features.forEach((feature) => {
      visitPositions(feature.geometry, (position) => {
        bounds = expandBounds(bounds, position);
      });
    });
  });

  markers.forEach((marker) => {
    bounds = expandBounds(bounds, [marker.longitude, marker.latitude]);
  });

  const lonPadding = Math.max((bounds.maxLon - bounds.minLon) * 0.12, 0.01);
  const latPadding = Math.max((bounds.maxLat - bounds.minLat) * 0.12, 0.01);

  return {
    minLon: bounds.minLon - lonPadding,
    maxLon: bounds.maxLon + lonPadding,
    minLat: bounds.minLat - latPadding,
    maxLat: bounds.maxLat + latPadding
  };
}

function project([lon, lat]: Position, bounds: Bounds, width: number, height: number): Position {
  const x = ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon || 1)) * width;
  const y = height - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat || 1)) * height;

  return [x, y];
}

function pointsToPath(points: Position[], bounds: Bounds, width: number, height: number): string {
  return points
    .map((position, index) => {
      const [x, y] = project(position, bounds, width, height);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function getLayerColor(layer: EsriLayerConfig, index: number): string {
  const title = layer.title.toLowerCase();

  if (title.includes("customer")) {
    return "#2563eb";
  }

  if (title.includes("gas")) {
    return "#dc2626";
  }

  if (title.includes("electric") || title.includes("power")) {
    return "#f59e0b";
  }

  return ["#0f766e", "#7c3aed", "#475569"][index % 3];
}

function renderGeometry(
  feature: GeoJsonFeature,
  layer: EsriLayerConfig,
  bounds: Bounds,
  width: number,
  height: number,
  color: string,
  key: string
) {
  const opacity = layer.opacity ?? 0.85;

  if (!feature.geometry) {
    return null;
  }

  if (feature.geometry.type === "Point") {
    const [x, y] = project(feature.geometry.coordinates, bounds, width, height);
    return <circle key={key} cx={x} cy={y} r={4} fill={color} opacity={opacity} />;
  }

  if (feature.geometry.type === "MultiPoint") {
    return feature.geometry.coordinates.map((position, index) => {
      const [x, y] = project(position, bounds, width, height);
      return <circle key={`${key}-${index}`} cx={x} cy={y} r={4} fill={color} opacity={opacity} />;
    });
  }

  if (feature.geometry.type === "LineString") {
    return <path key={key} d={pointsToPath(feature.geometry.coordinates, bounds, width, height)} fill="none" stroke={color} strokeLinecap="round" strokeWidth={4} opacity={opacity} />;
  }

  if (feature.geometry.type === "MultiLineString") {
    return feature.geometry.coordinates.map((line, index) => (
      <path key={`${key}-${index}`} d={pointsToPath(line, bounds, width, height)} fill="none" stroke={color} strokeLinecap="round" strokeWidth={4} opacity={opacity} />
    ));
  }

  if (feature.geometry.type === "Polygon") {
    return feature.geometry.coordinates.map((ring, index) => (
      <path key={`${key}-${index}`} d={`${pointsToPath(ring, bounds, width, height)} Z`} fill={color} fillOpacity={0.16} stroke={color} strokeWidth={2} opacity={opacity} />
    ));
  }

  return feature.geometry.coordinates.flatMap((polygon, polygonIndex) =>
    polygon.map((ring, ringIndex) => (
      <path key={`${key}-${polygonIndex}-${ringIndex}`} d={`${pointsToPath(ring, bounds, width, height)} Z`} fill={color} fillOpacity={0.16} stroke={color} strokeWidth={2} opacity={opacity} />
    ))
  );
}

export function EsriMapViewer({
  id = "northstar-free-map",
  title,
  center,
  zoom,
  height = 460,
  layers = [],
  markers = [],
  onReady,
  onViewpointChange
}: EsriMapViewerProps) {
  const [loadedLayers, setLoadedLayers] = useState<LoadedLayer[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const layerKey = useMemo(() => JSON.stringify(layers), [layers]);
  const width = 960;
  const svgHeight = 540;

  useEffect(() => {
    let cancelled = false;

    async function loadLayers() {
      try {
        setStatus("loading");
        setErrorMessage(null);
        const nextLayers = await Promise.all(
          layers
            .filter((layer) => layer.visible !== false && layer.type === "geojson")
            .map(async (layer) => {
              const response = await fetch(layer.url);

              if (!response.ok) {
                throw new Error(`Unable to load ${layer.title}: ${response.status} ${response.statusText}`);
              }

              return {
                config: layer,
                data: (await response.json()) as GeoJsonFeatureCollection
              };
            })
        );

        if (!cancelled) {
          setLoadedLayers(nextLayers);
          setStatus("ready");
          onReady?.(null);
          onViewpointChange?.({ center, zoom });
        }
      } catch (error) {
        if (!cancelled) {
          setStatus("error");
          setErrorMessage(error instanceof Error ? error.message : "The free map failed to load.");
        }
      }
    }

    loadLayers();

    return () => {
      cancelled = true;
    };
  }, [center, layerKey, layers, onReady, onViewpointChange, zoom]);

  const bounds = useMemo(() => getBounds(loadedLayers, markers, center), [center, loadedLayers, markers]);

  return (
    <Paper variant="outlined" sx={{ height: "100%", overflow: "hidden" }}>
      {title && (
        <Stack spacing={0.5} sx={{ px: 2, py: 1.5 }}>
          <Typography fontWeight={900}>{title}</Typography>
          <Typography color="text.secondary" variant="body2">
            Center {center[1].toFixed(3)}, {center[0].toFixed(3)} - Zoom {zoom}
          </Typography>
        </Stack>
      )}
      <div style={{ position: "relative", minHeight: height, background: "linear-gradient(135deg, #e0f2fe, #f8fafc)" }}>
        <svg id={id} role="img" aria-label={title ?? "NorthStar operations map"} viewBox={`0 0 ${width} ${svgHeight}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <pattern id={`${id}-grid`} width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#cbd5e1" strokeWidth="1" opacity="0.7" />
            </pattern>
          </defs>
          <rect width={width} height={svgHeight} fill={`url(#${id}-grid)`} />
          <path d="M 70 420 C 180 360 220 300 330 315 S 520 420 640 330 800 210 900 250" fill="none" stroke="#bae6fd" strokeWidth="54" strokeLinecap="round" opacity="0.65" />
          {loadedLayers.map((layer, layerIndex) => {
            const color = getLayerColor(layer.config, layerIndex);
            return layer.data.features.map((feature, featureIndex) =>
              renderGeometry(feature, layer.config, bounds, width, svgHeight, color, `${layer.config.id}-${featureIndex}`)
            );
          })}
          {markers.map((marker) => {
            const [x, y] = project([marker.longitude, marker.latitude], bounds, width, svgHeight);
            return (
              <g key={marker.id}>
                <circle cx={x} cy={y} r={(marker.size ?? 14) + 7} fill={marker.color} opacity="0.18" />
                <circle cx={x} cy={y} r={marker.size ?? 14} fill={marker.color} stroke={marker.outlineColor ?? "#ffffff"} strokeWidth="3" />
                <text x={x + 16} y={y - 12} fill="#0f172a" fontSize="24" fontWeight="800" paintOrder="stroke" stroke="#ffffff" strokeWidth="5">{marker.label}</text>
              </g>
            );
          })}
        </svg>
        {status === "loading" && (
          <Stack alignItems="center" justifyContent="center" sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <CircularProgress size={28} />
            <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">Loading local map data...</Typography>
          </Stack>
        )}
        {status === "error" && (
          <Stack alignItems="center" justifyContent="center" sx={{ position: "absolute", inset: 0, p: 3, textAlign: "center" }}>
            <Typography fontWeight={900}>Map unavailable</Typography>
            <Typography color="text.secondary" variant="body2">{errorMessage}</Typography>
          </Stack>
        )}
      </div>
    </Paper>
  );
}
