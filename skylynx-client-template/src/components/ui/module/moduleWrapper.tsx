// ================================================
// ✅ Component: ModuleWrapper
// Description: Wrapper component used in metadata render tree for Modules
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: components/ui/module/moduleWrapper.tsx
// ================================================

import React, { FC } from "react";
import { ModuleWrapperProps } from "../types/uiWrappers";
import { ModuleShell } from "../../../theme/appStyles";

const ModuleWrapper: FC<ModuleWrapperProps> = ({
  renderNode,
  debugId,
  children,
}) => {
  return (
    <ModuleShell className={renderNode.viewModel.contextKey} data-debug-id={debugId}>
      {children}
    </ModuleShell>
  );
};

export default ModuleWrapper;
