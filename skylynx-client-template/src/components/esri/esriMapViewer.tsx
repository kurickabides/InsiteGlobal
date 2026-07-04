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
import { ContainerEsriMapViewer, MapDivEsriMapViewer, TitleEsriMapViewer } from "@/components/esri/styled";
import { BasemapType, EsriMapLayerConfig, EsriMapViewerHandle, EsriMapViewerProps } from "@/components/esri/types";

async function createLayer(layer: EsriMapLayerConfig) {
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

const EsriMapViewer = forwardRef<EsriMapViewerHandle, EsriMapViewerProps>(
  (
    {
      id = "skylynx-esri-map",
      title,
      center,
      zoom,
      basemap = BasemapType.Hybrid,
      height = 600,
      layers = [],
      controls = { attribution: true, compass: true, popup: true, zoom: true },
      onReady,
      onViewpointChange
    },
    ref
  ) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapViewRef = useRef<MapView | null>(null);
    const mapInstanceRef = useRef<Map | null>(null);

    useImperativeHandle(ref, () => ({
      getView: () => mapViewRef.current,
      goTo: async (viewpoint) => {
        if (!mapViewRef.current) {
          return;
        }

        await mapViewRef.current.goTo({
          ...(viewpoint.center ? { center: viewpoint.center } : {}),
          ...(viewpoint.zoom ? { zoom: viewpoint.zoom } : {})
        });
      },
      setBasemap: (nextBasemap) => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.basemap = nextBasemap;
        }
      }
    }));

    useEffect(() => {
      if (!mapRef.current) {
        return undefined;
      }

      let cancelled = false;
      let viewpointWatcher: { remove: () => void } | null = null;

      const loadMap = async () => {
        const [{ default: ArcGISMap }, { default: MapView }] = await Promise.all([
          import("@arcgis/core/Map"),
          import("@arcgis/core/views/MapView")
        ]);

        if (cancelled || !mapRef.current) {
          return;
        }

        const uiComponents = controls.zoom === false ? [] : ["zoom" as const];

        const map = new ArcGISMap({ basemap });
        const mapLayers = await Promise.all(layers.map((layer) => createLayer(layer)));
        map.addMany(mapLayers);

        const view = new MapView({
          container: mapRef.current,
          map,
          center,
          zoom,
          ui: {
            components: uiComponents
          },
          popupEnabled: controls.popup !== false
        });

        mapInstanceRef.current = map;
        mapViewRef.current = view;

        if (controls.compass !== false) {
          const { default: Compass } = await import("@arcgis/core/widgets/Compass");
          view.ui.add(new Compass({ view }), "top-left");
        }

        viewpointWatcher = view.watch(["center", "zoom"], () => {
          onViewpointChange?.({
            center: [view.center.longitude ?? center[0], view.center.latitude ?? center[1]],
            zoom: view.zoom ?? zoom
          });
        });

        await view.when();
        onReady?.(view);
      };

      loadMap();

      return () => {
        cancelled = true;
        viewpointWatcher?.remove();
        mapViewRef.current?.destroy();
        mapViewRef.current = null;
        mapInstanceRef.current = null;
      };
    }, [basemap, center, controls.attribution, controls.compass, controls.popup, controls.zoom, layers, onReady, onViewpointChange, zoom]);

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
