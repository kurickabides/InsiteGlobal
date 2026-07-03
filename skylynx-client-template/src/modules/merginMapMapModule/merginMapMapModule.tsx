// ================================================
// ✅ Component: MapMapModule
// Description: Mergin Maps viewer integration module
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: /modules/mapMapModule/mapMapModule.tsx
// ================================================

import React from "react";
import ModuleFrame from "../../components/ui/module/moduleFrame";
import { MapMapModuleProps } from "./types";
import { MapWrapper } from "./styled";
import IframeViewer from "../../components/mergin/iframeViewer";

const MapMapModule: React.FC<MapMapModuleProps> = ({
  settings,
  onSettingsUpdate,
  children,
}) => {
  return (
    <ModuleFrame settings={settings} onSettingsUpdate={onSettingsUpdate}>
      <MapWrapper>
        <IframeViewer
          url={settings.url || ""}
          height={settings.height }
          title={settings.title || "No Title Provided"}
        />
      </MapWrapper>
      {children}
    </ModuleFrame>
  );
};

export default MapMapModule;
