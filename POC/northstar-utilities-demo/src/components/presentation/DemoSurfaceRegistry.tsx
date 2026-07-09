// ================================================
// File: Demo Surface Registry
// Description: Maps NorthStar presentation routes to polished demo surfaces for live walkthroughs.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: DemoSurfaceRegistry.tsx
// Type: React TypeScript component registry file
// ================================================

import { Alert, Button, Chip, Divider, Grid, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import { DemoRoute } from "../../data/demoRoutes";
import { EsriMapModuleView } from "../../modules/esriMapModule/esriMapModuleView";
import { ResolvedStoryMap, resolveStoryMap } from "../../services/demoDataService";

interface DemoSurfaceProps {
  route: DemoRoute;
}

const workOrders = [
  {
    id: "WO-1842",
    type: "Gas leak",
    priority: "Emergency",
    district: "Central",
    eta: "18 min",
    customerImpact: "1,240 customers near downtown hospital corridor",
    required: ["Gas leak response", "Atmospheric testing", "Vacuum excavation truck"],
    status: "Needs assignment"
  },
  {
    id: "WO-1907",
    type: "Transformer outage",
    priority: "Critical",
    district: "North",
    eta: "31 min",
    customerImpact: "412 customers, feeder lockout investigation",
    required: ["Medium-voltage switching", "Bucket truck", "Outage restoration"],
    status: "Queued"
  },
  {
    id: "WO-2011",
    type: "Meter inspection",
    priority: "Routine",
    district: "West",
    eta: "2 hrs",
    customerImpact: "Single commercial account follow-up",
    required: ["Meter inspection", "Customer appointment", "Photo documentation"],
    status: "Scheduled"
  }
];

const crews = [
  {
    name: "Crew B",
    fit: 96,
    hourly: "$148/hr",
    effectiveCost: "$1,860",
    cost: "-18%",
    travel: "18 min",
    reason: "Gas cert + closest qualified crew",
    strengths: ["Gas emergency certified", "Vacuum excavation truck assigned", "No overtime exposure"]
  },
  {
    name: "Crew D",
    fit: 88,
    hourly: "$142/hr",
    effectiveCost: "$2,070",
    cost: "-9%",
    travel: "34 min",
    reason: "Strong productivity, longer travel",
    strengths: ["Qualified gas crew", "High first-time fix rate", "Cross-district travel penalty"]
  },
  {
    name: "Crew A",
    fit: 74,
    hourly: "$132/hr",
    effectiveCost: "$2,320",
    cost: "+6%",
    travel: "41 min",
    reason: "Lowest rate, but missing specialty equipment",
    strengths: ["Available now", "Lowest hourly rate", "Requires equipment transfer"]
  }
];

function DefaultSurface({ route }: DemoSurfaceProps): ReactElement {
  return (
    <Paper variant="outlined" sx={{ p: 3, height: "100%" }}>
      <Typography variant="h2" sx={{ mb: 1 }}>{route.title}</Typography>
      <Typography color="text.secondary">Presentation-ready placeholder for {route.title.toLowerCase()} content.</Typography>
    </Paper>
  );
}

function WelcomeSurface(): ReactElement {
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

function BusinessProblemSurface(): ReactElement {
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
              <div>
                <Typography fontWeight={900}>{index + 1}. {crew.name}</Typography>
                <Typography color="text.secondary">{crew.note}</Typography>
              </div>
              <Chip label={`${crew.hourly} rate · ${crew.effective} effective cost`} color={index === 0 ? "success" : "default"} />
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}

function UtilityChallengesSurface(): ReactElement {
  const challengeCards = [
    {
      title: "Dual-domain emergencies",
      impact: "Gas leaks and electric outages compete for the same supervisors, trucks, and field capacity.",
      response: "Classify priority, required certifications, equipment, and crew proximity before cost is considered."
    },
    {
      title: "Qualification risk",
      impact: "A crew can be available and nearby but still fail the work due to missing gas, switching, or confined-space credentials.",
      response: "Gate recommendations with skill, certification, and equipment checks so planners only compare valid options."
    },
    {
      title: "Territory complexity",
      impact: "District boundaries, mutual aid, traffic, and restoration commitments change the real cost of assignment.",
      response: "Blend service area fit, route time, SLA exposure, overtime risk, and productivity into one defensible ranking."
    }
  ];

  const constraints = [
    { label: "Safety priority", value: "Emergency work escalates first" },
    { label: "Crew eligibility", value: "Skills, certs, and equipment must match" },
    { label: "Operational cost", value: "Travel, overtime, and productivity adjust rate" },
    { label: "Customer impact", value: "SLA risk and outage footprint guide tradeoffs" }
  ];

  return (
    <Stack spacing={2.5}>
      <Paper variant="outlined" sx={{ p: 3, background: "linear-gradient(135deg, rgba(30, 64, 175, 0.12), rgba(20, 83, 45, 0.12))" }}>
        <Typography variant="h2">Why utility labor decisions are hard</Typography>
        <Typography color="text.secondary" sx={{ mt: 1.25, maxWidth: 760 }}>
          NorthStar planners are not simply picking the closest or lowest-rate crew. They are resolving a live operations puzzle where public safety, reliability, crew eligibility, customer commitments, and effective labor cost all interact.
        </Typography>
      </Paper>

      <Grid container spacing={2}>
        {challengeCards.map((card) => (
          <Grid item xs={12} md={4} key={card.title}>
            <Paper variant="outlined" sx={{ p: 2.5, height: "100%" }}>
              <Typography fontWeight={900}>{card.title}</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>{card.impact}</Typography>
              <Divider sx={{ my: 1.5 }} />
              <Typography color="primary" fontWeight={800}>{card.response}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper variant="outlined" sx={{ p: 2.5 }}>
        <Typography fontWeight={900} sx={{ mb: 1.5 }}>Decision constraints the demo makes visible</Typography>
        <Grid container spacing={1.5}>
          {constraints.map((constraint) => (
            <Grid item xs={12} sm={6} key={constraint.label}>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <Chip label={constraint.label} color="primary" size="small" />
                <Typography color="text.secondary">{constraint.value}</Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Stack>
  );
}

function OverviewSurface(): ReactElement {
  const learningGoals = [
    {
      title: "Understand the decision",
      text: "See how dispatchers weigh emergency priority, service geography, labor cost, crew eligibility, and customer commitments at the same time."
    },
    {
      title: "Trust the recommendation",
      text: "Learn why NorthStar gates out unqualified crews first, then ranks valid options by effective cost, SLA exposure, travel, and productivity."
    },
    {
      title: "Connect operations to ROI",
      text: "Follow one emergency assignment from queue to explanation to value so executives can see how better dispatch decisions scale."
    }
  ];
  const utilityProfile = [
    { label: "Combined utility", value: "Gas + electric service territory" },
    { label: "Crew network", value: "34 available crews across 3 districts" },
    { label: "Operating pressure", value: "128 active jobs with 31% emergency mix" },
    { label: "Demo outcome", value: "Defensible, cost-aware crew assignment" }
  ];

  return (
    <Stack spacing={2.5}>
      <Paper variant="outlined" sx={{ p: 3, background: "linear-gradient(135deg, rgba(30, 64, 175, 0.10), rgba(20, 83, 45, 0.12))" }}>
        <Typography variant="h2">By the end of this demo</Typography>
        <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 820 }}>
          The audience should understand how NorthStar turns a complex utility dispatch choice into a transparent, repeatable recommendation that planners can explain and leaders can measure.
        </Typography>
      </Paper>

      <Grid container spacing={2}>
        {learningGoals.map((goal) => (
          <Grid item xs={12} md={4} key={goal.title}>
            <Paper variant="outlined" sx={{ p: 2.5, height: "100%" }}>
              <Typography fontWeight={900}>{goal.title}</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>{goal.text}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper variant="outlined" sx={{ p: 2.5 }}>
        <Typography fontWeight={900} sx={{ mb: 1.5 }}>NorthStar operating profile</Typography>
        <Grid container spacing={1.5}>
          {utilityProfile.map((item) => (
            <Grid item xs={12} sm={6} key={item.label}>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <Chip label={item.label} color="primary" size="small" />
                <Typography color="text.secondary">{item.value}</Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Stack>
  );
}

function DashboardSurface(): ReactElement {
  const operatingMetrics = [
    { label: "Emergency Jobs", value: "14", progress: 68, note: "Gas and electric events needing same-shift response" },
    { label: "Crew Utilization", value: "82%", progress: 82, note: "Available capacity is tightening in Central district" },
    { label: "SLA Risk", value: "23", progress: 57, note: "Jobs at risk if assignments are delayed another 30 minutes" }
  ];

  return (
    <Stack spacing={2.5}>
      <Paper variant="outlined" sx={{ p: 3, background: "linear-gradient(135deg, rgba(2, 132, 199, 0.12), rgba(20, 83, 45, 0.12))" }}>
        <Typography variant="h2">Operational snapshot before dispatch</Typography>
        <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 760 }}>
          The planner starts with a mixed gas and electric queue, constrained field capacity, and a visible savings opportunity if the next emergency is assigned to the right qualified crew.
        </Typography>
      </Paper>
      <Grid container spacing={2}>
        {operatingMetrics.map((metric) => (
          <Grid item xs={12} md={4} key={metric.label}>
            <Paper variant="outlined" sx={{ p: 2.5, height: "100%" }}>
              <Typography color="text.secondary">{metric.label}</Typography>
              <Typography variant="h2" sx={{ mt: 1 }}>{metric.value}</Typography>
              <LinearProgress variant="determinate" value={metric.progress} sx={{ my: 2 }} />
              <Typography color="text.secondary" variant="body2">{metric.note}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Paper variant="outlined" sx={{ p: 2.5, borderColor: "warning.main" }}>
        <Stack direction="row" justifyContent="space-between" gap={2} flexWrap="wrap">
          <div>
            <Typography fontWeight={900}>Decision to make now</Typography>
            <Typography color="text.secondary">Assign WO-1842 before the emergency SLA window pushes the response into overtime.</Typography>
          </div>
          <Chip color="warning" label="48 min SLA remaining" />
        </Stack>
      </Paper>
    </Stack>
  );
}

function FieldMapSurface(): ReactElement {
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

function WorkOrdersSurface(): ReactElement {
  const [activeStory, setActiveStory] = useState("gas");
  const gasOrder = workOrders[0];
  const powerOrder = workOrders[1];
  const combinedOrders = [
    {
      ...gasOrder,
      domain: "Gas",
      crewType: "Gas emergency crew",
      productivityFactor: "1.18",
      historicalBaseline: "4.2 hr avg leak response",
      decisionUse: "Raises Crew B because similar leak responses close faster with its current equipment package."
    },
    {
      ...powerOrder,
      domain: "Power",
      crewType: "Electric trouble crew",
      productivityFactor: "1.07",
      historicalBaseline: "5.1 hr avg transformer outage",
      decisionUse: "Prioritizes switching credentials, feeder familiarity, bucket truck availability, and outage footprint."
    },
    {
      id: "WO-2144",
      type: "Pole damage patrol",
      priority: "High",
      district: "South",
      eta: "46 min",
      customerImpact: "Feeder inspection after vehicle strike near industrial park",
      required: ["Line patrol", "Damage assessment", "Traffic control"],
      status: "Ready to bundle",
      domain: "Power",
      crewType: "Line inspection crew",
      productivityFactor: "0.94",
      historicalBaseline: "2.8 hr avg patrol closure",
      decisionUse: "Can be bundled after WO-1907 if crew route and shift window stay inside SLA."
    },
    {
      id: "WO-2198",
      type: "Regulator station inspection",
      priority: "Routine",
      district: "Central",
      eta: "3 hrs",
      customerImpact: "Preventive compliance inspection near commercial corridor",
      required: ["Gas station inspection", "Pressure regulation", "Compliance photos"],
      status: "Schedule after emergency",
      domain: "Gas",
      crewType: "Gas maintenance crew",
      productivityFactor: "1.02",
      historicalBaseline: "1.6 hr avg inspection",
      decisionUse: "Moves behind emergency work but can reuse nearby gas crew capacity once the leak is stabilized."
    }
  ];
  const decisionFields = [
    { label: "Priority", detail: "Emergency and critical work is ranked before routine work so safety and reliability commitments stay visible." },
    { label: "Required skills", detail: "Certifications, switching authority, equipment, and domain credentials gate the eligible crew list before cost is compared." },
    { label: "Productivity factor", detail: "A multiplier from historical performance adjusts expected duration and effective cost for each crew/work type pairing." },
    { label: "Travel and territory", detail: "District fit, route time, and crew proximity shape response time and overtime exposure." },
    { label: "Customer impact", detail: "Outage footprint, hospital corridors, and compliance commitments influence escalation and bundling decisions." }
  ];
  const modelRefreshSteps = [
    "Seed starting productivity values from historical work-order close times, crew assignments, outage duration, and inspection records.",
    "Use AI/ML to compare predicted duration against actual field completion and update productivity factors by crew, job type, territory, and equipment package.",
    "Flag drift when storm season, training, new equipment, or staffing changes make old baselines less reliable.",
    "Send revised values back into the recommendation service so the next dispatch decision reflects current field performance."
  ];

  return (
    <Stack spacing={2.5}>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {[
          { key: "gas", label: "Gas story" },
          { key: "power", label: "Power story" },
          { key: "combined", label: "Combined queue" },
          { key: "calibration", label: "AI/ML data refresh" }
        ].map((tab) => (
          <Button
            key={tab.key}
            onClick={() => setActiveStory(tab.key)}
            size="small"
            variant={activeStory === tab.key ? "contained" : "outlined"}
          >
            {tab.label}
          </Button>
        ))}
      </Stack>

      {activeStory === "gas" && (
        <Stack spacing={2.5}>
          <Paper variant="outlined" sx={{ p: 3, borderColor: "error.main" }}>
            <Stack direction="row" justifyContent="space-between" gap={2} flexWrap="wrap">
              <div>
                <Typography color="error" fontWeight={900} variant="overline">Gas emergency story</Typography>
                <Typography variant="h2">{gasOrder.id} · {gasOrder.type}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>{gasOrder.customerImpact}</Typography>
              </div>
              <Stack alignItems="flex-end" spacing={1}>
                <Chip color="error" label={gasOrder.priority} />
                <Chip label={`${gasOrder.eta} target response`} variant="outlined" />
              </Stack>
            </Stack>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Typography fontWeight={900} sx={{ mb: 1.5 }}>Gas decision gates</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {gasOrder.required.map((requirement) => <Chip key={requirement} label={requirement} color="primary" variant="outlined" />)}
              <Chip label="Productivity factor 1.18" color="success" variant="outlined" />
              <Chip label="Historical baseline: 4.2 hr" variant="outlined" />
            </Stack>
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              The gas story shows why the recommendation starts with safety credentials and equipment readiness before cost ranking.
            </Typography>
          </Paper>
        </Stack>
      )}

      {activeStory === "power" && (
        <Stack spacing={2.5}>
          <Paper variant="outlined" sx={{ p: 3, borderColor: "warning.main" }}>
            <Stack direction="row" justifyContent="space-between" gap={2} flexWrap="wrap">
              <div>
                <Typography color="warning.main" fontWeight={900} variant="overline">Power restoration story</Typography>
                <Typography variant="h2">{powerOrder.id} · {powerOrder.type}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>{powerOrder.customerImpact}</Typography>
              </div>
              <Stack alignItems="flex-end" spacing={1}>
                <Chip color="warning" label={powerOrder.priority} />
                <Chip label={`${powerOrder.eta} target response`} variant="outlined" />
              </Stack>
            </Stack>
          </Paper>
          <Grid container spacing={2}>
            {[
              { title: "Switching authority", text: "Only crews with medium-voltage switching clearance stay in the candidate pool." },
              { title: "Outage footprint", text: "Customer count and feeder impact raise priority compared with routine work." },
              { title: "Productivity factor", text: "Historical transformer restoration performance adjusts expected duration and cost." }
            ].map((card) => (
              <Grid item xs={12} md={4} key={card.title}>
                <Paper variant="outlined" sx={{ p: 2.5, height: "100%" }}>
                  <Typography fontWeight={900}>{card.title}</Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>{card.text}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Stack>
      )}

      {activeStory === "combined" && (
        <Stack spacing={1.5}>
          {combinedOrders.map((order) => (
            <Paper key={order.id} variant="outlined" sx={{ p: 2, borderColor: order.id === gasOrder.id ? "error.main" : "divider" }}>
              <Stack direction="row" justifyContent="space-between" gap={2} flexWrap="wrap">
                <div>
                  <Typography fontWeight={900}>{order.id} · {order.type}</Typography>
                  <Typography color="text.secondary">{order.domain} · {order.district} district · {order.customerImpact}</Typography>
                </div>
                <Stack alignItems="flex-end" spacing={0.75}>
                  <Chip label={`${order.priority} · ${order.status}`} color={order.priority === "Emergency" ? "error" : "primary"} size="small" />
                  <Typography color="text.secondary" variant="body2">Productivity factor {order.productivityFactor}</Typography>
                </Stack>
              </Stack>
              <Divider sx={{ my: 1.5 }} />
              <Grid container spacing={1.5}>
                <Grid item xs={12} md={4}><Typography fontWeight={800}>Crew type</Typography><Typography color="text.secondary">{order.crewType}</Typography></Grid>
                <Grid item xs={12} md={4}><Typography fontWeight={800}>Starting value</Typography><Typography color="text.secondary">{order.historicalBaseline}</Typography></Grid>
                <Grid item xs={12} md={4}><Typography fontWeight={800}>Decision use</Typography><Typography color="text.secondary">{order.decisionUse}</Typography></Grid>
              </Grid>
            </Paper>
          ))}
        </Stack>
      )}

      {activeStory === "calibration" && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Paper variant="outlined" sx={{ p: 2.5, height: "100%" }}>
              <Typography variant="h2">Fields used by the decision model</Typography>
              <Stack spacing={1.5} sx={{ mt: 2 }}>
                {decisionFields.map((field) => (
                  <div key={field.label}>
                    <Typography fontWeight={900}>{field.label}</Typography>
                    <Typography color="text.secondary">{field.detail}</Typography>
                  </div>
                ))}
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={7}>
            <Paper variant="outlined" sx={{ p: 2.5, height: "100%" }}>
              <Typography variant="h2">How AI/ML keeps values current</Typography>
              <Stack component="ol" spacing={1.25} sx={{ pl: 2.5, mb: 0, mt: 2 }}>
                {modelRefreshSteps.map((step) => (
                  <Typography color="text.secondary" component="li" key={step}>{step}</Typography>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Stack>
  );
}

function CrewRecommendationSurface(): ReactElement {
  const selectedCrew = crews[0];

  return (
    <Stack spacing={2.5}>
      <Paper variant="outlined" sx={{ p: 3, borderColor: "success.main", background: "rgba(22, 163, 74, 0.08)" }}>
        <Stack direction="row" justifyContent="space-between" gap={2} flexWrap="wrap">
          <div>
            <Typography color="success.main" fontWeight={900} variant="overline">Recommended assignment</Typography>
            <Typography variant="h2">{selectedCrew.name} for WO-1842</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Best qualified crew at the lowest effective cost after travel, equipment, productivity, and overtime risk are considered.
            </Typography>
          </div>
          <Chip color="success" label={`${selectedCrew.fit}% fit · ${selectedCrew.cost} cost delta`} />
        </Stack>
      </Paper>

      <Stack spacing={1.5}>
        {crews.map((crew, index) => (
          <Paper key={crew.name} variant="outlined" sx={{ p: 2, borderColor: index === 0 ? "success.main" : "divider" }}>
            <Stack spacing={1.25}>
              <Stack direction="row" justifyContent="space-between" gap={2} flexWrap="wrap">
                <div>
                  <Typography fontWeight={900}>{index + 1}. {crew.name}</Typography>
                  <Typography color="text.secondary">{crew.reason}</Typography>
                </div>
                <Typography fontWeight={800}>{crew.hourly} · {crew.effectiveCost} effective · {crew.travel}</Typography>
              </Stack>
              <LinearProgress color={index === 0 ? "success" : "primary"} variant="determinate" value={crew.fit} />
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {crew.strengths.map((strength) => <Chip key={strength} label={strength} size="small" variant="outlined" />)}
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}

function ExplainabilitySurface(): ReactElement {
  const checks = [
    { label: "Gas emergency certification", result: "Pass", detail: "Crew B and Crew D qualify; Crew A requires equipment support." },
    { label: "Equipment readiness", result: "Pass", detail: "Crew B already has the excavation truck and atmospheric testing kit." },
    { label: "Travel and SLA exposure", result: "Best", detail: "18-minute travel keeps the work inside the emergency response window." },
    { label: "Effective cost", result: "Lowest", detail: "Crew B is not the cheapest hourly rate, but avoids transfer time and overtime." }
  ];

  return (
    <Stack spacing={2.5}>
      <Paper variant="outlined" sx={{ p: 3, background: "linear-gradient(135deg, rgba(22, 163, 74, 0.12), rgba(15, 118, 110, 0.12))" }}>
        <Typography variant="h2">Why Crew B wins</Typography>
        <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 780 }}>
          NorthStar separates hard qualification gates from cost optimization so the planner can defend the recommendation without treating the AI as a black box.
        </Typography>
      </Paper>

      <Grid container spacing={2}>
        {checks.map((check) => (
          <Grid item xs={12} md={6} key={check.label}>
            <Paper variant="outlined" sx={{ p: 2.5, height: "100%" }}>
              <Stack direction="row" justifyContent="space-between" gap={1} sx={{ mb: 1 }}>
                <Typography fontWeight={900}>{check.label}</Typography>
                <Chip color={check.result === "Pass" ? "success" : "primary"} label={check.result} size="small" />
              </Stack>
              <Typography color="text.secondary">{check.detail}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper variant="outlined" sx={{ p: 2.5, borderColor: "success.main" }}>
        <Typography fontWeight={900}>Planner explanation</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Recommend Crew B because it is fully qualified for gas emergency response, already carries the required equipment, reaches the site inside the SLA window, and produces the lowest effective cost despite not having the lowest hourly rate.
        </Typography>
      </Paper>
    </Stack>
  );
}

function ArchitectureSurface(): ReactElement {
  const architectureLayers = [
    { layer: "Presentation", detail: "React, MUI, guided route shell, and executive story surfaces" },
    { layer: "Decision services", detail: "Crew eligibility gates, effective-cost ranking, and explanation payloads" },
    { layer: "Spatial services", detail: "Esri field map, service territories, crew locations, and work-order layers" },
    { layer: "Data foundation", detail: "Workforce, work order, certification, equipment, route, and performance history tables" }
  ];

  return (
    <Stack spacing={2.5}>
      <Paper variant="outlined" sx={{ p: 3, background: "rgba(2, 132, 199, 0.08)" }}>
        <Typography variant="h2">How the demo pieces fit together</Typography>
        <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 780 }}>
          The architecture is intentionally modular so the presentation can start with local synthetic data and later connect to real APIs, SQL/PostGIS, and Esri services without changing the executive story.
        </Typography>
      </Paper>
      <Stack spacing={1.5} divider={<Divider flexItem />}>
        {architectureLayers.map((item, index) => (
          <Stack key={item.layer} direction="row" spacing={2} alignItems="flex-start">
            <Chip color={index === 0 ? "primary" : "default"} label={`${index + 1}`} />
            <div>
              <Typography fontWeight={900}>{item.layer}</Typography>
              <Typography color="text.secondary">{item.detail}</Typography>
            </div>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

function RoiSurface(): ReactElement {
  const valueDrivers = [
    { value: "$1.8M", label: "annualized savings", detail: "Scaled from avoided overtime, reduced travel, and fewer exception assignments." },
    { value: "22%", label: "faster response", detail: "Emergency work reaches qualified crews sooner because eligibility is pre-filtered." },
    { value: "14%", label: "less windshield time", detail: "Routing and district fit reduce non-productive travel between jobs." }
  ];
  const roiInputs = [
    { label: "Avoided overtime", value: "210 hrs", formula: "210 hrs × blended premium labor rate" },
    { label: "Travel reduction", value: "14%", formula: "Fewer cross-district trips and equipment transfers" },
    { label: "Exception reduction", value: "17 fewer", formula: "Less rework from missing certs, tools, or territory fit" }
  ];
  const walkthroughAssets = ["Executive talk track", "Architecture diagram", "ROI calculator", "Tested page screenshots"];

  return (
    <Stack spacing={2.5}>
      <Grid container spacing={2}>
        {valueDrivers.map((driver) => (
          <Grid item xs={12} md={4} key={driver.label}>
            <Paper variant="outlined" sx={{ p: 2.5, height: "100%", textAlign: "center" }}>
              <Typography variant="h2">{driver.value}</Typography>
              <Typography fontWeight={900}>{driver.label}</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>{driver.detail}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper variant="outlined" sx={{ p: 2.5 }}>
        <Typography fontWeight={900} sx={{ mb: 1.5 }}>ROI calculation inputs</Typography>
        <Grid container spacing={1.5}>
          {roiInputs.map((input) => (
            <Grid item xs={12} md={4} key={input.label}>
              <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
                <Typography fontWeight={900}>{input.label}</Typography>
                <Typography variant="h2" sx={{ mt: 0.75 }}>{input.value}</Typography>
                <Typography color="text.secondary" variant="body2">{input.formula}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2.5, borderColor: "primary.main" }}>
        <Typography fontWeight={900}>Executive close</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          The demo proves a repeatable dispatch pattern: identify the highest-risk work, compare only qualified crews, explain the recommendation, and convert better assignments into measurable labor savings.
        </Typography>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2.5 }}>
        <Typography fontWeight={900} sx={{ mb: 1.5 }}>Presentation assets included in this pass</Typography>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {walkthroughAssets.map((item) => <Chip key={item} label={item} variant="outlined" />)}
        </Stack>
      </Paper>
    </Stack>
  );
}

const registry = {
  default: DefaultSurface,
  welcome: WelcomeSurface,
  businessProblem: BusinessProblemSurface,
  utilityChallenges: UtilityChallengesSurface,
  overview: OverviewSurface,
  dashboard: DashboardSurface,
  fieldMap: FieldMapSurface,
  workOrders: WorkOrdersSurface,
  crewRecommendation: CrewRecommendationSurface,
  explainability: ExplainabilitySurface,
  architecture: ArchitectureSurface,
  roi: RoiSurface
};

export function getDemoSurface(componentKey?: DemoRoute["componentKey"]) {
  if (componentKey && componentKey in registry) {
    return registry[componentKey];
  }

  return registry.default;
}
