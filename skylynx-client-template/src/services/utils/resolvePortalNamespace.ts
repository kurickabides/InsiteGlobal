// ================================================
// ✅ Utility: resolvePortalNamespace
// Description: Gets portal namespace based on current URL path
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: helpers/resolvePortalNamespace.ts
// ================================================

import { PortalNamespace } from "../../components/core/types";

/**
 * Returns current namespace based on URL or other logic
 */
export const getCurrentNamespace = (): PortalNamespace => {
  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    const match = path.match(/^\/(portal[^\/]*)/i); // e.g., "/portalA/dashboard"

    return match ? match[1] : "host";
  }

  // Default fallback for SSR or unknown state
  return "host";
};