import React from "react";
import { TreeFactory } from "./treeFactory";
import LayoutWrapper from "../../components/ui/layouts/layoutWrapper";
import { SkylynxRenderNode } from "../../components/core/types";

export function LayoutFactory(node: SkylynxRenderNode): JSX.Element {
  const children = node.children || [];

  return (
    <LayoutWrapper renderNode={node}>
      {children.map((childNode, index) => (
        <React.Fragment key={index}>
          {TreeFactory(childNode, node)}
        </React.Fragment>
      ))}
    </LayoutWrapper>
  );
}
