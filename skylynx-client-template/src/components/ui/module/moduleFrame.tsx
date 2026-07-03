// ================================================
// ✅ Component: ModuleFrame
// Description: Generic UI wrapper with typed settings + collapsible UI
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: components/ui/ModuleFrame.tsx
// ================================================

import React, { useState } from "react";
import { IconButton, Typography } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SettingsIcon from "@mui/icons-material/Settings";

import ModuleSettingsDialog from "./ModuleSettingsDialog";
import {
  ModuleContainer,
  ModuleHeader,
  ModuleInnerContent,
} from "../styled/moduleWrapper";

import { ModuleFrameProps, SkylynxModuleSettings } from "../types/uiWrappers";

const ModuleFrame = <TSettings extends SkylynxModuleSettings>({
  settings,
  children,
  onSettingsUpdate,
}: ModuleFrameProps<TSettings>): JSX.Element => {
  const [expanded, setExpanded] = useState(true);
  const [openSettings, setOpenSettings] = useState(false);

  const { title, showTitle = true } = settings;

  return (
    <ModuleContainer>
      {showTitle && (
        <ModuleHeader>
          <Typography variant="h6">{title}</Typography>
          <div>
            <IconButton
              color="inherit"
              onClick={() => setExpanded(!expanded)}
              size="small"
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
            <IconButton
              color="inherit"
              onClick={() => setOpenSettings(true)}
              size="small"
            >
              <SettingsIcon />
            </IconButton>
            <ModuleSettingsDialog
              open={openSettings}
              settings={settings}
              onClose={() => setOpenSettings(false)}
              onSave={(updatedSettings) => {
                onSettingsUpdate?.(updatedSettings);
                setOpenSettings(false);
              }}
            />
          </div>
        </ModuleHeader>
      )}
      {expanded && <ModuleInnerContent>{children}</ModuleInnerContent>}
    </ModuleContainer>
  );
};

export default ModuleFrame;
