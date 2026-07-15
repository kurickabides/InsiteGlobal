// ================================================
// File: Operations Console Page
// Description: Hosts the NorthStar interactive proof-of-concept console hub experience.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: OperationsConsolePage.tsx
// Type: React TypeScript page component file
// ================================================

import { Button, Chip, Divider, Grid, IconButton, Menu, MenuItem, Paper, Stack, Typography } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EngineeringIcon from "@mui/icons-material/Engineering";
import MenuIcon from "@mui/icons-material/Menu";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ReplayIcon from "@mui/icons-material/Replay";
import SummarizeIcon from "@mui/icons-material/Summarize";
import WorkIcon from "@mui/icons-material/Work";
import { MouseEvent, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

type HubKey = "dashboard" | "workOrders" | "dispatch" | "reports";
type TaskKey = "emergency" | "crews" | "assignment" | "impact";

const consoleHubItems: { key: HubKey; label: string; icon: JSX.Element; metric: string }[] = [
  { key: "dashboard", label: "Executive Dashboard", icon: <DashboardIcon />, metric: "14 emergency jobs" },
  { key: "workOrders", label: "Work Orders", icon: <WorkIcon />, metric: "WO-1842 active" },
  { key: "dispatch", label: "Dispatch", icon: <EngineeringIcon />, metric: "Crew B ready" },
  { key: "reports", label: "Report Center", icon: <SummarizeIcon />, metric: "$1.8M modeled value" }
];

const currentTasks: { key: TaskKey; label: string; detail: string; status: string }[] = [
  {
    key: "emergency",
    label: "Active emergency work order",
    detail: "Open WO-1842, gas leak near hospital corridor.",
    status: "Next"
  },
  {
    key: "crews",
    label: "Evaluate candidate crews",
    detail: "Compare qualifications, equipment, travel, overtime, and effective cost.",
    status: "Ready"
  },
  {
    key: "assignment",
    label: "Confirm dispatch assignment",
    detail: "Assign Crew B and update emergency response status.",
    status: "Queued"
  },
  {
    key: "impact",
    label: "Review business impact",
    detail: "Show SLA protection, overtime avoided, and cost savings.",
    status: "Queued"
  }
];

const hubPanels: Record<HubKey, { title: string; summary: string; stats: { label: string; value: string }[] }> = {
  dashboard: {
    title: "Executive Dashboard",
    summary: "Operating snapshot for the live demo: emergency load, SLA pressure, crew utilization, and value at stake.",
    stats: [
      { label: "Emergency jobs", value: "14" },
      { label: "Crew utilization", value: "82%" },
      { label: "SLA risk", value: "23 jobs" }
    ]
  },
  workOrders: {
    title: "Work Orders",
    summary: "Planner queue focused on WO-1842, with additional gas and electric work visible for operational context.",
    stats: [
      { label: "Selected", value: "WO-1842" },
      { label: "Priority", value: "Emergency" },
      { label: "Customer impact", value: "1,240" }
    ]
  },
  dispatch: {
    title: "Dispatch",
    summary: "Crew recommendation workspace for selecting qualified crews, comparing constraints, and confirming assignment.",
    stats: [
      { label: "Recommendation", value: "Crew B" },
      { label: "Fit score", value: "96%" },
      { label: "ETA", value: "18 min" }
    ]
  },
  reports: {
    title: "Report Center",
    summary: "Closeout view for recommendation rationale, assignment audit, ROI, and executive presentation outputs.",
    stats: [
      { label: "Overtime avoided", value: "210 hrs" },
      { label: "Travel reduction", value: "14%" },
      { label: "Annualized savings", value: "$1.8M" }
    ]
  }
};

const taskPanels: Record<TaskKey, { title: string; body: string; actions: string[] }> = {
  emergency: {
    title: "WO-1842 - Gas Leak Emergency",
    body: "The current task starts inside the work order record so the user feels like they are operating the app, not reading a process list.",
    actions: ["Review location and SLA", "Confirm required gas skills", "Inspect affected customer context"]
  },
  crews: {
    title: "Crew Evaluation",
    body: "This task is where the app compares available crews against safety gates, equipment readiness, travel, productivity, and effective cost.",
    actions: ["Run crew fit check", "Rank qualified crews", "Explain why Crew B wins"]
  },
  assignment: {
    title: "Dispatch Confirmation",
    body: "After the recommendation is accepted, the console should show assignment state changing from needs assignment to dispatched.",
    actions: ["Assign Crew B", "Update work order status", "Show ETA confirmation"]
  },
  impact: {
    title: "Impact Summary",
    body: "The report task turns the dispatch action into business value for the presenter: SLA risk reduced, overtime avoided, and customer impact protected.",
    actions: ["Calculate savings", "Generate summary", "Return to executive close"]
  }
};

export function OperationsConsolePage() {
  const [activeHub, setActiveHub] = useState<HubKey>("dashboard");
  const [activeTask, setActiveTask] = useState<TaskKey>("emergency");
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const isMenuOpen = Boolean(menuAnchor);
  const hubPanel = hubPanels[activeHub];
  const taskPanel = taskPanels[activeTask];

  function openMenu(event: MouseEvent<HTMLButtonElement>) {
    setMenuAnchor(event.currentTarget);
  }

  function closeMenu() {
    setMenuAnchor(null);
  }

  return (
    <Stack spacing={3}>
      <Paper
        sx={{
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider"
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          sx={{
            px: { xs: 2, md: 3 },
            py: 2,
            bgcolor: "#0f172a",
            color: "white"
          }}
        >
          <div>
            <Typography sx={{ fontWeight: 900, lineHeight: 1 }} variant="h1">
              NorthStar Operations Console
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.72)", mt: 0.75 }} variant="body2">
              Console Hub
            </Typography>
          </div>
          <IconButton aria-controls={isMenuOpen ? "demo-controls-menu" : undefined} aria-haspopup="true" aria-label="Demo controls" onClick={openMenu} sx={{ color: "white" }}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={menuAnchor}
            id="demo-controls-menu"
            onClose={closeMenu}
            open={isMenuOpen}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem component={RouterLink} onClick={closeMenu} to="/ai-crew-recommendation">
              Return to Presentation
            </MenuItem>
            <MenuItem component={RouterLink} onClick={closeMenu} to="/explainability">
              <PsychologyIcon fontSize="small" sx={{ mr: 1 }} /> Explainability
            </MenuItem>
            <MenuItem component={RouterLink} onClick={closeMenu} to="/roi">
              <AssessmentIcon fontSize="small" sx={{ mr: 1 }} /> ROI
            </MenuItem>
            <MenuItem component={RouterLink} onClick={closeMenu} to="/operations-console">
              <ReplayIcon fontSize="small" sx={{ mr: 1 }} /> Restart Demo
            </MenuItem>
          </Menu>
        </Stack>

        <Grid container spacing={0}>
          {consoleHubItems.map((item) => (
            <Grid item key={item.key} md={3} xs={12}>
              <Button
                fullWidth
                onClick={() => setActiveHub(item.key)}
                startIcon={item.icon}
                sx={{
                  alignItems: "flex-start",
                  borderRadius: 0,
                  borderRight: { md: "1px solid" },
                  borderBottom: { xs: "1px solid", md: 0 },
                  borderColor: "divider",
                  color: activeHub === item.key ? "primary.main" : "text.primary",
                  justifyContent: "flex-start",
                  minHeight: 78,
                  px: 2,
                  py: 1.5,
                  textAlign: "left"
                }}
              >
                <Stack spacing={0.25}>
                  <Typography fontWeight={900}>{item.label}</Typography>
                  <Typography color="text.secondary" variant="body2">{item.metric}</Typography>
                </Stack>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item lg={8} xs={12}>
          <Paper sx={{ p: 3, height: "100%" }} variant="outlined">
            <Stack direction="row" justifyContent="space-between" gap={2} flexWrap="wrap">
              <div>
                <Typography variant="h2">{hubPanel.title}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 760 }}>
                  {hubPanel.summary}
                </Typography>
              </div>
              <Chip color="primary" label="App mode" />
            </Stack>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              {hubPanel.stats.map((stat) => (
                <Grid item md={4} xs={12} key={stat.label}>
                  <Paper sx={{ p: 2, bgcolor: "grey.50" }} variant="outlined">
                    <Typography color="text.secondary" variant="body2">{stat.label}</Typography>
                    <Typography fontWeight={900} sx={{ mt: 0.5 }} variant="h2">{stat.value}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography fontWeight={900}>{taskPanel.title}</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {taskPanel.body}
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2 }}>
              {taskPanel.actions.map((action) => (
                <Chip key={action} label={action} variant="outlined" />
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid item lg={4} xs={12}>
          <Paper sx={{ p: 3, height: "100%" }} variant="outlined">
            <Typography variant="h2">Current Task</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Use these actions to move deeper into the console experience.
            </Typography>
            <Stack divider={<Divider flexItem />} sx={{ mt: 2 }}>
              {currentTasks.map((task) => (
                <Button
                  key={task.key}
                  onClick={() => setActiveTask(task.key)}
                  sx={{
                    alignItems: "flex-start",
                    borderRadius: 1,
                    color: "text.primary",
                    justifyContent: "flex-start",
                    px: 1,
                    py: 1.5,
                    textAlign: "left"
                  }}
                >
                  <Stack spacing={0.75} sx={{ width: "100%" }}>
                    <Stack alignItems="center" direction="row" justifyContent="space-between" gap={1}>
                      <Typography fontWeight={900}>{task.label}</Typography>
                      <Chip color={task.key === activeTask ? "primary" : "default"} label={task.status} size="small" />
                    </Stack>
                    <Typography color="text.secondary" variant="body2">{task.detail}</Typography>
                  </Stack>
                </Button>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}
