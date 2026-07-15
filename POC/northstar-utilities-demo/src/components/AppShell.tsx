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
  const isOperationsConsole = location.pathname === "/operations-console";
  const activeTitle = useMemo(() => {
    if (isOperationsConsole) {
      return "NorthStar Operations Console";
    }

    return demoRoutes[activeIndex]?.title ?? appConfig.appName;
  }, [activeIndex, isOperationsConsole]);
  const progress = activeIndex >= 0 ? ((activeIndex + 1) / demoRoutes.length) * 100 : isOperationsConsole ? 100 : 0;

  const drawer: ReactNode = (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 24px" }}>
        <Typography sx={{ fontSize: "1.15rem" }} variant="h2">
          {appConfig.appName}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {appConfig.subtitle}
        </Typography>
      </div>
      <Divider />
      <List sx={{ px: 1.5, py: 1 }}>
        <ListItemButton
          component={RouterLink}
          onClick={() => {
            setMobileOpen(false);
            if (isDesktop) {
              setDesktopOpen(false);
            }
          }}
          selected={isOperationsConsole}
          sx={{ borderRadius: 1, mb: 0.5, minHeight: 42 }}
          to="/operations-console"
        >
          <ListItemText
            primary="NorthStar Operations Console"
            primaryTypographyProps={{ fontSize: 14, fontWeight: isOperationsConsole ? 700 : 500 }}
            secondary="Interactive demo"
          />
        </ListItemButton>
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
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
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
          <div style={{ minWidth: 180 }}>
            <Typography color="text.secondary" variant="body2">{isOperationsConsole ? "Console" : `${activeIndex + 1} / ${demoRoutes.length}`}</Typography>
            <LinearProgress variant="determinate" value={progress} />
          </div>
        </Toolbar>
      </AppBar>

      <nav style={{ flexShrink: 0, transition: theme.transitions.create("width"), width: isDesktop && desktopOpen ? drawerWidth : 0 }}>
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
      </nav>

      <main style={{ flexGrow: 1, minWidth: 0, padding: isDesktop ? "80px 40px 40px" : "80px 16px 40px" }}>
        {children}
      </main>
    </div>
  );
}
