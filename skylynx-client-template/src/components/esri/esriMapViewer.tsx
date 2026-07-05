// ================================================
// Component: EsriMapViewer
// Description: Reusable Esri JS API map window with layer loading and imperative controls.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: components/esri/esriMapViewer.tsx
// Type: React TypeScript component file
// ================================================

import "@arcgis/core/assets/esri/themes/light/main.css";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import type Map from "@arcgis/core/Map";
import type MapView from "@arcgis/core/views/MapView";

import {
  ContainerEsriMapViewer,
  MapDivEsriMapViewer,
  TitleEsriMapViewer
} from "@/components/esri/styled";

import {
  BasemapType,
  EsriMapLayerConfig,
  EsriMapViewerHandle,
  EsriMapViewerProps
} from "@/components/esri/types";

async function createLayer(layer: EsriMapLayerConfig) {
  const { type, ...layerOptions } = layer;

  if (type === "feature") {
    const { default: FeatureLayer } = await import("@arcgis/core/layers/FeatureLayer");
    return new FeatureLayer(layerOptions as __esri.FeatureLayerProperties);
  }

  if (type === "map-image") {
    const { default: MapImageLayer } = await import("@arcgis/core/layers/MapImageLayer");
    return new MapImageLayer(layerOptions as __esri.MapImageLayerProperties);
  }

  if (type === "tile") {
    const { default: TileLayer } = await import("@arcgis/core/layers/TileLayer");
    return new TileLayer(layerOptions as __esri.TileLayerProperties);
  }

  if (type === "vector-tile") {
    const { default: VectorTileLayer } = await import("@arcgis/core/layers/VectorTileLayer");
    return new VectorTileLayer(layerOptions as __esri.VectorTileLayerProperties);
  }

  throw new Error(`Unsupported Esri layer type: ${type}`);
}

const EsriMapViewer = forwardRef<EsriMapViewerHandle, EsriMapViewerProps>(
  (
    {
      id = "skylynx-esri-map",
      title,
      center = [-122.67, 45.52],
      zoom = 13,
      basemap = BasemapType.OpenStreetMap,
      height = 600,
      layers = [],
      controls = {
        attribution: true,
        compass: true,
        popup: true,
        zoom: true
      },
      onReady,
      onViewpointChange
    },
    ref
  ) => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapViewRef = useRef<MapView | null>(null);
    const mapInstanceRef = useRef<Map | null>(null);

    const onReadyRef = useRef(onReady);
    const onViewpointChangeRef = useRef(onViewpointChange);

    useEffect(() => {
      onReadyRef.current = onReady;
    }, [onReady]);

    useEffect(() => {
      onViewpointChangeRef.current = onViewpointChange;
    }, [onViewpointChange]);

    useImperativeHandle(ref, () => ({
      getView: () => mapViewRef.current,

      goTo: async (viewpoint) => {
        const view = mapViewRef.current;

        if (!view) {
          return;
        }

        await view.goTo({
          ...(viewpoint.center ? { center: viewpoint.center } : {}),
          ...(viewpoint.zoom !== undefined ? { zoom: viewpoint.zoom } : {})
        });
      },

      setBasemap: (nextBasemap) => {
        const map = mapInstanceRef.current;

        if (map) {
          map.basemap = nextBasemap;
        }
      }
    }));

    useEffect(() => {
      if (!mapRef.current || mapViewRef.current) {
        return;
      }

      let cancelled = false;
      let viewpointWatcher: { remove: () => void } | null = null;
      let readyFrameId: number | null = null;

      const loadMap = async () => {
        try {
          const [{ default: ArcGISMap }, { default: MapView }] = await Promise.all([
            import("@arcgis/core/Map"),
            import("@arcgis/core/views/MapView")
          ]);

          if (cancelled || !mapRef.current) {
            return;
          }

          const uiComponents: string[] = [];

          if (controls.zoom !== false) {
            uiComponents.push("zoom");
          }

          if (controls.attribution !== false) {
            uiComponents.push("attribution");
          }

          const map = new ArcGISMap({
            basemap
          });

          const view = new MapView({
            container: mapRef.current,
            map,
            center,
            zoom,
            popupEnabled: controls.popup !== false,
            ui: {
              components: uiComponents
            }
          });

          mapInstanceRef.current = map;
          mapViewRef.current = view;

          const mapLayers = await Promise.all(layers.map((layer) => createLayer(layer)));

          if (!cancelled && mapLayers.length > 0) {
            map.addMany(mapLayers);
          }

          if (!cancelled && controls.compass !== false) {
            const { default: Compass } = await import("@arcgis/core/widgets/Compass");
            view.ui.add(new Compass({ view }), "top-left");
          }

          viewpointWatcher = view.watch(["center", "zoom"], () => {
            const longitude = view.center?.longitude ?? center[0];
            const latitude = view.center?.latitude ?? center[1];

            onViewpointChangeRef.current?.({
              center: [longitude, latitude],
              zoom: view.zoom ?? zoom
            });
          });

          await view.when();

          if (!cancelled) {
            readyFrameId = window.requestAnimationFrame(() => {
              onReadyRef.current?.(view);
            });
          }
        } catch (error) {
          console.error("Failed to load Esri map viewer.", error);
        }
      };

      loadMap();

      return () => {
        cancelled = true;

        if (readyFrameId !== null) {
          window.cancelAnimationFrame(readyFrameId);
        }

        viewpointWatcher?.remove();

        const view = mapViewRef.current;

        if (view) {
          view.container = null;
          view.destroy();
        }

        mapViewRef.current = null;
        mapInstanceRef.current = null;
      };

      // IMPORTANT:
      // This effect intentionally runs once.
      // Do not add center, zoom, layers, controls, or callbacks here.
      // Adding them will recreate the Esri MapView while the user zooms/pans.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <ContainerEsriMapViewer id={id}>
        {title && <TitleEsriMapViewer variant="subtitle1">{title}</TitleEsriMapViewer>}

        <MapDivEsriMapViewer ref={mapRef} height={height} />
      </ContainerEsriMapViewer>
    );
  }
);

EsriMapViewer.displayName = "EsriMapViewer";

export default EsriMapViewer;