// ================================================
// File: Demo Surface Registry
// Description: Maps NorthStar presentation routes to polished demo surfaces for live walkthroughs.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: DemoSurfaceRegistry.tsx
// Type: React TypeScript component registry file
// ================================================

import { Alert, Box, Button, Chip, Divider, Grid, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { DemoRoute } from "../../data/demoRoutes";
import { EsriMapModuleView } from "../../modules/esriMapModule/esriMapModuleView";
import { ResolvedStoryMap, resolveStoryMap } from "../../services/demoDataService";

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
  const demoPath = ["Business problem", "Utility challenges", "Dashboard", "Map", "Work orders", "AI recommendation", "Explainability", "ROI"];
  const cards = [
    { title: "Plan Work", text: "Prioritize gas and electric work orders with service territory, emergency, and capacity context." },
    { title: "Recommend Crews", text: "Compare qualified crews using skill fit, equipment, travel, productivity, and adjusted labor cost." },
    { title: "Explain Savings", text: "Show why the selected crew is defensible and where overtime, travel, and exception costs are avoided." }
  ];

  return (
    <Stack spacing={2.5}>
      <Paper variant="outlined" sx={{ p: 3.5, background: "linear-gradient(135deg, #14532d, #0f766e)", color: "white" }}>
        <Typography variant="h2">AI-enabled labor intelligence for field operations</Typography>
        <Typography sx={{ mt: 1.5, maxWidth: 760, fontSize: "1.02rem" }}>
          NorthStar Utilities combines work orders, crew qualifications, labor rates, service territories, travel, and performance history to make dispatch decisions faster and more defensible.
        </Typography>
        <Chip label="Demo thesis: best qualified crew at the lowest effective cost" sx={{ mt: 2, bgcolor: "rgba(255,255,255,0.16)", color: "white", fontWeight: 800 }} />
      </Paper>

      <Grid container spacing={2}>
        {cards.map((card) => (
          <Grid item xs={12} md={4} key={card.title}>
            <Paper variant="outlined" sx={{ p: 2.5, height: "100%" }}>
              <Typography fontWeight={900}>{card.title}</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>{card.text}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper variant="outlined" sx={{ p: 2.5 }}>
        <Typography fontWeight={900} sx={{ mb: 1.5 }}>Guided presentation path</Typography>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {demoPath.map((step) => <Chip key={step} label={step} variant="outlined" />)}
        </Stack>
      </Paper>
    </Stack>
  );
}

function BusinessProblemSurface() {
  const currentState = ["Availability and habit drive assignments", "Labor, asset, and certification data live in separate places", "Hourly rate is visible, but effective cost is not"];
  const northStarState = ["Rank only crews qualified for the work", "Include geography, equipment, overtime, and productivity", "Explain the recommendation for planner review"];
  const rankedCrews = [
    { name: "Crew B", hourly: "$148/hr", effective: "$1,860", note: "Closest qualified gas crew; no overtime risk" },
    { name: "Crew C", hourly: "$132/hr", effective: "$2,140", note: "Lower rate, longer travel, likely overtime" },
    { name: "Crew A", hourly: "$156/hr", effective: "$2,320", note: "Qualified, but missing optimal equipment" }
  ];

  return (
    <Stack spacing={2.5}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2.5, height: "100%", borderColor: "warning.main" }}>
            <Typography variant="h2">Today: manual dispatch tradeoffs</Typography>
            <Stack component="ul" spacing={1} sx={{ pl: 2.5, mb: 0 }}>
              {currentState.map((item) => <Typography component="li" color="text.secondary" key={item}>{item}</Typography>)}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2.5, height: "100%", borderColor: "primary.main" }}>
            <Typography variant="h2">NorthStar: optimized qualified assignment</Typography>
            <Stack component="ul" spacing={1} sx={{ pl: 2.5, mb: 0 }}>
              {northStarState.map((item) => <Typography component="li" color="text.secondary" key={item}>{item}</Typography>)}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Paper variant="outlined" sx={{ p: 2.5 }}>
        <Typography fontWeight={900}>Decision question</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Which qualified crew should get this job when labor cost, travel time, skill fit, service territory, equipment, and overtime risk are all considered?
        </Typography>
      </Paper>

      <Stack spacing={1.25}>
        {rankedCrews.map((crew, index) => (
          <Paper key={crew.name} variant="outlined" sx={{ p: 2, borderColor: index === 0 ? "success.main" : "divider" }}>
            <Stack direction="row" justifyContent="space-between" gap={2} flexWrap="wrap">
              <Box>
                <Typography fontWeight={900}>{index + 1}. {crew.name}</Typography>
                <Typography color="text.secondary">{crew.note}</Typography>
              </Box>
              <Chip label={`${crew.hourly} rate · ${crew.effective} effective cost`} color={index === 0 ? "success" : "default"} />
            </Stack>
          </Paper>
        ))}
      </Stack>
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
  const [activeStoryId, setActiveStoryId] = useState("power-branch-outage");
  const [resolvedMap, setResolvedMap] = useState<ResolvedStoryMap | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    async function loadStoryMap() {
      try {
        setStatus("loading");
        setErrorMessage(null);
        const nextResolvedMap = await resolveStoryMap(activeStoryId);

        if (cancelled) {
          nextResolvedMap.cleanup();
        } else {
          cleanup = nextResolvedMap.cleanup;
          setResolvedMap(nextResolvedMap);
          setStatus("ready");
        }
      } catch (error) {
        if (!cancelled) {
          setStatus("error");
          setErrorMessage(error instanceof Error ? error.message : "Unable to load NorthStar map mock data.");
        }
      }
    }

    loadStoryMap();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [activeStoryId]);

  const mapSettings = resolvedMap
    ? {
      id: `northstar-${resolvedMap.story.storyId}-map`,
      title: `${resolvedMap.story.title} Map`,
      center: [resolvedMap.workOrder.longitude, resolvedMap.workOrder.latitude] as [number, number],
      zoom: resolvedMap.story.storyId.includes("power") ? 14 : 13,
      layers: resolvedMap.layers,
      markers: resolvedMap.markers
    }
    : undefined;

  return (
    <Stack spacing={2}>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
          <Typography fontWeight={900}>Active story</Typography>
          <Button
            size="small"
            variant={activeStoryId === "power-branch-outage" ? "contained" : "outlined"}
            onClick={() => setActiveStoryId("power-branch-outage")}
          >
            Power branch outage
          </Button>
          <Button
            size="small"
            variant={activeStoryId === "gas-leak-emergency" ? "contained" : "outlined"}
            onClick={() => setActiveStoryId("gas-leak-emergency")}
          >
            Gas leak emergency
          </Button>
          {resolvedMap && (
            <Chip
              color={resolvedMap.workOrder.priority === "Emergency" ? "error" : "primary"}
              label={`${resolvedMap.workOrder.workOrderNumber} · ${resolvedMap.workOrder.status}`}
            />
          )}
        </Stack>
      </Paper>
      {status === "error" && <Alert severity="error">{errorMessage}</Alert>}
      {status === "loading" && <LinearProgress />}
      <EsriMapModuleView settings={mapSettings}>
        {resolvedMap ? (
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="body2">
              Loaded {resolvedMap.layers.length} GeoJSON map layer(s) from the active work order. Customer layer count:{" "}
              {resolvedMap.customerCount ?? "not applicable"}.
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {resolvedMap.story.summary}
            </Typography>
          </Stack>
        ) : (
          <Typography color="text.secondary" variant="body2">
            Loading the NorthStar manifest, active work order, and related GeoJSON layers.
          </Typography>
        )}
      </EsriMapModuleView>
    </Stack>
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
  businessProblem: BusinessProblemSurface,
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
