// ================================================
// ✅ Factory: DyFormFactory
// Description: Renders DyForm components from metadata render tree
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: factories/dyFormFactory.tsx
// ================================================

import React from "react";
import DyFormWrapper from "../../components/ui/dyForm/dyFormWrapper";
import { TreeFactory } from "./treeFactory";
import {
  SkylynxRenderNode,
  ISkylynxViewModel,
} from "../../components/core/types";

export function DyFormFactory(
  node: SkylynxRenderNode<ISkylynxViewModel>
): JSX.Element {
  const children = node.children || [];

  return (
    <DyFormWrapper renderNode={node} debugId={node.viewModel?.contextKey}>
      {children.map((childNode, index) => (
        <React.Fragment key={index}>
          {TreeFactory(childNode, node)}
        </React.Fragment>
      ))}
    </DyFormWrapper>
  );
}
