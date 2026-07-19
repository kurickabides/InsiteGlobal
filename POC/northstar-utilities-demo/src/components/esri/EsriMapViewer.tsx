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
import { EsriLayerConfig, EsriMapViewerProps, EsriMarkerConfig } from "./types";

const carSymbolPath = "M18.92 11c-.13-.38-.49-.64-.92-.64H6c-.43 0-.79.26-.92.64L3 17v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-6zM6.5 20c-.83 0-1.5-.67-1.5-1.5S5.67 17 6.5 17s1.5.67 1.5 1.5S7.33 20 6.5 20zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 15l1.5-4.5h11L19 15H5z";
const bucketTruckSymbolPath = "M1 18h2v2H1zm3 0h14v2H4zm15-5l1 2h3v3h-4zm-8-3l5-4h2l-5 4zm11-1h2v2h-2zm-3-3h3v2h-3zM5 20a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm14 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z";

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

function createMarkerSymbol(marker: EsriMarkerConfig) {
  return marker.icon
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
      angle: marker.angle,
      size: marker.size ?? 12,
      style: marker.shape ?? "circle",
      outline: {
        color: marker.outlineColor ?? "#ffffff",
        width: 2
      }
    };
}

async function refreshMarkerLayer(markerLayer: GraphicsLayer, markers: EsriMarkerConfig[]) {
  const [{ default: Graphic }, { default: Point }] = await Promise.all([
    import("@arcgis/core/Graphic"),
    import("@arcgis/core/geometry/Point")
  ]);

  markerLayer.removeAll();
  markers.forEach((marker) => {
    function addMarkerGraphic(symbol: ReturnType<typeof createMarkerSymbol>) {
      markerLayer.add(new Graphic({
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
      }));
    }

    if (marker.icon) {
      addMarkerGraphic({
        type: "simple-marker" as const,
        color: marker.color,
        path: marker.symbolPath ?? carSymbolPath,
        size: marker.size ?? 24,
        outline: {
          color: marker.outlineColor ?? "#ffffff",
          width: 1
        }
      } as unknown as ReturnType<typeof createMarkerSymbol>);
      return;
    }

    addMarkerGraphic(createMarkerSymbol(marker));
  });
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
  controls = { attribution: true, compass: true, legend: true, zoom: true },
  onMarkerClick,
  onReady,
  onViewpointChange
}: EsriMapViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<ArcGISMap | null>(null);
  const viewRef = useRef<MapView | null>(null);
  const markerLayerRef = useRef<GraphicsLayer | null>(null);
  const legendWidgetRef = useRef<{ visible: boolean } | null>(null);
  const markersRef = useRef(markers);
  const onMarkerClickRef = useRef(onMarkerClick);
  const onReadyRef = useRef(onReady);
  const onViewpointChangeRef = useRef(onViewpointChange);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const layerKey = useMemo(() => JSON.stringify(layers), [layers]);
  const markerKey = useMemo(() => JSON.stringify(markers), [markers]);

  useEffect(() => {
    markersRef.current = markers;
  }, [markers]);

  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick;
  }, [onMarkerClick]);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    onViewpointChangeRef.current = onViewpointChange;
  }, [onViewpointChange]);

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
          { default: Point },
          { default: Compass },
          { default: FeatureLayer },
          { default: Graphic },
          { default: Legend }
        ] = await Promise.all([
          import("@arcgis/core/Map"),
          import("@arcgis/core/views/MapView"),
          import("@arcgis/core/layers/GraphicsLayer"),
          import("@arcgis/core/geometry/Point"),
          import("@arcgis/core/widgets/Compass"),
          import("@arcgis/core/layers/FeatureLayer"),
          import("@arcgis/core/Graphic"),
          import("@arcgis/core/widgets/Legend")
        ]);

        if (cancelled || !containerRef.current) {
          return;
        }

        const map = new Map({ basemap });
        const resolvedLayers = await Promise.all(layers.map((layer) => createLayer(layer)));
        map.addMany(resolvedLayers);

        const markerLayer = new GraphicsLayer({ id: `${id}-markers`, title: "NorthStar demo markers" });
        await refreshMarkerLayer(markerLayer, markersRef.current);
        map.add(markerLayer);

        const legendLayer = new FeatureLayer({
          id: `${id}-legend`,
          title: "Dispatch Map Legend",
          source: [
            ["Regular Gas Work Order", 1],
            ["Regular Power Work Order", 2],
            ["Critical Gas Work Order", 3],
            ["Critical Power Work Order", 4],
            ["Emergency Gas Work Order", 5],
            ["Emergency Power Work Order", 6],
            ["Assigned Gas Work Order", 7],
            ["Assigned Power Work Order", 8],
            ["Emergency Assigned Gas Work Order", 9],
            ["Emergency Assigned Power Work Order", 10],
            ["Gas Investigator Crew", 11],
            ["Power Line or Vegetation Crew", 12],
            ["Other Gas Crew", 13],
            ["Other Power Crew", 14]
          ].map(([category, objectId]) => new Graphic({
            geometry: new Point({ longitude: -179.99, latitude: -84.99 }),
            attributes: { ObjectID: objectId, category }
          })),
          fields: [
            { name: "ObjectID", type: "oid" },
            { name: "category", type: "string" }
          ],
          objectIdField: "ObjectID",
          geometryType: "point",
          spatialReference: { wkid: 4326 },
          listMode: "hide",
          renderer: {
            type: "unique-value",
            field: "category",
            uniqueValueInfos: [
              {
                value: "Regular Gas Work Order",
                label: "Regular gas work order",
                symbol: {
                  type: "simple-marker",
                  color: "#16a34a",
                  size: 10,
                  style: "triangle",
                  outline: { color: "#ffffff", width: 2 }
                }
              },
              {
                value: "Regular Power Work Order",
                label: "Regular power work order",
                symbol: {
                  type: "simple-marker",
                  color: "#16a34a",
                  size: 10,
                  style: "triangle",
                  angle: 180,
                  outline: { color: "#ffffff", width: 2 }
                }
              },
              {
                value: "Critical Gas Work Order",
                label: "Critical gas work order",
                symbol: {
                  type: "simple-marker",
                  color: "#f97316",
                  size: 10,
                  style: "triangle",
                  outline: { color: "#ffffff", width: 2 }
                }
              },
              {
                value: "Critical Power Work Order",
                label: "Critical power work order",
                symbol: {
                  type: "simple-marker",
                  color: "#f97316",
                  size: 10,
                  style: "triangle",
                  angle: 180,
                  outline: { color: "#ffffff", width: 2 }
                }
              },
              {
                value: "Emergency Gas Work Order",
                label: "Emergency gas work order",
                symbol: {
                  type: "simple-marker",
                  color: "#dc2626",
                  size: 10,
                  style: "triangle",
                  outline: { color: "#ffffff", width: 2 }
                }
              },
              {
                value: "Emergency Power Work Order",
                label: "Emergency power work order",
                symbol: {
                  type: "simple-marker",
                  color: "#dc2626",
                  size: 10,
                  style: "triangle",
                  angle: 180,
                  outline: { color: "#ffffff", width: 2 }
                }
              },
              {
                value: "Assigned Gas Work Order",
                label: "Assigned gas work order",
                symbol: {
                  type: "simple-marker",
                  color: "#facc15",
                  size: 11,
                  style: "square",
                  outline: { color: "#ffffff", width: 2 }
                }
              },
              {
                value: "Assigned Power Work Order",
                label: "Assigned power work order",
                symbol: {
                  type: "simple-marker",
                  color: "#2563eb",
                  size: 11,
                  style: "square",
                  outline: { color: "#ffffff", width: 2 }
                }
              },
              {
                value: "Emergency Assigned Gas Work Order",
                label: "Emergency assigned gas work order",
                symbol: {
                  type: "simple-marker",
                  color: "#facc15",
                  size: 12,
                  style: "square",
                  outline: { color: "#dc2626", width: 3 }
                }
              },
              {
                value: "Emergency Assigned Power Work Order",
                label: "Emergency assigned power work order",
                symbol: {
                  type: "simple-marker",
                  color: "#2563eb",
                  size: 12,
                  style: "square",
                  outline: { color: "#dc2626", width: 3 }
                }
              },
              {
                value: "Gas Investigator Crew",
                label: "Gas investigator crew",
                symbol: {
                  type: "simple-marker",
                  color: "#facc15",
                  path: bucketTruckSymbolPath,
                  size: 18,
                  outline: { color: "#713f12", width: 1 }
                }
              },
              {
                value: "Power Line or Vegetation Crew",
                label: "Power line or vegetation crew",
                symbol: {
                  type: "simple-marker",
                  color: "#2563eb",
                  path: bucketTruckSymbolPath,
                  size: 18,
                  outline: { color: "#dbeafe", width: 1 }
                }
              },
              {
                value: "Other Gas Crew",
                label: "Other gas crew",
                symbol: {
                  type: "simple-marker",
                  color: "#facc15",
                  path: carSymbolPath,
                  size: 18,
                  outline: { color: "#713f12", width: 1 }
                }
              },
              {
                value: "Other Power Crew",
                label: "Other power crew",
                symbol: {
                  type: "simple-marker",
                  color: "#2563eb",
                  path: carSymbolPath,
                  size: 18,
                  outline: { color: "#dbeafe", width: 1 }
                }
              }
            ]
          }
        });
        map.add(legendLayer);

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

        const legendWidget = new Legend({
          view,
          layerInfos: [{ layer: legendLayer, title: "Legend" }]
        });
        legendWidget.visible = controls.legend !== false;
        view.ui.add(legendWidget, "bottom-left");

        async function findMarkerFromHitTest(event: Parameters<typeof view.hitTest>[0]) {
          const response = await view.hitTest(event);
          const markerGraphic = response.results.find((result) => {
            const graphic = "graphic" in result ? result.graphic : null;
            return graphic?.attributes?.northStarMarker === true;
          });
          const markerId = markerGraphic && "graphic" in markerGraphic ? markerGraphic.graphic.attributes?.id : null;
          return markersRef.current.find((candidate) => candidate.id === markerId) ?? null;
        }

        view.on("click", async (event: Parameters<typeof view.hitTest>[0]) => {
          const marker = await findMarkerFromHitTest(event);
          if (marker) {
            onMarkerClickRef.current?.(marker);
          }
        });

        view.on("pointer-move", async (event: Parameters<typeof view.hitTest>[0]) => {
          const marker = await findMarkerFromHitTest(event);
          if (view.container) {
            view.container.style.cursor = marker ? "pointer" : "default";
          }

          if (marker) {
            view.openPopup({
              title: marker.label,
              content: marker.popupContent ?? `NorthStar demo marker: ${marker.label}`,
              location: new Point({ longitude: marker.longitude, latitude: marker.latitude })
            });
          } else if (view.popup?.visible) {
            view.closePopup();
          }
        });

        mapRef.current = map;
        markerLayerRef.current = markerLayer;
        legendWidgetRef.current = legendWidget;
        viewRef.current = view;

        watcher = view.watch(["center", "zoom"], () => {
          onViewpointChangeRef.current?.({
            center: [view.center.longitude ?? center[0], view.center.latitude ?? center[1]],
            zoom: view.zoom ?? zoom
          });
        });

        await view.when();

        if (!cancelled) {
          setStatus("ready");
          onReadyRef.current?.(view);
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
      legendWidgetRef.current = null;
      mapRef.current = null;
    };
  }, [basemap, controls.compass, controls.zoom, height, id, layerKey, layers]);

  useEffect(() => {
    if (!legendWidgetRef.current) {
      return;
    }

    legendWidgetRef.current.visible = controls.legend !== false;
  }, [controls.legend]);

  useEffect(() => {
    if (!markerLayerRef.current) {
      return;
    }

    refreshMarkerLayer(markerLayerRef.current, markers);
  }, [markerKey, markers]);

  useEffect(() => {
    if (!viewRef.current || status !== "ready") {
      return;
    }

    viewRef.current.goTo({ center, zoom }, { animate: false });
  }, [center, status, zoom]);

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
