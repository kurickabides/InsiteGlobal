// ================================================
// ✅ Component: PortalWrapper
// Description: Portal-level wrapper to host full render tree
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: components/ui/portal/portalWrapper.tsx
// ================================================

import React, { FC } from "react";
import { PortalWrapperProps } from "../types/uiWrappers";
import { PortalShell } from "../../../theme/appStyles";

const PortalWrapper: FC<PortalWrapperProps> = ({
  renderNode,
  themeKey,
  children,
}) => {
  return (
    <PortalShell
    >
      {children}
    </PortalShell>
  );
};

export default PortalWrapper;
