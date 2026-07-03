// ================================================
// ✅ Component: LayoutWrapper
// Description: Layout-level wrapper to contain dynamic Pages/Modules
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: components/ui/layout/layoutWrapper.tsx
// ================================================

import React, { FC } from "react";
import { LayoutWrapperProps } from "../types/uiWrappers";
import { LayoutShell } from "../../../theme/appStyles";

const LayoutWrapper: FC<LayoutWrapperProps> = ({
  renderNode,
  themeKey,
  children,
}) => {
  // You can destructure renderNode here if needed:
  // const { template, viewModel, dataModel } = renderNode;

  return (
    <LayoutShell data-theme={themeKey || renderNode.template.templateName}>
      {children}
    </LayoutShell>
  );
};

export default LayoutWrapper;
