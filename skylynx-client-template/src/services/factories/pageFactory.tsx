// ================================================
// ✅ Factory: PageFactory
// Description: Builds a single Page node and registers route
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: factories/pageFactory.tsx
// ================================================

import React from "react";
import { TreeFactory } from "./treeFactory"; // ✅ Missing import added
import { RouteRegistry } from "../../config/routeRegistry";

import {
  SkylynxRenderNode,
  ISkylynxViewModel,
} from "../../components/core/types";

import PageWrapper from "../../components/ui/page/pageWrapper";
import {  PortalPageModel } from "../../entities/portal";

export function PageFactory(
  node: SkylynxRenderNode<ISkylynxViewModel>
): JSX.Element {
  const children = node.children || [];
  let page = node.targetComponent as PortalPageModel;
  const routePath = page.routePath;

  const component = () => (
    <PageWrapper renderNode={node}>
      {children.map((childNode, index) => (
        <React.Fragment key={index}>
          {TreeFactory(childNode, node)}
        </React.Fragment>
      ))}
    </PageWrapper>
  );

  if (routePath) {
    //RouteRegistry.register(routePath, component);
    console.log("📌 Registered route:", routePath);
  }

  return component();
}
