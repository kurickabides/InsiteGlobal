// ================================================
// File: Esri Map Viewer
// Description: Renders a reusable ArcGIS map window for NorthStar presentation surfaces.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: EsriMapViewer.tsx
// Type: React TypeScript component file
// ================================================

import "@arcgis/core/assets/esri/themes/light/main.css";
import { Box, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import type ArcGISMap from "@arcgis/core/Map";
import type MapView from "@arcgis/core/views/MapView";
import { EsriLayerConfig, EsriMapViewerProps } from "./types";

async function createLayer(layer: EsriLayerConfig) {
  if (layer.type === "feature") {
    const { default: FeatureLayer } = await import("@arcgis/core/layers/FeatureLayer");
    return new FeatureLayer(layer);
  }

  if (layer.type === "map-image") {
    const { default: MapImageLayer } = await import("@arcgis/core/layers/MapImageLayer");
    return new MapImageLayer(layer);
  }

  if (layer.type === "tile") {
    const { default: TileLayer } = await import("@arcgis/core/layers/TileLayer");
    return new TileLayer(layer);
  }

  const { default: VectorTileLayer } = await import("@arcgis/core/layers/VectorTileLayer");
  return new VectorTileLayer(layer);
}

export function EsriMapViewer({
  id = "northstar-esri-map",
  title,
  center,
  zoom,
  basemap = "streets-vector",
  height = 460,
  layers = [],
  markers = [],
  controls = { attribution: true, compass: true, zoom: true },
  onReady,
  onViewpointChange
}: EsriMapViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<ArcGISMap | null>(null);
  const viewRef = useRef<MapView | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const layerKey = useMemo(() => JSON.stringify(layers), [layers]);
  const markerKey = useMemo(() => JSON.stringify(markers), [markers]);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    let cancelled = false;
    let watcher: { remove: () => void } | null = null;

    async function loadMap() {
      try {
        setStatus("loading");
        setErrorMessage(null);

        const [
          { default: Map },
          { default: MapView },
          { default: GraphicsLayer },
          { default: Graphic },
          { default: Point },
          { default: Compass }
        ] = await Promise.all([
          import("@arcgis/core/Map"),
          import("@arcgis/core/views/MapView"),
          import("@arcgis/core/layers/GraphicsLayer"),
          import("@arcgis/core/Graphic"),
          import("@arcgis/core/geometry/Point"),
          import("@arcgis/core/widgets/Compass")
        ]);

        if (cancelled || !containerRef.current) {
          return;
        }

        const map = new Map({ basemap });
        const resolvedLayers = await Promise.all(layers.map((layer) => createLayer(layer)));
        map.addMany(resolvedLayers);

        const markerLayer = new GraphicsLayer({ id: `${id}-markers`, title: "NorthStar demo markers" });
        markers.forEach((marker) => {
          markerLayer.add(
            new Graphic({
              geometry: new Point({ longitude: marker.longitude, latitude: marker.latitude }),
              symbol: {
                type: "simple-marker",
                color: marker.color,
                size: marker.size ?? 12,
                outline: {
                  color: marker.outlineColor ?? "#ffffff",
                  width: 2
                }
              },
              attributes: {
                id: marker.id,
                label: marker.label
              },
              popupTemplate: {
                title: marker.label,
                content: `Demo marker: ${marker.label}`
              }
            })
          );
        });
        map.add(markerLayer);

        const view = new MapView({
          container: containerRef.current,
          map,
          center,
          zoom,
          popupEnabled: true,
          ui: {
            components: controls.zoom === false ? [] : ["zoom"]
          }
        });

        if (controls.compass !== false) {
          view.ui.add(new Compass({ view }), "top-left");
        }

        mapRef.current = map;
        viewRef.current = view;

        watcher = view.watch(["center", "zoom"], () => {
          onViewpointChange?.({
            center: [view.center.longitude ?? center[0], view.center.latitude ?? center[1]],
            zoom: view.zoom ?? zoom
          });
        });

        await view.when();

        if (!cancelled) {
          setStatus("ready");
          onReady?.(view);
        }
      } catch (error) {
        if (!cancelled) {
          setStatus("error");
          setErrorMessage(error instanceof Error ? error.message : "The Esri map failed to load.");
        }
      }
    }

    loadMap();

    return () => {
      cancelled = true;
      watcher?.remove();
      viewRef.current?.destroy();
      viewRef.current = null;
      mapRef.current = null;
    };
  }, [basemap, center, controls.compass, controls.zoom, height, id, layerKey, markerKey, layers, markers, onReady, onViewpointChange, zoom]);

  return (
    <Paper variant="outlined" sx={{ height: "100%", overflow: "hidden" }}>
      {title && (
        <Stack spacing={0.5} sx={{ px: 2, py: 1.5 }}>
          <Typography fontWeight={900}>{title}</Typography>
          <Typography color="text.secondary" variant="body2">
            Center {center[1].toFixed(3)}, {center[0].toFixed(3)} · Zoom {zoom}
          </Typography>
        </Stack>
      )}
      <Box sx={{ position: "relative", minHeight: height, background: "linear-gradient(135deg, #dbeafe, #f8fafc)" }}>
        <Box id={id} ref={containerRef} sx={{ position: "absolute", inset: 0 }} />
        {status === "loading" && (
          <Stack alignItems="center" justifyContent="center" sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <CircularProgress size={28} />
            <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">Loading Esri map...</Typography>
          </Stack>
        )}
        {status === "error" && (
          <Stack alignItems="center" justifyContent="center" sx={{ position: "absolute", inset: 0, p: 3, textAlign: "center" }}>
            <Typography fontWeight={900}>Map unavailable</Typography>
            <Typography color="text.secondary" variant="body2">{errorMessage}</Typography>
          </Stack>
        )}
      </Box>
    </Paper>
  );
}
