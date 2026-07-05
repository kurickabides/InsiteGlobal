// ================================================
// File: Demo Surface Registry
// Description: Maps NorthStar presentation routes to polished demo surfaces for live walkthroughs.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: DemoSurfaceRegistry.tsx
// Type: React TypeScript component registry file
// ================================================

import { Box, Chip, Divider, Grid, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { DemoRoute } from "../../data/demoRoutes";
import { EsriMapModuleView } from "../../modules/esriMapModule/esriMapModuleView";

interface DemoSurfaceProps {
  route: DemoRoute;
}

const workOrders = [
  { id: "WO-1842", type: "Gas leak", priority: "Emergency", district: "Central", eta: "18 min" },
  { id: "WO-1907", type: "Transformer outage", priority: "Critical", district: "North", eta: "31 min" },
  { id: "WO-2011", type: "Meter inspection", priority: "Routine", district: "West", eta: "2 hrs" }
];

const crews = [
  { name: "Crew B", fit: 96, cost: "-18%", reason: "Gas cert + closest qualified crew" },
  { name: "Crew D", fit: 88, cost: "-9%", reason: "Strong productivity, longer travel" },
  { name: "Crew A", fit: 74, cost: "+6%", reason: "Available but missing specialty equipment" }
];

function DefaultSurface({ route }: DemoSurfaceProps) {
  return (
    <Paper variant="outlined" sx={{ p: 3, height: "100%" }}>
      <Typography variant="h2" sx={{ mb: 1 }}>{route.title}</Typography>
      <Typography color="text.secondary">Presentation-ready placeholder for {route.title.toLowerCase()} content.</Typography>
    </Paper>
  );
}

function WelcomeSurface() {
  return (
    <Stack spacing={2}>
      <Paper variant="outlined" sx={{ p: 3, background: "linear-gradient(135deg, #14532d, #0f766e)", color: "white" }}>
        <Typography variant="h2">AI-assisted dispatch story</Typography>
        <Typography sx={{ mt: 1, maxWidth: 680 }}>
          NorthStar demonstrates how utility operators can combine work priority, certifications, crew capacity, geography, and cost into a defensible labor decision.
        </Typography>
      </Paper>
      <Grid container spacing={2}>
        {["Dispatch", "Field Ops", "Executive ROI"].map((item) => (
          <Grid item xs={12} md={4} key={item}>
            <Paper variant="outlined" sx={{ p: 2 }}><Typography fontWeight={800}>{item}</Typography></Paper>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

function OverviewSurface() {
  return (
    <Grid container spacing={2}>
      {["North District", "Central District", "West District"].map((district, index) => (
        <Grid item xs={12} md={4} key={district}>
          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Typography variant="h2">{district}</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>{18 + index * 7} active jobs · {8 + index * 3} available crews</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

function DashboardSurface() {
  return (
    <Grid container spacing={2}>
      {[{ label: "Emergency Jobs", value: 14 }, { label: "Crew Utilization", value: 82 }, { label: "SLA Risk", value: 23 }].map((metric) => (
        <Grid item xs={12} md={4} key={metric.label}>
          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Typography color="text.secondary">{metric.label}</Typography>
            <Typography variant="h2" sx={{ mt: 1 }}>{metric.value}{metric.label === "Crew Utilization" ? "%" : ""}</Typography>
            <LinearProgress variant="determinate" value={Math.min(metric.value, 100)} sx={{ mt: 2 }} />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

function FieldMapSurface() {
  return (
    <EsriMapModuleView>
      <Typography color="text.secondary" variant="body2">
        Next layer targets: service territories, live work order points, crew GPS, and route simulation.
      </Typography>
    </EsriMapModuleView>
  );
}

function WorkOrdersSurface() {
  return (
    <Stack spacing={1.5}>
      {workOrders.map((order) => (
        <Paper key={order.id} variant="outlined" sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" gap={2} flexWrap="wrap">
            <Box><Typography fontWeight={800}>{order.id} · {order.type}</Typography><Typography color="text.secondary">{order.district} district</Typography></Box>
            <Chip label={`${order.priority} · ${order.eta}`} color={order.priority === "Emergency" ? "error" : "primary"} />
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}

function CrewRecommendationSurface() {
  return (
    <Stack spacing={1.5}>
      {crews.map((crew, index) => (
        <Paper key={crew.name} variant="outlined" sx={{ p: 2, borderColor: index === 0 ? "primary.main" : "divider" }}>
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between"><Typography fontWeight={900}>{index + 1}. {crew.name}</Typography><Typography>{crew.fit}% fit · {crew.cost}</Typography></Stack>
            <LinearProgress variant="determinate" value={crew.fit} />
            <Typography color="text.secondary">{crew.reason}</Typography>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}

function ArchitectureSurface() {
  return (
    <Stack spacing={1.5} divider={<Divider flexItem />}>
      {["React + MUI presentation shell", "Workforce recommendation service", "SQL/PostGIS workforce model", "Esri map and route services"].map((item) => (
        <Typography key={item} fontWeight={800}>{item}</Typography>
      ))}
    </Stack>
  );
}

function RoiSurface() {
  return (
    <Grid container spacing={2}>
      {["$1.8M annualized savings", "22% faster response", "14% less windshield time"].map((value) => (
        <Grid item xs={12} md={4} key={value}>
          <Paper variant="outlined" sx={{ p: 2.5, textAlign: "center" }}><Typography variant="h2">{value}</Typography></Paper>
        </Grid>
      ))}
    </Grid>
  );
}

const registry = {
  default: DefaultSurface,
  welcome: WelcomeSurface,
  overview: OverviewSurface,
  dashboard: DashboardSurface,
  fieldMap: FieldMapSurface,
  workOrders: WorkOrdersSurface,
  crewRecommendation: CrewRecommendationSurface,
  architecture: ArchitectureSurface,
  roi: RoiSurface
};

export function getDemoSurface(componentKey?: DemoRoute["componentKey"]) {
  if (componentKey && componentKey in registry) {
    return registry[componentKey];
  }

  return registry.default;
}
