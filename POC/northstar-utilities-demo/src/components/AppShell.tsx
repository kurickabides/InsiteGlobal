// ================================================
// File: App Shell
// Description: Provides the responsive navigation drawer and page chrome.
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
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
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

  const activeTitle = useMemo(() => {
    return demoRoutes.find((route) => route.path === location.pathname)?.title ?? "NorthStar Utilities";
  }, [location.pathname]);

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 3, py: 2.5 }}>
        <Typography variant="h2" sx={{ fontSize: "1.15rem" }}>
          NorthStar Utilities
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Labor Intelligence Demo
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1.5, py: 1 }}>
        {demoRoutes.map((route, index) => {
          const selected = location.pathname === route.path;

          return (
            <ListItemButton
              key={route.path}
              component={RouterLink}
              to={route.path}
              selected={selected}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                minHeight: 42
              }}
            >
              <ListItemText
                primary={`${index + 1}. ${route.title}`}
                primaryTypographyProps={{ fontSize: 14, fontWeight: selected ? 700 : 500 }}
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
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          ml: { md: `${drawerWidth}px` },
          width: { md: `calc(100% - ${drawerWidth}px)` }
        }}
      >
        <Toolbar>
          {!isDesktop && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h2" sx={{ fontSize: "1rem" }}>
            {activeTitle}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid",
              borderColor: "divider"
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          pt: 9,
          px: { xs: 2, sm: 3, lg: 5 },
          pb: 5
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
