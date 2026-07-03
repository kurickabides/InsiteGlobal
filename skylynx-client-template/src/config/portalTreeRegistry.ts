// ================================================
// ✅ Registry: PortalTreeRegistry
// Description: In-memory portal tree cache with edit support
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: services/registry/portalTreeRegistry.ts
// ================================================

import {
  PortalNamespace,
  TreePair,
  SkylynxPortalTree,
} from "../components/core/types";
import { deepClone, deepEqual } from "../services/utils/objectTools";
import { fetchSkylynxPortalTree } from "../components/core/skylynxPortalTreeAPI"; // <- Adjust to match your fetch logic

const registry: Record<PortalNamespace, TreePair> = {};

export const PortalTreeRegistry = {
  /**
   * Loads the portal tree from backend or memory.
   */
  async load(namespace: PortalNamespace): Promise<SkylynxPortalTree> {
    if (!registry[namespace]) {
      const fetched = await fetchSkylynxPortalTree(namespace);
      registry[namespace] = {
        original: deepClone(fetched),
        current: deepClone(fetched),
      };
    }
    return registry[namespace].current;
  },

  /**
   * Returns the current working tree (editable).
   */
  getTree(namespace: PortalNamespace): SkylynxPortalTree | undefined {
    return registry[namespace]?.current;
  },

  /**
   * Replace the current tree (e.g., admin modified tree).
   */
  setTree(namespace: PortalNamespace, updatedTree: SkylynxPortalTree): void {
    if (registry[namespace]) {
      registry[namespace].current = updatedTree;
    } else {
      registry[namespace] = {
        original: deepClone(updatedTree),
        current: updatedTree,
      };
    }
  },

  /**
   * Returns true if the current tree has been modified.
   */
  hasChanges(namespace: PortalNamespace): boolean {
    const entry = registry[namespace];
    return entry ? !deepEqual(entry.current, entry.original) : false;
  },

  /**
   * Resets the working tree back to original.
   */
  reset(namespace: PortalNamespace): void {
    const entry = registry[namespace];
    if (entry) {
      entry.current = deepClone(entry.original);
    }
  },

  /**
   * Wipes memory for one or all portal trees.
   */
  clear(namespace?: PortalNamespace): void {
    if (namespace) {
      delete registry[namespace];
    } else {
      Object.keys(registry).forEach((ns) => delete registry[ns]);
    }
  },
};
