// ================================================
// ✅ Component: HeaderMinimal
// File: components/layout/HeaderMinimal.tsx
// Description: Compact AppBar for lightweight layouts (e.g., wallet only)
// ================================================

import React, { FC, ReactElement } from "react";
import {
  CssBaseline,
  Typography,
  Tooltip,
  IconButton,
  Icon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness3Icon from "@mui/icons-material/Brightness3";
import UserIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/LockOutlined";
import LogoutIN from "@mui/icons-material/LockOpenOutlined";

import { APP_TITLE } from "../../../helpers/constants";
import { useAppSelector } from "../../../hooks/reduxHooks";
import { selectAuth } from "../../auth/authSlice";
//import { selectStellar } from "../stellar/xlmSlice";
import { HeaderMinimalProps } from "../types";
import {
  HeaderAppBar,
  HeaderAppBarShift,
  FlexRowBetween,
  HeaderTitle,
  MenuButton,
  IconWrapper,
  IconImageFull,
} from "../../../theme/appStyles";



const HeaderMinimal: FC<HeaderMinimalProps> = ({
  open,
  handleMenuOpen,
  handleMetaMaskConnect,
  handleDisconnect,
  toggleTheme,
  useDefaultTheme,
}): ReactElement => {
  const authState = useAppSelector(selectAuth);
  const xlmState = useAppSelector(selectStellar);
  const isLoggedIn = authState.isLoggedIn;
  const isVaildAccount = xlmState.isVaildAccount;

  const ThemeToggleIcon = useDefaultTheme ? (
    <Brightness3Icon />
  ) : (
    <Brightness7Icon />
  );

  return (
    <>
      <CssBaseline />
      {open ? (
        <HeaderAppBarShift position="fixed" elevation={0}>
          <ToolbarMinimal />
        </HeaderAppBarShift>
      ) : (
        <HeaderAppBar position="fixed" elevation={0}>
          <ToolbarMinimal />
        </HeaderAppBar>
      )}
    </>
  );

  function ToolbarMinimal() {
    return (
      <FlexRowBetween>
        <HeaderTitle>
          <MenuButton
            color="inherit"
            aria-label="open menu"
            onClick={handleMenuOpen}
            edge="start"
            sx={{ marginRight: "36px", display: open ? "none" : "inline-flex" }}
          >
            <MenuIcon />
          </MenuButton>
          <Typography variant="h6" noWrap>
            {APP_TITLE}
          </Typography>
        </HeaderTitle>

        <IconButton onClick={toggleTheme} color="inherit">
          <Tooltip
            title={
              useDefaultTheme ? "Switch to dark mode" : "Switch to light mode"
            }
            placement="bottom"
          >
            {ThemeToggleIcon}
          </Tooltip>
        </IconButton>

        {!isLoggedIn && (
          <IconButton
            size="small"
            onClick={handleMetaMaskConnect}
            color="inherit"
          >
            <IconWrapper>
              <IconImageFull src="/logos/metamask-logo-vector.svg" />
            </IconWrapper>
          </IconButton>
        )}

        {(isVaildAccount || isLoggedIn) && (
          <IconButton size="small" onClick={handleDisconnect} color="inherit">
            <LogoutIcon />
          </IconButton>
        )}

        {isLoggedIn && (
          <IconButton size="small" color="inherit">
            <UserIcon />
          </IconButton>
        )}
      </FlexRowBetween>
    );
  }
};

export default HeaderMinimal;
