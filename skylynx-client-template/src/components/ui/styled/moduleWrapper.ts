
// ================================================
// ✅ Styles: ModuleWrapper Modal Styles
// File: components/ui/styled/moduleWrapper.ts
// ================================================

import { styled } from "@mui/material/styles";
import layoutMixins from "../../../theme/themeMixins";


export const ModuleContentWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(3),
  justifyContent: "flex-start",
  padding: theme.spacing(2),
}));

export const ModuleContainer = styled("div")(({ theme }) => ({
  border: "1px solid #ccc",
  borderRadius: theme.spacing(1),
  overflow: "hidden",
  marginBottom: theme.spacing(2),
  boxShadow: theme.shadows[1],
  backgroundColor: theme.palette.background.paper,
}));

export const ModuleHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
}));

export const ModuleInnerContent = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
}));
