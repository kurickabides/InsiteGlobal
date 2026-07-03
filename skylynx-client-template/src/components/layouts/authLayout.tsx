// ================================================
// ✅ Component: AuthLayout
// File: components/layout/AuthLayout.tsx
// Description: Lightweight layout for login/signup with consistent header
// ================================================

import React, { FC, PropsWithChildren } from "react";
import { Toolbar, Typography } from "@mui/material";
import {
  FlexRowBetween,
  HeaderAppBar,
  FullPageWrapper,
  AuthPageWrapper,
} from "../../theme/appStyles";
import { LayoutContent } from "./styled/layoutTopSide";

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <HeaderAppBar position="static" elevation={1}>
        <Toolbar>
          <FlexRowBetween>
            <Typography variant="h6" noWrap>
              Skylynx Network
            </Typography>
          </FlexRowBetween>
        </Toolbar>
      </HeaderAppBar>
      <LayoutContent>{children}</LayoutContent>
    </>
  );
};

export default AuthLayout;
