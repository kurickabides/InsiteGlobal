// ================================================
// File: Demo Page
// Description: Renders each NorthStar presentation section with metrics, surfaces, insight summaries, and guided navigation.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: DemoPage.tsx
// Type: React TypeScript page component file
// ================================================

import { Button, Chip, Grid, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Link as RouterLink } from "react-router-dom";
import { getDemoSurface } from "../components/presentation/DemoSurfaceRegistry";
import { DemoRoute, demoRoutes } from "../data/demoRoutes";

const insightTitles = [
  "Key Insights",
  "Decision Points",
  "Executive Insights",
  "Strategic Highlights",
  "Summary Insights",
  "Main Points",
  "Core Findings",
  "Critical Takeaways",
  "What Matters Most",
  "Bottom Line"
];

interface DemoPageProps {
  route: DemoRoute;
}

function PresenterMetricCards({ metrics }: { metrics: NonNullable<DemoRoute["metrics"]> }) {
  const [selectedMetricIndex, setSelectedMetricIndex] = useState(0);
  const selectedMetric = metrics[selectedMetricIndex];

  useEffect(() => {
    setSelectedMetricIndex(0);
  }, [metrics]);

  return (
    <Paper sx={{ p: 2.5 }} variant="outlined">
      <Typography sx={{ mb: 1.5 }} variant="h2">
        Presenter metrics
      </Typography>
      <Stack direction={{ xs: "column", sm: "row", lg: "column", xl: "row" }} spacing={1.25}>
        {metrics.map((metric, index) => {
          const selected = index === selectedMetricIndex;

          return (
            <Paper
              aria-pressed={selected}
              component="button"
              key={metric.label}
              onClick={() => setSelectedMetricIndex(index)}
              sx={{
                p: 2,
                flex: 1,
                minWidth: 0,
                borderColor: selected ? "primary.main" : "divider",
                bgcolor: selected ? "rgba(46, 125, 50, 0.08)" : "background.paper",
                cursor: "pointer",
                textAlign: "left"
              }}
              variant="outlined"
            >
              <Typography color="text.secondary" variant="body2">
                {metric.label}
              </Typography>
              <Typography sx={{ mt: 0.5 }} variant="h2">
                {metric.value}
              </Typography>
            </Paper>
          );
        })}
      </Stack>
      <Paper sx={{ mt: 1.5, p: 2, bgcolor: "background.default" }} variant="outlined">
        <Typography fontWeight={900}>{selectedMetric.label}</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.75 }} variant="body2">
          {selectedMetric.description}
        </Typography>
      </Paper>
    </Paper>
  );
}

export function DemoPage({ route }: DemoPageProps) {
  const currentIndex = demoRoutes.findIndex((item) => item.path === route.path);
  const previousRoute = demoRoutes[currentIndex - 1];
  const nextRoute = demoRoutes[currentIndex + 1];
  const DemoSurface = getDemoSurface(route.componentKey);
  const progress = ((currentIndex + 1) / demoRoutes.length) * 100;
  const insightTitle = insightTitles[currentIndex % insightTitles.length];

  return (
    <Stack spacing={4}>
      <div>
        <Typography color="secondary" sx={{ fontWeight: 800 }} variant="overline">
          {route.eyebrow}
        </Typography>
        <Typography sx={{ mt: 0.5, maxWidth: 900 }} variant="h1">
          {route.title}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 820, fontSize: "1.05rem" }} variant="body1">
          {route.summary}
        </Typography>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 2, maxWidth: 520 }}>
          <Typography color="text.secondary" variant="body2">Step {currentIndex + 1} of {demoRoutes.length}</Typography>
          <LinearProgress variant="determinate" value={progress} sx={{ flex: 1 }} />
        </Stack>
      </div>

      <Grid container spacing={3}>
        <Grid item lg={8} xs={12}>
          <Paper sx={{ p: 3, minHeight: 360 }} variant="outlined">
            <Typography sx={{ mb: 2 }} variant="h2">
              {route.surfaceTitle}
            </Typography>
            <DemoSurface route={route} />
          </Paper>
        </Grid>

        <Grid item lg={4} xs={12}>
          <Stack spacing={3}>
            <Paper sx={{ p: 3, minHeight: 360 }} variant="outlined">
              <Typography sx={{ mb: 2 }} variant="h2">
                {insightTitle}
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {route.focus.map((item) => (
                  <Chip key={item} label={item} variant="outlined" />
                ))}
              </Stack>
            </Paper>
            {route.metrics && <PresenterMetricCards metrics={route.metrics} />}
          </Stack>
        </Grid>
      </Grid>

      <Stack direction="row" justifyContent="space-between" gap={2} flexWrap="wrap">
        <Button component={RouterLink} disabled={!previousRoute} startIcon={<ArrowBackIcon />} to={previousRoute?.path ?? route.path} variant="outlined">
          Previous
        </Button>
        <Stack direction="row" gap={1.5}>
          <Button component={RouterLink} startIcon={<RestartAltIcon />} to="/welcome" variant="text">
            Restart
          </Button>
          {nextRoute && (
            <Button component={RouterLink} endIcon={<ArrowForwardIcon />} to={nextRoute.path} variant="contained">
              Continue
            </Button>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
