// ================================================
// File: Splash Screen
// Description: Displays configurable startup branding while the presentation template initializes.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: SplashScreen.tsx
// Type: React TypeScript component file
// ================================================

import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { appConfig } from "@/config/appConfig";

export function SplashScreen() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        bgcolor: "background.default",
        background: "linear-gradient(135deg, rgba(25, 118, 210, 0.12), rgba(156, 39, 176, 0.08))"
      }}
    >
      <Stack alignItems="center" spacing={2.5} sx={{ px: 3, textAlign: "center" }}>
        <Box
          sx={{
            width: 88,
            height: 88,
            display: "grid",
            placeItems: "center",
            borderRadius: "28px",
            bgcolor: "background.paper",
            boxShadow: "0 24px 70px rgba(15, 23, 42, 0.16)"
          }}
        >
          <CircularProgress size={42} thickness={4} />
        </Box>
        <Stack spacing={0.75}>
          <Typography variant="h2">{appConfig.appName}</Typography>
          <Typography color="text.secondary" variant="body1">
            {appConfig.splash.message}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
