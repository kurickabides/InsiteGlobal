// ================================================
// ✅ Component: LayoutSideView
// File: components/layout/LayoutSideView.tsx
// Description: Alternate layout with background header and side nav
// ================================================

import React, { FC, useReducer } from "react";
import clsx from "clsx";
import { CssBaseline } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Components
import HeaderComponent from "../ui/pageparts/HeaderComponent";
import Navigation from "../ui/menus/navigation";
import Footer from "../ui/pageparts/footer";

// Redux
import { authActions } from "../auth/authSlice";
import { useAppDispatch } from "../../hooks/reduxHooks";

// Styles
import {
  Root,
  Content,
  ContentShift,
  ToolbarOffset,
} from "./styled/layoutSideView";

// Types
import { LayoutSideViewProps } from "../ui/types";

const LayoutSideView: FC<LayoutSideViewProps> = ({
  toggleTheme,
  useDefaultTheme,
  children,
}) => {
  const [open, toggle] = useReducer((state) => !state, true);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const logoutHandler = () => {
    dispatch(authActions.logout());
    navigate("/");
  };

  return (
    <Root>
      <CssBaseline />
      <Navigation open={open} handleMenuClose={toggle} />
      <HeaderComponent />
      {open ? (
        <ContentShift>
          <ToolbarOffset />
          {children}
        </ContentShift>
      ) : (
        <Content>
          <ToolbarOffset />
          {children}
        </Content>
      )}
      <footer>
        <Footer />
      </footer>
    </Root>
  );
};

export default LayoutSideView;
