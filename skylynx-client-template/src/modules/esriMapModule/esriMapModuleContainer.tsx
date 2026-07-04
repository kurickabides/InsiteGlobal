// ================================================
// Component: ESRIMapModuleContainer
// Description: Redux-connected container for the reusable Esri map module.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: modules/esriMapModule/esriMapModuleContainer.tsx
// Type: React TypeScript component file
// ================================================

import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/appStore/hooks";
import { selectEsriMapSettings, setEsriViewpoint, updateEsriSettings } from "@/modules/esriMapModule/esriMapSlice";
import ESRIMapModuleView from "@/modules/esriMapModule/esriMapModuleView";
import { ESRIMapModuleProps } from "@/modules/esriMapModule/types";

export default function ESRIMapModuleContainer({ settings, onSettingsUpdate, children }: ESRIMapModuleProps) {
  const dispatch = useAppDispatch();
  const savedSettings = useAppSelector(selectEsriMapSettings);
  const mergedSettings = useMemo(() => ({ ...savedSettings, ...settings }), [savedSettings, settings]);

  useEffect(() => {
    if (settings) {
      dispatch(updateEsriSettings(settings));
    }
  }, [dispatch, settings]);

  useEffect(() => {
    onSettingsUpdate?.(mergedSettings);
  }, [mergedSettings, onSettingsUpdate]);

  return (
    <ESRIMapModuleView
      onViewpointChange={(viewpoint) => dispatch(setEsriViewpoint(viewpoint))}
      settings={mergedSettings}
    >
      {children}
    </ESRIMapModuleView>
  );
}
