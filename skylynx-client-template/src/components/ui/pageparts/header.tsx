import React, { FC, ReactElement, useEffect, useState } from "react";
import {
  CssBaseline,
  Typography,
  Tooltip,
  IconButton,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness3Icon from "@mui/icons-material/Brightness3";
import LogoutIcon from "@mui/icons-material/LockOutlined";
import LogoutIN from "@mui/icons-material/LockOpenOutlined";
import { useNavigate } from "react-router-dom";

import {
  HeaderAppBar,
  HeaderAppBarShift,
  FlexRowBetween,
  HeaderTitle,
  MenuButton,
} from "../../../theme/appStyles";
import { APP_TITLE } from "../../../helpers/constants";
import { useAppSelector } from "../../../hooks/reduxHooks";
import { selectAuth } from "../../auth/authSlice";
import { HeaderProps } from "../types";
import ModuleSettingsDialog from "../module/ModuleSettingsDialog";
import { UserProfileSettings } from "../types/uiWrappers";

const Header: FC<HeaderProps> = ({
  open,
  handleMenuOpen,
  handleSignUp,
  handleSignIn,
  handleDisconnect,
  toggleTheme,
  useDefaultTheme,
}): ReactElement => {
  const navigate = useNavigate();
  const authState = useAppSelector(selectAuth);
  const isLoggedIn = authState.isLoggedIn;

  //handle avatar click
  const handleAvatarClick = () => {
    console.log("🧑 Avatar clicked!");
    setShowDialog(true);
  };

  const ThemeToggleIcon = useDefaultTheme ? (
    <Brightness3Icon />
  ) : (
    <Brightness7Icon />
  );

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // State for module settings dialog
   const [showDialog, setShowDialog] = useState(false);

   // 🔧 Combine user data with settings
   const userProfileSettings: UserProfileSettings = {
   title: "User Profile",
    showTitle: true,
  ...authState.user.profile,
};

  useEffect(() => {
    if (isLoggedIn && authState.user.profile.photo) {
      let userImagePath = `/portals/${authState.user.profile.portalName}/users/${authState.user.profile.photo}/`;
      const fullPath = userImagePath;
      console.log(
        `📛 HeaderAuthState User.isLoggedIn:${isLoggedIn} User Object ${fullPath} `
      );
      // TEMP: hardcoded test path override
      userImagePath = `backgrounds/${authState.user.profile.photo} `;

      console.log("📸 Full Avatar Path:", fullPath);
      console.log("🧪 Test Avatar Path:", userImagePath);

      setAvatarUrl(userImagePath);
    } else {
      console.log(
        `📛 HeaderAuthState User.isLoggedIn:${isLoggedIn} User Object ${authState.user.id} `
      );
          console.log("👤 Full AuthState:", JSON.stringify(authState, null, 2));
      let userImagePath2 = "/backgrounds/chadxtrasm.png";
      setAvatarUrl(userImagePath2);
      console.log("📛 Avatar not set: no photo or not logged in");
      //setAvatarUrl(null);
    }
  }, [authState.user.profile]); // <- use full object instead

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
      <ModuleSettingsDialog<UserProfileSettings>
        open={showDialog}
        settings={userProfileSettings}
        onClose={() => setShowDialog(false)}
        onSave={(updated) => {
          console.log("🔄 Saved settings:", updated);
          setShowDialog(false);
        }}
      />
    </>
  );

  function ToolbarContent() {
    return (
      <FlexRowBetween>
        <HeaderTitle>
          <MenuButton
            color="inherit"
            aria-label="open menu"
            onClick={handleMenuOpen}
            edge="start"
            sx={{ display: open ? "none" : "inline-flex" }}
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
          <IconButton size="small" onClick={handleSignIn} color="inherit">
            <LogoutIN />
          </IconButton>
        )}

        {isLoggedIn && (
          <>
            <IconButton size="small" onClick={handleDisconnect} color="inherit">
              <LogoutIcon />
            </IconButton>
            <IconButton
              size="small"
              color="inherit"
              onClick={handleAvatarClick}
            >
              <Avatar
                src={avatarUrl || undefined}
                sx={{ width: 32, height: 32 }}
              >
                {authState.user.profile.firstName?.[0]}
                {authState.user.profile.lastName?.[0]}
              </Avatar>
            </IconButton>
          </>
        )}
      </FlexRowBetween>
    );
  }
};

export default Header;
