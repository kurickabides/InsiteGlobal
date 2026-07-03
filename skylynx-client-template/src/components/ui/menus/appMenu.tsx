// ================================================
// ✅ Component: Menu
// File: components/layout/menu.tsx
// Description: Renders the left nav menu including nested submenus
// ================================================

import React, { FC, ReactElement, useState, useEffect } from "react";
import clsx from "clsx";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Icon,
  Tooltip,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DefaultIcon from "@mui/icons-material/AccountBox";
import { useLocation } from "react-router-dom";
import { AppMenuProps } from "../types";
import MenuItem from "./menuItem";
import { routeConfig } from "../../../config/routeUserConfig";
import {
  SectionDivider,
  IndentedList,
  MenuSelected,
} from "../../../theme/appStyles";
import {RouteItem} from "../../../config/types";
import { useAppSelector } from "../../../hooks/reduxHooks";
import { RootState } from "../../../appStore/store";

const Menu: FC<AppMenuProps> = ({ open }): ReactElement => {
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});
  const location = useLocation();

  // ⬇️ Get the global drawer open state
  let menuOpen = false 
  useEffect(() => {
    if (!open) {
      setOpenStates({});
      menuOpen = false
    }
    else{
      menuOpen = true
    }
  }, [open]);
 
  // Pull auth state for route filtering
  const auth = useAppSelector((state) => state.auth);
  const state: Partial<RootState> = { auth };

  const routes = routeConfig.filter((route) =>
    typeof route.condition === "function"
      ? route.condition(state)
      : route.enabled !== false
  );

  const handleClick = (key: string): void => {
    setOpenStates((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <List>
      {routes.map((route: RouteItem) => (
        <React.Fragment key={`main-${route.key}`}>
          {route.subRoutes ? (
            <>
              <ListItem button onClick={() => handleClick(route.key)}>
                <ListItemIcon>
                  <MenuSelected
                    className={clsx({
                      selected:
                        !openStates[route.key] &&
                        route.subRoutes?.some(
                          (item) => item.path === location.pathname
                        ),
                    })}
                    size="small"
                  >
                    <Icon component={route.icon || DefaultIcon} />
                  </MenuSelected>
                </ListItemIcon>
                {open && <ListItemText primary={route.title} />}
                <Tooltip
                  title={openStates[route.key] ? "Collapse" : "Expand"}
                  placement="right"
                >
                  {openStates[route.key] ? <ExpandLess /> : <ExpandMore />}
                </Tooltip>
              </ListItem>
              <Collapse
                in={!!openStates[route.key]}
                timeout="auto"
                unmountOnExit
              >
                <IndentedList>
                  {route.subRoutes
                    .filter((sRoute) =>
                      typeof sRoute.condition === "function"
                        ? sRoute.condition(state)
                        : sRoute.enabled !== false
                    )
                    .map((sRoute: RouteItem) => (
                      <MenuItem open={open} {...sRoute} />
                    ))}
                </IndentedList>
              </Collapse>
            </>
          ) : (
            <MenuItem open={open} {...route} />
          )}
          {route.appendDivider && <SectionDivider />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default Menu;
