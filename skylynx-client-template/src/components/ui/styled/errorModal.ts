// ================================================
// ✅ Styles: Error Modal Styles
// File: components/ui/styled/errorModal.ts
// ================================================
import { styled } from "@mui/material/styles";
import layoutMixins from "../../../theme/themeMixins";


export const Backdrop = styled("div")(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: theme.palette.grey[900],
  opacity: 0.5,
  zIndex: 999,
}));

export const ErrorPopup = styled("div")(({ theme }) => ({
  position: "fixed",
  top: layoutMixins.errorWindow.top,
  left: `calc(50% - ${layoutMixins.errorWindow.left})`,
  width: layoutMixins.errorWindow.width,
  background: theme.palette.info.light,
  padding: theme.spacing(3),
  zIndex: 1000,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
}));

export const ErrorActions = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: "flex",
  justifyContent: "flex-end",
}));
