// ================================================
// File: App Shell
// Description: Provides collapsible presentation chrome, navigation outline, and page progress.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: AppShell.tsx
// Type: React TypeScript layout component file
// ================================================

import { ReactNode, useMemo, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  LinearProgress,
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
import { appConfig } from "../config/appConfig";
import { demoRoutes } from "../data/demoRoutes";

const drawerWidth = 292;

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(false);

  const activeIndex = demoRoutes.findIndex((route) => route.path === location.pathname);
  const activeTitle = useMemo(() => {
    return demoRoutes[activeIndex]?.title ?? appConfig.appName;
  }, [activeIndex]);
  const progress = activeIndex >= 0 ? ((activeIndex + 1) / demoRoutes.length) * 100 : 0;

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
        {demoRoutes.map((route, index) => {
          const selected = location.pathname === route.path;

          return (
            <ListItemButton
              component={RouterLink}
              key={route.path}
              onClick={() => {
                setMobileOpen(false);
                if (isDesktop) {
                  setDesktopOpen(false);
                }
              }}
              selected={selected}
              sx={{ borderRadius: 1, mb: 0.5, minHeight: 42 }}
              to={route.path}
            >
              <ListItemText
                primary={`${index + 1}. ${route.title}`}
                primaryTypographyProps={{ fontSize: 14, fontWeight: selected ? 700 : 500 }}
                secondary={route.eyebrow}
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
          transition: theme.transitions.create(["margin", "width"])
        }}
      >
        <Toolbar sx={{ gap: 2, justifyContent: "space-between" }}>
          <Stack alignItems="center" direction="row" spacing={1.5}>
            <IconButton
              aria-label={isDesktop ? "Toggle presentation outline" : "Open navigation"}
              color="inherit"
              edge="start"
              onClick={() => (isDesktop ? setDesktopOpen((open) => !open) : setMobileOpen(true))}
            >
              <MenuIcon />
            </IconButton>
            <Typography sx={{ fontSize: "1rem" }} variant="h2">
              {activeTitle}
            </Typography>
          </Stack>
          <Box sx={{ minWidth: 180, display: { xs: "none", sm: "block" } }}>
            <Typography color="text.secondary" variant="body2">{activeIndex + 1} / {demoRoutes.length}</Typography>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: desktopOpen ? drawerWidth : 0 }, flexShrink: { md: 0 }, transition: theme.transitions.create("width") }}>
        <Drawer
          ModalProps={{ keepMounted: true }}
          onClose={() => setMobileOpen(false)}
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

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, pt: 10, px: { xs: 2, sm: 3, lg: 5 }, pb: 5 }}>
        {children}
      </Box>
    </Box>
  );
}
