// ================================================
// ✅ Styled: mapMapModule Styles
// Description: Styled components for Mergin Maps module
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: /modules/mapMapModule/styled.ts
// ================================================

import { styled } from "@mui/material/styles";

export const MapWrapper = styled("div")(({ theme }) => ({
  width: "100%",
  height: "100%",
  position: "relative",
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
}));

export const MapToolbar = styled("div")(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1),
  right: theme.spacing(1),
  zIndex: 10,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  padding: theme.spacing(1),
  display: "flex",
  gap: theme.spacing(1),
}));

export const MapStatus = styled("div")(({ theme }) => ({
  position: "absolute",
  bottom: theme.spacing(1),
  left: theme.spacing(1),
  zIndex: 10,
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.common.white,
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  fontSize: 12,
  opacity: 0.8,
}));
