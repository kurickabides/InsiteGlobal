// ================================================
// ✅ Utility: envHydrator
// Description: Bootstraps runtime config into global memory
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: services/utils/envHydrator.ts
// ================================================

let runtimeEnv: Record<string, string> = {};

// 🧩 Static config fallbacks
import {
  SkylynxKey_APIKEY,
  SkylynxKey_HostPortal,
  AuthServer_URL,
  app_URL,
  SkylynxServer_URL,
  SkylynxServer_TemplatesURL,
} from "../helpers/constants";

/**
 * ✅ Load all env vars into in-memory cache from helper fallbacks
 */
export function hydrateEnv(): void {
  runtimeEnv = {
    SKYLYNX_API_KEY: SkylynxKey_APIKEY,
    SKYLYNX_HOST_PORTAL: SkylynxKey_HostPortal,
    AUTHSERVER_URL: AuthServer_URL,
    APP_URL: app_URL,
    SKYLYNX_SERVER_URL: SkylynxServer_URL,
    SKYLYNX_TEMPLATES_URL: SkylynxServer_TemplatesURL,
  };
}

/**
 * ✅ Get any loaded runtime variable
 */
export function getEnvVar(key: string): string | undefined {
  return runtimeEnv[key];
}
