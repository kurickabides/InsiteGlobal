import React, { FC, ReactElement } from "react";
import { IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import AppMenu from "./appMenu";
import { NavigationProps } from "../types";
import { DrawerToolbar, StyledDrawer } from "../styled/navigation";

const Navigation: FC<NavigationProps> = ({
  open,
  handleMenuClose,
}): ReactElement => {
  return (
    <StyledDrawer variant="permanent" open={open}>
      <DrawerToolbar>
        <IconButton onClick={handleMenuClose}>
          <ChevronLeftIcon htmlColor="#fff" />
        </IconButton>
      </DrawerToolbar>
      <AppMenu open={open} />
    </StyledDrawer>
  );
};

export default Navigation;
