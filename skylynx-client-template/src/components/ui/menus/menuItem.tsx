import React, { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon, ListItemIcon, Tooltip } from "@mui/material";
import DefaultIcon from "@mui/icons-material/AccountBox";
import { MenuItemProps } from "../types";
import {
  StyledListItem,
  StyledListItemButton,
  StyledListItemText,
  MenuSelected,
} from "../../../theme/appStyles";

const MenuItem: FC<MenuItemProps> = ({
  path,
  title,
  icon,
  tooltip,
  open,
  enabled = true,
}): React.ReactElement => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSelected = location.pathname === path;

  return (
    <Tooltip title={!open ? tooltip || title : ""} placement="right">
      <StyledListItem disablePadding>
        <StyledListItemButton
          selected={isSelected}
          onClick={() => navigate(path || "/")}
          disabled={!enabled}
        >
          <ListItemIcon>
            <MenuSelected className={isSelected ? "selected" : ""} size="small">
              <Icon component={icon || DefaultIcon} />
            </MenuSelected>
          </ListItemIcon>
          <StyledListItemText primary={open ? title : ""} />
        </StyledListItemButton>
      </StyledListItem>
    </Tooltip>
  );
};

export default MenuItem;
