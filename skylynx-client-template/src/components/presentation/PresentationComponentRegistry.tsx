// ================================================
// Component: Presentation Component Registry
// Description: Maps presentation node component keys to reusable demo surfaces.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: components/presentation/PresentationComponentRegistry.tsx
// Type: React TypeScript component registry file
// ================================================

import { Typography } from "@mui/material";
import ESRIMapModuleContainer from "@/modules/esriMapModule/esriMapModuleContainer";
import { PresentationNode } from "@/types/presentation";

interface PresentationComponentProps {
  node: PresentationNode;
}

function DefaultPresentationSurface({ node }: PresentationComponentProps) {
  return (
    <Typography color="text.secondary">
      Placeholder workspace for {node.title.toLowerCase()} content.
    </Typography>
  );
}

function EsriMapPresentationSurface() {
  return <ESRIMapModuleContainer />;
}

export const presentationComponentRegistry = {
  default: DefaultPresentationSurface,
  esriMap: EsriMapPresentationSurface
};

export type PresentationComponentKey = keyof typeof presentationComponentRegistry;

export function getPresentationComponent(componentKey?: string) {
  if (componentKey && componentKey in presentationComponentRegistry) {
    return presentationComponentRegistry[componentKey as PresentationComponentKey];
  }

  return presentationComponentRegistry.default;
}
