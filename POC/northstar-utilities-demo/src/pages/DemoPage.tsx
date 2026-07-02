// ================================================
// Component: Demo Page
// Description: Renders each demo section with metrics, focus areas, and navigation.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: DemoPage.tsx
// Type: React TypeScript page component file
// ================================================

import { Box, Button, Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link as RouterLink } from "react-router-dom";
import { DemoRoute, demoRoutes } from "../data/demoRoutes";

interface DemoPageProps {
  route: DemoRoute;
}

export function DemoPage({ route }: DemoPageProps) {
  const currentIndex = demoRoutes.findIndex((item) => item.path === route.path);
  const nextRoute = demoRoutes[currentIndex + 1];

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="overline" color="secondary" sx={{ fontWeight: 800 }}>
          {route.eyebrow}
        </Typography>
        <Typography variant="h1" sx={{ mt: 0.5, maxWidth: 840 }}>
          {route.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: 760, fontSize: "1.05rem" }}>
          {route.summary}
        </Typography>
      </Box>

      {route.metrics && (
        <Grid container spacing={2}>
          {route.metrics.map((metric) => (
            <Grid item xs={12} sm={4} key={metric.label}>
              <Paper variant="outlined" sx={{ p: 2.5, height: "100%" }}>
                <Typography variant="body2" color="text.secondary">
                  {metric.label}
                </Typography>
                <Typography variant="h2" sx={{ mt: 1 }}>
                  {metric.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Paper variant="outlined" sx={{ p: 3, minHeight: 300 }}>
            <Typography variant="h2" sx={{ mb: 2 }}>
              Demo Surface
            </Typography>
            <Box
              sx={{
                minHeight: 220,
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 1,
                bgcolor: "background.default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 3,
                textAlign: "center"
              }}
            >
              <Typography color="text.secondary">
                Placeholder workspace for {route.title.toLowerCase()} content.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Paper variant="outlined" sx={{ p: 3, minHeight: 300 }}>
            <Typography variant="h2" sx={{ mb: 2 }}>
              Focus Areas
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {route.focus.map((item) => (
                <Chip key={item} label={item} variant="outlined" />
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {nextRoute && (
        <Box>
          <Button component={RouterLink} to={nextRoute.path} variant="contained" endIcon={<ArrowForwardIcon />}>
            Continue
          </Button>
        </Box>
      )}
    </Stack>
  );
}
