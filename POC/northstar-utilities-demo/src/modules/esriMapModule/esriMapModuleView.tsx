// ================================================
// File: Field Map Module View
// Description: Provides a presentation-ready local map window for NorthStar field operations pages.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: esriMapModuleView.tsx
// Type: React TypeScript component file
// ================================================

import { Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import { EsriMapViewer } from "../../components/esri/EsriMapViewer";
import { EsriMapModuleProps, EsriMapModuleSettings } from "./types";

const defaultSettings: EsriMapModuleSettings = {
  id: "northstar-field-operations-map",
  title: "NorthStar Field Operations Map",
  center: [-122.6784, 45.5152],
  zoom: 12,
  basemap: "streets-vector",
  height: 460,
  controls: {
    attribution: true,
    compass: true,
    zoom: true
  },
  layers: [],
  markers: [
    { id: "crew-b", label: "Crew B", longitude: -122.6712, latitude: 45.5231, color: "#14532d" },
    { id: "gas-leak", label: "Gas Leak", longitude: -122.6615, latitude: 45.5138, color: "#dc2626", size: 14 },
    { id: "outage", label: "Transformer Outage", longitude: -122.7041, latitude: 45.531, color: "#f59e0b" }
  ]
};

export function EsriMapModuleView({ settings, children }: EsriMapModuleProps) {
  const mapSettings = { ...defaultSettings, ...settings };

  return (
    <Grid container spacing={2} alignItems="stretch">
      <Grid item xs={12} lg={8}>
        <EsriMapViewer {...mapSettings} />
      </Grid>
      <Grid item xs={12} lg={4}>
        <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
          <Stack spacing={2}>
            <div>
              <Typography variant="h2">Map Controls</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                This module is the reusable local field map for crews, work orders, territories, and routing overlays.
              </Typography>
            </div>
            <Stack direction="row" gap={1} flexWrap="wrap">
              <Chip label={mapSettings.basemap} color="primary" />
              <Chip label={`${mapSettings.markers.length} demo markers`} />
              <Chip label={`${mapSettings.layers.length} service layers`} />
            </Stack>
            <Stack spacing={1}>
              {mapSettings.markers.map((marker) => (
                <Stack key={marker.id} direction="row" spacing={1} alignItems="center">
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: marker.color,
                      display: "inline-block",
                      flex: "0 0 auto"
                    }}
                  />
                  <Typography variant="body2">{marker.label}</Typography>
                </Stack>
              ))}
            </Stack>
            {children}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}
