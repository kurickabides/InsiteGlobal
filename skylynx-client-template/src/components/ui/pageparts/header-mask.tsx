// ================================================
// ✅ Component: HeaderMask
// File: components/layout/HeaderMask.tsx
// Description: Application top bar with theme toggle, login/logout, and drawer control
// ================================================

import React, { FC, ReactElement } from "react";
import clsx from "clsx";
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
import LogoutIcon from "@mui/icons-material/ExitToAppOutlined";

import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../hooks/reduxHooks";
//import { selectStellar } from "../stellar/xlmSlice";
import { selectAuth } from "../../auth/authSlice";

import {
  HeaderAppBar,
  HeaderAppBarShift,
  FlexRowBetween,
  HeaderTitle,
  IconWrapper,
  IconImageFull,
} from "../../../theme/appStyles";
import { APP_TITLE } from "../../../helpers/constants";

// props
interface Props {
  open: boolean;
  handleMenuOpen: () => void;
  handleMetaMaskConnect: () => void;
  handleDisconnect: () => void;
  toggleTheme: () => void;
  useDefaultTheme: boolean;
}

const HeaderMask: FC<Props> = ({
  open,
  handleMenuOpen,
  handleMetaMaskConnect,
  handleDisconnect,
  toggleTheme,
  useDefaultTheme,
}): ReactElement => {
  const navigate = useNavigate();
  const authState = useAppSelector(selectAuth);
 // const xmlState = useAppSelector(selectStellar);
  const dispatch = useAppDispatch();
  const isLoggedIn = authState.isLoggedIn;
 // const isVaildAccount = xmlState.isVaildAccount;

  return (
    <>
      <CssBaseline />
      {open ? (
        <HeaderAppBarShift position="fixed" elevation={0}>
          <ToolbarContent />
        </HeaderAppBarShift>
      ) : (
        <HeaderAppBar position="fixed" elevation={0}>
          <ToolbarContent />
        </HeaderAppBar>
      )}
    </>
  );

  function ToolbarContent() {
    return (
      <FlexRowBetween>
        <HeaderTitle>
          <IconButton
            color="inherit"
            aria-label="open menu"
            onClick={handleMenuOpen}
            edge="start"
            sx={{ marginRight: "36px", display: open ? "none" : "inline-flex" }}
            size="small"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {APP_TITLE}
          </Typography>
        </HeaderTitle>
        <IconButton onClick={toggleTheme}>
          {useDefaultTheme ? (
            <Tooltip title="Switch to dark mode" placement="bottom">
              <Brightness3Icon />
            </Tooltip>
          ) : (
            <Tooltip title="Switch to light mode" placement="bottom">
              <Brightness7Icon />
            </Tooltip>
          )}
        </IconButton>
        <IconButton size="small" color="inherit">
          <UserIcon />
        </IconButton>
        {!isLoggedIn && (
          <IconButton
            size="small"
            onClick={handleMetaMaskConnect}
            color="inherit"
          >
            <IconWrapper>
              <Icon>
                <IconImageFull
                  src="/logos/metamask-logo-vector.svg"
                  alt="MetaMask"
                />
              </Icon>
            </IconWrapper>
          </IconButton>
        )}
        //relace true with isVaildAccount once you fix xlmModels
        {(true || isLoggedIn) && (
          <IconButton size="small" onClick={handleDisconnect} color="inherit">
            <LogoutIcon />
          </IconButton>
        )}
      </FlexRowBetween>
    );
  }
};

export default HeaderMask;
