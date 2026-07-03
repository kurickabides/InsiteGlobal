// ================================================
// ✅ Component: ESRIMapModuleContainer
// Description: Redux-connected container for Esri map module
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: /modules/ESRIMapModule/esriMapModuleContainer.tsx
// ================================================

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectEsriMapSettings, updateEsriSettings } from "./esriMapSlice";
import ESRIMapModuleView from "./esriMapModuleView";
import { ESRIMapModuleProps } from "./types";

const ESRIMapModuleContainer: React.FC<ESRIMapModuleProps> = ({
  settings,
  onSettingsUpdate,
}) => {
  const dispatch = useDispatch();
  const savedSettings = useSelector(selectEsriMapSettings);

  // ✅ Merge initial props with stored state
  const mergedSettings = { ...savedSettings, ...settings };

  // ✅ Forward updates into Redux store and callback
  const handleUpdate = (updated: Partial<typeof settings>) => {
    dispatch(updateEsriSettings(updated));
    onSettingsUpdate?.({ ...mergedSettings, ...updated });
  };

  return (
    <ESRIMapModuleView
      settings={mergedSettings}
      onSettingsUpdate={handleUpdate}
    />
  );
};

export default ESRIMapModuleContainer;
