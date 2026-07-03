// ================================================
// File: Application Bootstrap
// Description: Prepares template configuration before rendering the guided presentation app.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: appBootstrap.tsx
// Type: React TypeScript bootstrap component file
// ================================================

import { ReactNode, useEffect, useState } from "react";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { appConfig } from "./config/appConfig";
import { presentationTree } from "./config/presentationTree";
import { flattenPresentationTree } from "./services/presentation/presentationTreeService";

interface AppBootstrapProps {
  children: ReactNode;
}

export default function AppBootstrap({ children }: AppBootstrapProps) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeTemplate = () => {
      const nodes = flattenPresentationTree(presentationTree);

      if (nodes.length === 0) {
        setError("Presentation Tree must contain at least one node.");
        return;
      }

      setReady(true);
    };

    initializeTemplate();
  }, []);

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error" variant="h2">
          Template startup failed
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {error}
        </Typography>
      </Box>
    );
  }

  if (!ready) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", bgcolor: "background.default" }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography variant="h2">{appConfig.appName}</Typography>
          <Typography color="text.secondary">{appConfig.splash.message}</Typography>
        </Stack>
      </Box>
    );
  }

  return <>{children}</>;
}
