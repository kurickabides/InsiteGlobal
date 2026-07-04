// ================================================
// File: Presentation Progress
// Description: Displays guided presentation completion status.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: PresentationProgress.tsx
// Type: React TypeScript component file
// ================================================

import { Box, LinearProgress, Typography } from "@mui/material";

interface PresentationProgressProps {
  activeIndex: number;
  totalNodes: number;
}

export function PresentationProgress({ activeIndex, totalNodes }: PresentationProgressProps) {
  const currentStep = activeIndex >= 0 ? activeIndex + 1 : 1;
  const progress = totalNodes > 0 ? (currentStep / totalNodes) * 100 : 0;

  return (
    <Box sx={{ minWidth: { xs: "100%", sm: 220 } }}>
      <Typography color="text.secondary" variant="body2">
        Step {currentStep} of {totalNodes}
      </Typography>
      <LinearProgress sx={{ mt: 0.75 }} value={progress} variant="determinate" />
    </Box>
  );
}
