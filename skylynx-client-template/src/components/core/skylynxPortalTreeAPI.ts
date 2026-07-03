// ================================================
// ✅ API: skylynxPortalTreeAPI
// Description: Fetches Skylynx Portal Template Tree + Target Types (Axios + Logging)
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: services/api/skylynxPortalTreeAPI.ts
// ================================================

import axios from "axios";
import { SkylynxPortalTree, TemplateType } from "./types";
import { SkylynxKey_APIKEY, SkylynxServer_URL } from "../../helpers/constants";
import { PortalNamespace } from "./types";

/**
 * ✅ Loads the Skylynx portal tree for a specific namespace
 * Falls back to default/host portal if none provided
 * @param namespace e.g. "host", "portalA", "portalB"
 */
export const fetchSkylynxPortalTree = async (
  namespace?: PortalNamespace
): Promise<SkylynxPortalTree> => {
  const endpoint = namespace
    ? `${SkylynxServer_URL}/nimbus/templates/portals?namespace=${namespace}`
    : `${SkylynxServer_URL}/nimbus/templates/portals`;

  try {
    console.info(
      `🔁 [Skylynx] Fetching portal tree: GET ${endpoint} (namespace: ${
        namespace || "default"
      })`
    );

    const response = await axios.get<SkylynxPortalTree>(endpoint, {
      headers: {
        "skyx-api-key": SkylynxKey_APIKEY,
      },
    });

    console.info(`✅ [Skylynx] Portal tree loaded (${namespace || "default"})`);
    return response.data;
  } catch (error: any) {
    const status = error?.response?.status || "Unknown";
    const message =
      error?.response?.data?.message || error?.message || "Unexpected error";

    console.error(
      `❌ [Skylynx] Failed to load portal tree (${status}) [${
        namespace || "default"
      }]: ${message}`
    );
    throw new Error(`Skylynx portal tree load failed: ${message}`);
  }
};

/**
 * ✅ Loads all supported ProtosTargetTypes
 */
export const fetchProtosTargetTypes = async (): Promise<TemplateType[]> => {
  const endpoint = `${SkylynxServer_URL}/nimbus/templates/types`;

  try {
    console.info(`🔁 [Skylynx] Fetching target types: GET ${endpoint}`);

    const response = await axios.get<TemplateType[]>(endpoint, {
      headers: {
        "skyx-api-key": SkylynxKey_APIKEY,
      },
    });

    console.info(`✅ [Skylynx] Target types loaded successfully.`);
    return response.data;
  } catch (error: any) {
    const status = error?.response?.status || "Unknown";
    const message =
      error?.response?.data?.message || error?.message || "Unexpected error";

    console.error(
      `❌ [Skylynx] Failed to load target types (${status}): ${message}`
    );
    throw new Error(`Skylynx target types load failed: ${message}`);
  }
};
