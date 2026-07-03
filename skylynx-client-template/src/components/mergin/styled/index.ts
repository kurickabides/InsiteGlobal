// ================================================
// ✅ Styled: Mergin MapViewer Styles
// Description: Style elements for iframe-based Mergin Map view
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: components/mergin/styled/index.ts
// ================================================

import { styled } from "@mui/material/styles";
import { Typography, Box } from "@mui/material";

export const ContainerMapViewer = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
}));

export const TitleMapViewer = styled(Typography)(() => ({
  fontWeight: 600,
  paddingLeft: "0.25rem",
}));

export const IframeMapViewer = styled("iframe")<{
  height: number;
}>(({ height }) => ({
  width: "100%",
  height: `${height}px`,
  border: "none",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
}));
