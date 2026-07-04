// ================================================
// Component: ESRIMapModuleView
// Description: Presentation-ready Esri map module view with configurable map window settings.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: modules/esriMapModule/esriMapModuleView.tsx
// Type: React TypeScript component file
// ================================================

import { Box, Paper, Stack, Typography } from "@mui/material";
import EsriMapViewer from "@/components/esri/esriMapViewer";
import { EsriMapViewpoint } from "@/components/esri/types";
import { ESRIMapModuleSettings, ESRIMapModuleProps } from "@/modules/esriMapModule/types";

interface ESRIMapModuleViewProps extends Pick<ESRIMapModuleProps, "children"> {
  settings: ESRIMapModuleSettings;
  onViewpointChange?: (viewpoint: EsriMapViewpoint) => void;
}

export default function ESRIMapModuleView({ settings, children, onViewpointChange }: ESRIMapModuleViewProps) {
  return (
    <Paper sx={{ p: 2, height: "100%" }} variant="outlined">
      <Stack spacing={2}>
        {settings.showTitle && (
          <Box>
            <Typography variant="h2">{settings.title}</Typography>
            <Typography color="text.secondary" variant="body2">
              Center {settings.center[1].toFixed(3)}, {settings.center[0].toFixed(3)} · Zoom {settings.zoom}
            </Typography>
          </Box>
        )}
        <EsriMapViewer
          basemap={settings.basemap}
          center={settings.center}
          controls={settings.controls}
          height={settings.height}
          id={settings.id}
          layers={settings.layers}
          onViewpointChange={onViewpointChange}
          title={settings.showTitle ? undefined : settings.title}
          zoom={settings.zoom}
        />
        {children}
      </Stack>
    </Paper>
  );
}
