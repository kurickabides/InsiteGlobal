import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import layoutMixins from "../../../theme/themeMixins";

export const DrawerToolbar = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  height: theme.mixins.toolbar.minHeight,
  background: `linear-gradient(270deg, ${theme.palette.primary.main} 0%, ${theme.palette.background.default} 70%)`,
}));

// ✅ Single drawer with dynamic styling based on "open"
export const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ theme, open }) => ({
  width: open
    ? layoutMixins.drawer.open.width
    : layoutMixins.drawer.closed.width,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  "& .MuiDrawer-paper": {
    width: open ? layoutMixins.drawer.open.width : layoutMixins.drawer.closed.width,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: open
        ? theme.transitions.duration.enteringScreen
        : theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
  },
}));
