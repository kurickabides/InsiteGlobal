// ================================================
// File: Presentation Shell
// Description: Provides responsive page chrome and guided presentation navigation.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: PresentationShell.tsx
// Type: React TypeScript layout component file
// ================================================

import { ReactNode, useEffect, useMemo } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { setActiveNode } from "../../appStore/presentationSlice";
import { setDesktopDrawerOpen, setMobileDrawerOpen, toggleDesktopDrawer } from "../../appStore/uiSlice";
import { useAppDispatch, useAppSelector } from "../../appStore/hooks";
import { appConfig } from "../../config/appConfig";
import { presentationTree } from "../../config/presentationTree";
import {
  flattenPresentationTree,
  getAdjacentPresentationNodes,
  getFirstPresentationNode,
  getPresentationNodeByPath
} from "../../services/presentation/presentationTreeService";
import { PresentationControls } from "../presentation/PresentationControls";
import { PresentationProgress } from "../presentation/PresentationProgress";

const drawerWidth = 308;

interface PresentationShellProps {
  children: ReactNode;
}

export function PresentationShell({ children }: PresentationShellProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const location = useLocation();
  const dispatch = useAppDispatch();
  const mobileOpen = useAppSelector((state) => state.ui.mobileDrawerOpen);
  const desktopOpen = useAppSelector((state) => state.ui.desktopDrawerOpen);
  const activeNodeId = useAppSelector((state) => state.presentation.activeNodeId);
  const completedNodeIds = useAppSelector((state) => state.presentation.completedNodeIds);
  const nodes = useMemo(() => flattenPresentationTree(presentationTree), []);
  const activeNode = getPresentationNodeByPath(presentationTree, location.pathname) ?? getFirstPresentationNode(presentationTree);
  const { previousNode, nextNode, activeIndex, totalNodes } = getAdjacentPresentationNodes(
    presentationTree,
    activeNode?.id ?? activeNodeId
  );

  useEffect(() => {
    if (activeNode && activeNode.id !== activeNodeId) {
      dispatch(setActiveNode(activeNode.id));
    }
  }, [activeNode, activeNodeId, dispatch]);

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 3, py: 2.5 }}>
        <Typography sx={{ fontSize: "1.15rem" }} variant="h2">
          {appConfig.appName}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {appConfig.subtitle}
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1.5, py: 1 }}>
        {nodes.map((node, index) => {
          const selected = location.pathname === node.path;
          const completed = completedNodeIds.includes(node.id);

          return (
            <ListItemButton
              component={RouterLink}
              disabled={!appConfig.presentation.allowFreeNavigation}
              key={node.id}
              onClick={() => {
                dispatch(setMobileDrawerOpen(false));
                if (isDesktop) {
                  dispatch(setDesktopDrawerOpen(false));
                }
              }}
              selected={selected}
              sx={{ borderRadius: 1, mb: 0.5, minHeight: 42 }}
              to={node.path}
            >
              <ListItemText
                primary={`${index + 1}. ${node.title}`}
                primaryTypographyProps={{ fontSize: 14, fontWeight: selected ? 700 : 500 }}
                secondary={completed ? "Completed" : node.eyebrow}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      <AppBar
        color="inherit"
        elevation={0}
        position="fixed"
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          ml: { md: desktopOpen ? `${drawerWidth}px` : 0 },
          width: { md: desktopOpen ? `calc(100% - ${drawerWidth}px)` : "100%" },
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
          })
        }}
      >
        <Toolbar sx={{ gap: 2, justifyContent: "space-between" }}>
          <Stack alignItems="center" direction="row" spacing={1.5}>
            <IconButton
              aria-label={isDesktop ? "Toggle presentation outline" : "Open presentation outline"}
              color="inherit"
              edge="start"
              onClick={() => {
                if (isDesktop) {
                  dispatch(toggleDesktopDrawer());
                } else {
                  dispatch(setMobileDrawerOpen(true));
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography sx={{ fontSize: "1rem" }} variant="h2">
              {activeNode?.title ?? appConfig.appName}
            </Typography>
          </Stack>
          <PresentationProgress activeIndex={activeIndex} totalNodes={totalNodes} />
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { md: desktopOpen ? drawerWidth : 0 },
          flexShrink: { md: 0 },
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
          })
        }}
      >
        <Drawer
          ModalProps={{ keepMounted: true }}
          onClose={() => dispatch(setMobileDrawerOpen(false))}
          open={mobileOpen}
          sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { width: drawerWidth } }}
          variant="temporary"
        >
          {drawer}
        </Drawer>
        <Drawer
          open={desktopOpen}
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid",
              borderColor: "divider"
            }
          }}
          variant="persistent"
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          pt: 10,
          px: { xs: 2, sm: 3, lg: 5 },
          pb: 5
        }}
      >
        <Stack spacing={4}>
          {children}
          <Divider />
          <PresentationControls
            firstNode={getFirstPresentationNode(presentationTree)}
            nextNode={nextNode}
            previousNode={previousNode}
          />
        </Stack>
      </Box>
    </Box>
  );
}
