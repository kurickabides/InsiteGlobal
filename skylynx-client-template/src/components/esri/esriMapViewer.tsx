// ================================================
// ✅ Component: EsriMapViewer
// Description: Lightweight wrapper to embed Esri JS API-based map
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: components/esri/EsriMapViewer.tsx
// ================================================
import React, { useEffect, useRef } from "react";
import { EsriMapViewerProps, BasemapType } from "./types";
import { ContainerEsriMapViewer, MapDivEsriMapViewer } from "./styled";


const EsriMapViewer: React.FC<EsriMapViewerProps> = ({
  center,
  zoom,
  basemap = BasemapType.Hybrid,
  height = 600, // ✅ default height fallback
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const loadMap = async () => {
      const [Map, MapView] = await Promise.all([
        import("@arcgis/core/Map"),
        import("@arcgis/core/views/MapView"),
      ]);

      const map = new Map.default({ basemap });

      new MapView.default({
        container: mapRef.current,
        map,
        center,
        zoom,
      });
    };

    loadMap();
  }, [center, zoom, basemap]);

  return (
    <ContainerEsriMapViewer>
      <MapDivEsriMapViewer ref={mapRef} height={height} />
    </ContainerEsriMapViewer>
  );
};

export default EsriMapViewer;
