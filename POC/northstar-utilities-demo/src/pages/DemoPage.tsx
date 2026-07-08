// ================================================
// File: Demo Page
// Description: Renders each NorthStar presentation section with metrics, surfaces, key takeaways, and guided navigation.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: DemoPage.tsx
// Type: React TypeScript page component file
// ================================================

import { Box, Button, Chip, Grid, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Link as RouterLink } from "react-router-dom";
import { getDemoSurface } from "../components/presentation/DemoSurfaceRegistry";
import { DemoRoute, demoRoutes } from "../data/demoRoutes";

interface DemoPageProps {
  route: DemoRoute;
}

export function DemoPage({ route }: DemoPageProps) {
  const currentIndex = demoRoutes.findIndex((item) => item.path === route.path);
  const previousRoute = demoRoutes[currentIndex - 1];
  const nextRoute = demoRoutes[currentIndex + 1];
  const DemoSurface = getDemoSurface(route.componentKey);
  const progress = ((currentIndex + 1) / demoRoutes.length) * 100;

  return (
    <Stack spacing={4}>
      <Box>
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
      </Box>

      {route.metrics && (
        <Grid container spacing={2}>
          {route.metrics.map((metric) => (
            <Grid item key={metric.label} sm={4} xs={12}>
              <Paper sx={{ p: 2.5, height: "100%" }} variant="outlined">
                <Typography color="text.secondary" variant="body2">
                  {metric.label}
                </Typography>
                <Typography sx={{ mt: 1 }} variant="h2">
                  {metric.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Grid container spacing={3}>
        <Grid item lg={8} xs={12}>
          <Paper sx={{ p: 3, minHeight: 360 }} variant="outlined">
            <Typography sx={{ mb: 2 }} variant="h2">
              Demo Surface
            </Typography>
            <DemoSurface route={route} />
          </Paper>
        </Grid>

        <Grid item lg={4} xs={12}>
          <Paper sx={{ p: 3, minHeight: 360 }} variant="outlined">
            <Typography sx={{ mb: 2 }} variant="h2">
              Key Takeaways
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {route.focus.map((item) => (
                <Chip key={item} label={item} variant="outlined" />
              ))}
            </Stack>
          </Paper>
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
