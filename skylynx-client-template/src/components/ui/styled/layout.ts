// ================================================
// ✅ Styles: Layout
// File: styled/layout.ts
// ================================================

import { styled } from "@mui/material/styles";
import { List } from "@mui/material";
import layoutMixins from "../../../theme/themeMixins";

// Root container for the layout
export const LayoutRoot = styled("div")(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
}));

// Main content area with default left margin
export const LayoutContent = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  minHeight: `calc(100vh - ${layoutMixins.footer.height}px)`,
  background: theme.palette.background.paper,
  marginLeft: layoutMixins.drawer.closed.width ,
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(9) + 1,
  },
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

// Main content when drawer is open
export const LayoutContentShift = styled(LayoutContent)(({ theme }) => ({
  marginLeft: layoutMixins.drawer.open.width,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
}));

// Offset to match toolbar height
export const LayoutToolbarOffset = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

// Optional footer container
export const FooterContainer = styled("footer")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  background: theme.palette.background.default,
  padding: theme.spacing(2),
}));
