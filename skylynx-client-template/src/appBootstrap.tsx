// ================================================
// ✅ Component: AppBootstrap
// Description: Loads portal tree + config before app renders
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: AppBootstrap.tsx
// ================================================

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./hooks/reduxHooks";
import { loadSkylynxPortalTree } from "./components/core/skylynxPortalTreeSlice";
import { loadProtosTargetTypes } from "./components/core/protosTargetTypeSlice";
import SplashScreen from "./components/ui/splashScreen";
import { hydrateRenderTree } from "./services/utils/hydrateRenderTree";
import { hydrateEnv, getEnvVar } from "./config/envHydrator";
import { RouteRegistry } from "./config/routeRegistry";

interface Props {
  children: React.ReactNode;
}

const AppBootstrap: React.FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();
  const portalTree = useAppSelector((state) => state.skylynxPortalTree.tree);
  const targetTypes = useAppSelector((state) => state.protosTargetType.types);

  const [timeoutReached, setTimeoutReached] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const portalTreeLoaded = !!portalTree && Object.keys(portalTree).length > 0;
  const targetTypesLoaded = targetTypes.length > 0;
  const ready = portalTreeLoaded && targetTypesLoaded;

  // 🌱 Step 1: Hydrate runtime config on mount
  useEffect(() => {
    hydrateEnv();
  }, []);

  // 🌐 Step 2: Pull namespace from hydrated env (instead of URL)
  const namespace = getEnvVar("SKYLYNX_HOST_PORTAL") || "SkyLynxNet";
  const apiKey = getEnvVar("SKYLYNX_API_KEY");

  // 🔄 Step 3: Load metadata
  useEffect(() => {
    console.log("🌱 AppBootstrap initializing...");
    console.log(`🧭 Using Portal Namespace: ${namespace}`);
    dispatch(loadSkylynxPortalTree());
    dispatch(loadProtosTargetTypes());
  }, [dispatch, namespace]);

  useEffect(() => {
    const timer = setTimeout(() => setTimeoutReached(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready && !hydrated) {
      (async () => {
        try {
          console.log("🚀 Hydrating portal tree...");
          const hydratedTree = await hydrateRenderTree(portalTree, namespace);
          console.log("✅ Hydrated tree:", hydratedTree);

          // 🧪 Confirm registered routes
          const routes = RouteRegistry.keys();
          console.log(`🧩 RouteRegistry Initialized: ${routes.length} routes`);
          routes.forEach((r) => console.log(`→ ${r}`));

          setHydrated(true);
        } catch (err) {
          console.error("❌ Hydration failed:", err);
        }
      })();
    }
  }, [ready, hydrated, portalTree, namespace]);

  if (!ready || !hydrated) {
    if (timeoutReached) {
      return <div>❌ Failed to load portal. Please refresh or check logs.</div>;
    }
    return <SplashScreen />;
  }

  return <>{children}</>;
};

export default AppBootstrap;
