// ================================================
// ✅ Factory: ModuleFactory
// Description: Injects modules using registry + wraps with ModuleWrapper
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: ModuleFactory.ts
// ================================================

// ================================================
// ✅ Factory: ModuleFactory
// Description: Renders Module with metadata wrapper + dynamic content builder
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: factories/moduleFactory.tsx
// ================================================

import React from "react";
import ModuleWrapper from "../../components/ui/module/moduleWrapper";
import { SkylynxRenderNode } from "../../components/core/types";
import { ViewModelContentBuilderFactory } from "./viewModelContentBuilderFactory";

export function ModuleFactory(node: SkylynxRenderNode): JSX.Element {
  if (!node) {
    return (
      <ModuleWrapper renderNode={{} as any}>
        ⚠️ Missing module data
      </ModuleWrapper>
    );
  }

  return (
    <ModuleWrapper renderNode={node}>
      {ViewModelContentBuilderFactory(node)}
    </ModuleWrapper>
  );
}
