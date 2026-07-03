// ================================================
// ✅ Types: MapMapModuleProps + Settings
// Description: Interface definitions for Mergin Map module
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: /modules/mapMapModule/types.ts
// ================================================

import { SkylynxModuleSettings } from "../../../components/ui/types/uiWrappers";
import { IframeViewerProps } from "../../../components/mergin/types";
export interface MapMapModuleSettings extends SkylynxModuleSettings, IframeViewerProps {
  showToolbar?: boolean;
  enableDrawingTools?: boolean;
  defaultZoom?: number;
  baseLayerType?: "osm" | "satellite" | "none";
}

export interface MapMapModuleProps {
  settings: MapMapModuleSettings;
  onSettingsUpdate: (settings: MapMapModuleSettings) => void;
  children?: React.ReactNode;
}
