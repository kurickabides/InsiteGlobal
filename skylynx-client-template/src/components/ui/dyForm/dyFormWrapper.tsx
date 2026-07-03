// ================================================
// ✅ Component: DyFormWrapper
// Description: Wrapper component for rendering DyForms in metadata tree
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: components/ui/dyform/dyFormWrapper.tsx
// ================================================

import React, { FC } from "react";
import { DyFormWrapperProps } from "../types/uiWrappers";
import { DyFormShell } from "../../../theme/appStyles";

const DyFormWrapper: FC<DyFormWrapperProps> = ({
  renderNode,
  debugId,
  children,
}) => {
  return (
    <DyFormShell
      className={renderNode.viewModel?.contextKey}
      data-debug-id={debugId}
      data-template-id={renderNode.template?.templateID}
    >
      {children}
    </DyFormShell>
  );
};

export default DyFormWrapper;
