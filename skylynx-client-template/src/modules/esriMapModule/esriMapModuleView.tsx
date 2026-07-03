// ================================================
// ✅ Component: ESRIMapModule
// Description: Esri JS API-based map viewer module wrapper
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: /modules/ESRIMapModule/esriMapModule.tsx
// ================================================

import React from "react";
import ModuleFrame from "../../components/ui/module/moduleFrame";
import { ESRIMapModuleProps } from "./types";
import { MapWrapper } from "./styled";
import EsriMapViewer from "../../components/esri/esriMapViewer";

const ESRIMapModule: React.FC<ESRIMapModuleProps> = ({
  settings,
  onSettingsUpdate,
  children,
}) => {
  return (
    <ModuleFrame settings={settings} onSettingsUpdate={onSettingsUpdate}>
      <MapWrapper>
        <EsriMapViewer
          center={settings.center}
          zoom={settings.zoom}
          basemap={settings.basemap}
          height={settings.height}
        />
      </MapWrapper>
      {children}
    </ModuleFrame>
  );
};

export default ESRIMapModule;
