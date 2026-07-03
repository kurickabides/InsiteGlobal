// ================================================
// ✅ Styled: layoutTopSide
// Description: Styled layout components for LayoutTopSide
// ================================================

import { styled } from "@mui/material/styles";
import layoutMixins from "../../../theme/themeMixins";

export const LayoutRoot = styled("div")(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
}));

export const LayoutContent = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  minHeight: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
  background: theme.palette.background.paper,
  marginLeft: theme.spacing(7) + 1,
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(9) + 1,
  },
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

export const LayoutContentShift = styled(LayoutContent)(({ theme }) => ({
  marginLeft: layoutMixins.drawer.open.width,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
}));

export const ToolbarOffset = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
