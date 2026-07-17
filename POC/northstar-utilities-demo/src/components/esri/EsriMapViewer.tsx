// ================================================
// File: Esri Map Viewer
// Description: Renders a reusable ArcGIS Maps SDK for JavaScript map window for NorthStar app surfaces.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: EsriMapViewer.tsx
// Type: React TypeScript component file
// ================================================

import "@arcgis/core/assets/esri/themes/light/main.css";
import { CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import type ArcGISMap from "@arcgis/core/Map";
import type GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import type MapView from "@arcgis/core/views/MapView";
import { EsriLayerConfig, EsriMapViewerProps } from "./types";

async function createLayer(layer: EsriLayerConfig) {
  if (layer.type === "geojson") {
    const { default: GeoJSONLayer } = await import("@arcgis/core/layers/GeoJSONLayer");
    return new GeoJSONLayer({
      id: layer.id,
      title: layer.title,
      url: layer.url,
      visible: layer.visible,
      opacity: layer.opacity
    });
  }

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
  basemap = "osm",
  height = 460,
  layers = [],
  markers = [],
  controls = { attribution: true, compass: true, zoom: true },
  onMarkerClick,
  onReady,
  onViewpointChange
}: EsriMapViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<ArcGISMap | null>(null);
  const viewRef = useRef<MapView | null>(null);
  const markerLayerRef = useRef<GraphicsLayer | null>(null);
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
          const symbol = marker.icon
            ? {
              type: "text" as const,
              color: marker.color,
              text: marker.icon === "bucket" ? "🚒" : marker.icon === "van" ? "🚐" : marker.icon === "patrol" ? "🚙" : "🚚",
              font: {
                size: marker.size ?? 18,
                family: "Arial"
              },
              haloColor: marker.outlineColor ?? "#ffffff",
              haloSize: 1.5
            }
            : {
              type: "simple-marker" as const,
              color: marker.color,
              size: marker.size ?? 12,
              style: marker.shape ?? "circle",
              outline: {
                color: marker.outlineColor ?? "#ffffff",
                width: 2
              }
            };

          markerLayer.add(
            new Graphic({
              geometry: new Point({ longitude: marker.longitude, latitude: marker.latitude }),
              symbol,
              attributes: {
                id: marker.id,
                label: marker.label,
                northStarMarker: true
              },
              popupTemplate: {
                title: marker.label,
                content: marker.popupContent ?? `NorthStar demo marker: ${marker.label}`
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

        view.on("click", async (event: Parameters<typeof view.hitTest>[0]) => {
          const response = await view.hitTest(event);
          const markerGraphic = response.results.find((result) => {
            const graphic = "graphic" in result ? result.graphic : null;
            return graphic?.attributes?.northStarMarker === true;
          });
          const markerId = markerGraphic && "graphic" in markerGraphic ? markerGraphic.graphic.attributes?.id : null;
          const marker = markers.find((candidate) => candidate.id === markerId);
          if (marker) {
            onMarkerClick?.(marker);
          }
        });

        mapRef.current = map;
        markerLayerRef.current = markerLayer;
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
          setErrorMessage(error instanceof Error ? error.message : "The ArcGIS JavaScript map failed to load.");
        }
      }
    }

    loadMap();

    return () => {
      cancelled = true;
      watcher?.remove();
      viewRef.current?.destroy();
      viewRef.current = null;
      markerLayerRef.current = null;
      mapRef.current = null;
    };
  }, [basemap, center, controls.compass, controls.zoom, height, id, layerKey, markerKey, layers, markers, onMarkerClick, onReady, onViewpointChange, zoom]);

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
      <div style={{ position: "relative", minHeight: height, background: "linear-gradient(135deg, #dbeafe, #f8fafc)" }}>
        <div id={id} ref={containerRef} style={{ position: "absolute", inset: 0 }} />
        {status === "loading" && (
          <Stack alignItems="center" justifyContent="center" sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <CircularProgress size={28} />
            <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">Loading ArcGIS map...</Typography>
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
