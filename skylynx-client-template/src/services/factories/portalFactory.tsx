// ================================================
// ✅ Factory: PortalFactory
// Description: Loads entire Portal runtime config, wraps in PortalWrapper
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: factories/portalFactory.tsx
// ================================================

import React from "react";
import { TreeFactory } from "./treeFactory";
import PortalWrapper from "../../components/ui/portal/portalWrapper";
import {
  ISkylynxViewModel,
  SkylynxRenderNode,
} from "../../components/core/types";

export function PortalFactory(
  node: SkylynxRenderNode<ISkylynxViewModel>
): JSX.Element {
  const children = node.children || [];

  return (
    <PortalWrapper renderNode={node} >
      {children.map((childNode, index) => (
        <React.Fragment key={index}>
          {TreeFactory(childNode, node)}
        </React.Fragment>
      ))}
    </PortalWrapper>
  );
}
