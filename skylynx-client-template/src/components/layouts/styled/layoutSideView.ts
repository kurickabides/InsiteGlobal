// ================================================
// ✅ Styled: LayoutSideView
// Description: Local styles for LayoutSideView layout
// ================================================

import { styled } from "@mui/material/styles";
import layoutMixins from "../../../theme/themeMixins";

export const Root = styled("div")(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
}));

export const Content = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  minHeight: `calc(100vh - ${layoutMixins.footer.height}px)`,
  background: theme.palette.background.paper,
  marginLeft: theme.spacing(7) + 1,
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(9) + 1,
  },
}));

export const ContentShift = styled(Content)(({ theme }) => ({
  marginLeft: layoutMixins.drawer.open.width,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
}));

export const ToolbarOffset = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));
