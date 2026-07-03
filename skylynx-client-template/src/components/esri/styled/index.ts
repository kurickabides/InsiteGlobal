// ================================================
// ✅ Component: EsriMapViewer Styles
// Description: Styled wrapper for Esri map container
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: components/esriMapViewer/styled.ts
// ================================================

import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

export const ContainerEsriMapViewer = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
}));

export const TitleEsriMapViewer = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  fontWeight: 600,
}));

export const MapDivEsriMapViewer = styled("div")<{
  height: number;
}>(({ height }) => ({
  width: "100%",
  height: `${height}px`,
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
}));