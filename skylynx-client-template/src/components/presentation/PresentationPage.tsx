// ================================================
// File: Presentation Page
// Description: Renders a presentation node with reusable metrics, focus areas, and demo surface placeholders.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: PresentationPage.tsx
// Type: React TypeScript component file
// ================================================

import { Box, Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import { PresentationNode } from "../../types/presentation";

interface PresentationPageProps {
  node: PresentationNode;
}

export function PresentationPage({ node }: PresentationPageProps) {
  return (
    <Stack spacing={4}>
      <Box>
        <Typography color="secondary" sx={{ fontWeight: 800 }} variant="overline">
          {node.eyebrow}
        </Typography>
        <Typography sx={{ mt: 0.5, maxWidth: 840 }} variant="h1">
          {node.title}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 760, fontSize: "1.05rem" }} variant="body1">
          {node.summary}
        </Typography>
      </Box>

      {node.metrics && (
        <Grid container spacing={2}>
          {node.metrics.map((metric) => (
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
        <Grid item lg={7} xs={12}>
          <Paper sx={{ p: 3, minHeight: 300 }} variant="outlined">
            <Typography sx={{ mb: 2 }} variant="h2">
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
                Placeholder workspace for {node.title.toLowerCase()} content.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item lg={5} xs={12}>
          <Paper sx={{ p: 3, minHeight: 300 }} variant="outlined">
            <Typography sx={{ mb: 2 }} variant="h2">
              Focus Areas
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {node.focus.map((item) => (
                <Chip key={item} label={item} variant="outlined" />
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}
