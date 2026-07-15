// ================================================
// File: Operations Console Page
// Description: Hosts the NorthStar interactive proof-of-concept console launch experience.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: OperationsConsolePage.tsx
// Type: React TypeScript page component file
// ================================================

import { Button, Chip, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ArchitectureIcon from "@mui/icons-material/Architecture";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ReplayIcon from "@mui/icons-material/Replay";
import { Link as RouterLink } from "react-router-dom";

const workflowSteps = [
  "Review operating situation",
  "Select emergency work order",
  "View map and geospatial context",
  "Evaluate candidate crews",
  "Generate crew recommendation",
  "Explain why Crew B wins",
  "Show business impact"
];

const decisionHighlights = [
  { label: "Hero work order", value: "WO-1842 · Gas leak emergency" },
  { label: "Recommended crew", value: "Crew B" },
  { label: "Launch path", value: "Presentation → Console → Executive close" }
];

export function OperationsConsolePage() {
  return (
    <Stack spacing={4}>
      <Paper
        sx={{
          p: { xs: 3, md: 4 },
          background: "linear-gradient(135deg, #14532d, #0f766e)",
          color: "white"
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={3}>
          <div>
            <Typography sx={{ fontWeight: 800 }} variant="overline">
              Interactive proof-of-concept
            </Typography>
            <Typography sx={{ mt: 0.75 }} variant="h1">
              NorthStar Operations Console
            </Typography>
            <Typography sx={{ mt: 2, maxWidth: 820, fontSize: "1.05rem", opacity: 0.92 }}>
              Interactive dispatch workflow for gas and electric field operations, showing how planners move from an emergency work order to a qualified, explainable, cost-aware crew assignment.
            </Typography>
          </div>
          <Stack alignItems={{ xs: "flex-start", md: "flex-end" }} spacing={1.25}>
            <Chip label="Functional POC mode" sx={{ bgcolor: "rgba(255,255,255,0.16)", color: "white", fontWeight: 800 }} />
            <Button component={RouterLink} startIcon={<ArrowBackIcon />} sx={{ bgcolor: "white", color: "primary.main", "&:hover": { bgcolor: "rgba(255,255,255,0.9)" } }} to="/ai-crew-recommendation" variant="contained">
              Return to Presentation
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        <Grid item lg={8} xs={12}>
          <Paper sx={{ p: 3, height: "100%" }} variant="outlined">
            <Typography variant="h2">Console workflow</Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 760 }}>
              This shell is the launch point for the interactive demo. The next build sections will fill these steps with selectable work orders, map context, crew evaluation, recommendation scoring, explainability, assignment confirmation, and ROI impact.
            </Typography>
            <Stack divider={<Divider flexItem />} sx={{ mt: 3 }}>
              {workflowSteps.map((step, index) => (
                <Stack alignItems="center" direction="row" gap={2} key={step} sx={{ py: 1.5 }}>
                  <Chip color={index === 0 ? "primary" : "default"} label={index + 1} />
                  <Typography fontWeight={800}>{step}</Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid item lg={4} xs={12}>
          <Stack spacing={3}>
            <Paper sx={{ p: 3 }} variant="outlined">
              <Typography variant="h2">Demo controls</Typography>
              <Stack spacing={1.25} sx={{ mt: 2 }}>
                <Button component={RouterLink} fullWidth startIcon={<PsychologyIcon />} to="/explainability" variant="outlined">
                  Jump to Explainability
                </Button>
                <Button component={RouterLink} fullWidth startIcon={<ArchitectureIcon />} to="/architecture" variant="outlined">
                  Jump to Architecture
                </Button>
                <Button component={RouterLink} fullWidth startIcon={<AssessmentIcon />} to="/roi" variant="outlined">
                  Jump to ROI
                </Button>
                <Button component={RouterLink} fullWidth startIcon={<ReplayIcon />} to="/operations-console" variant="text">
                  Restart Demo
                </Button>
              </Stack>
            </Paper>

            <Paper sx={{ p: 3 }} variant="outlined">
              <Typography variant="h2">Decision frame</Typography>
              <Stack spacing={1.5} sx={{ mt: 2 }}>
                {decisionHighlights.map((item) => (
                  <div key={item.label}>
                    <Typography color="text.secondary" variant="body2">{item.label}</Typography>
                    <Typography fontWeight={900}>{item.value}</Typography>
                  </div>
                ))}
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
