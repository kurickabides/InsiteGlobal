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
import { Box, Typography } from "@mui/material";
import { presentationTree } from "@/config/presentationTree";
import { flattenPresentationTree } from "@/services/presentation/presentationTreeService";
import { SplashScreen } from "@/components/splash/SplashScreen";

interface AppBootstrapProps {
  children: ReactNode;
}

export default function AppBootstrap({ children }: AppBootstrapProps) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const splashTimer = window.setTimeout(() => {
      const nodes = flattenPresentationTree(presentationTree);

      if (nodes.length === 0) {
        setError("Presentation Tree must contain at least one node.");
        return;
      }

      setReady(true);
    }, 850);

    return () => window.clearTimeout(splashTimer);
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
      <SplashScreen />
    );
  }

  return <>{children}</>;
}
