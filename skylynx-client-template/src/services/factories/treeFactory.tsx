// ================================================
// ✅ Factory: TreeFactory
// Description: Root dispatcher that delegates rendering based on template type
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: factories/treeFactory.tsx
// ================================================

import React from "react";
import {
  SkylynxRenderNode,
  ISkylynxViewModel,
} from "../../components/core/types";
import { PortalFactory } from "./portalFactory";
import { LayoutFactory } from "./layoutFactory";
import { PageFactory } from "./pageFactory";
import { ModuleFactory } from "./moduleFactory";
import { ThemeFactory } from "./themeFactory";

/**
 * Recursively traverses SkylynxRenderNode tree and delegates rendering to the appropriate factory
 * @param node SkylynxRenderNode<ISkylynxViewModel>
 * @param parent (optional) Parent node for context-aware rendering
 */
export function TreeFactory(
  node: SkylynxRenderNode<ISkylynxViewModel>,
  parent?: SkylynxRenderNode<ISkylynxViewModel>
): JSX.Element {
  switch (node.template?.templateType.TargetTypeName) {
    case "Portal":
      return PortalFactory(node);
    case "Theme":
      return ThemeFactory(node);
    case "Layout":
      return LayoutFactory(node);
    case "Page":
      return PageFactory(node);
    case "Module":
      return ModuleFactory(node);
    default:
      return (
        <div style={{ color: "red", padding: "1rem" }}>
          ⚠️ Unknown template type:{" "}
          <b>{node.template?.templateType.TargetTypeName || "N/A"}</b>
        </div>
      );
  }
}
