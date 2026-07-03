// ================================================
// ✅ Factory: ViewModelContentBuilderFactory
// Description: Chooses correct render strategy for a Module node based on VM
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: factories/viewModelContentBuilderFactory.ts
// ================================================

import React from "react";
import { SkylynxRenderNode } from "../../components/core/types";
import ModuleWrapper from "../../components/ui/module/moduleWrapper";
import { ProtosTargetTypeEnum } from "../../entities/portal";

// Wrapper factories
import { DyFormFactory } from "./dyFormFactory";

// Utility to guard
function isDyFormNode(node: SkylynxRenderNode): boolean {
  return (
    node.template.templateType.TargetTypeName === ProtosTargetTypeEnum.DyForm
  );
}

export function ViewModelContentBuilderFactory(
  node: SkylynxRenderNode
): JSX.Element {
  if (!node || !node.viewModel) {
    return (
      <ModuleWrapper renderNode={node}>
        <div>⚠️ Missing view model</div>
      </ModuleWrapper>
    );
  }

  // Special case: DyForm (dynamic form renderer)
  if (isDyFormNode(node)) {
    return DyFormFactory(node);
  }

  // Future logic: resolve targetComponent and render dynamically
  if (node.targetComponent) {
    const Component = node.;
    return (
      <ModuleWrapper renderNode={node}>
        <Component />
      </ModuleWrapper>
    );
  }

  // Fallback
  return (
    <ModuleWrapper renderNode={node}>
      <div>📦 Unresolved ViewModel renderer</div>
    </ModuleWrapper>
  );
}
