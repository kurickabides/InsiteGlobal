// ================================================
// ✅ Component: LayoutTopSide (Rabet Only)
// File: components/layout/LayoutTopSide.tsx
// ================================================

import React, { FC, useReducer, useState, useEffect } from "react";
import { CssBaseline } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";

// Components
import Header from "../ui/pageparts/header";
import Navigation from "../ui/menus/navigation";
import Footer from "../ui/pageparts/footer";

// Redux
import { useAppDispatch } from "../../hooks/reduxHooks";
import { authActions } from "../auth/authSlice";
//import { xmlActions } from "../stellar/xlmSlice";
//import { LoadAccountAsync } from "../stellar/stellarAPI";

// Models
//import { Rabit_ConnectResult } from "../stellar/xlmModels";

// Styles
import {
  LayoutRoot,
  LayoutContent,
  LayoutContentShift,
  ToolbarOffset,
} from "./styled/layoutTopSide";

// Types
import { LayoutProps } from "../ui/types";

declare global {
  interface Window {
    rabet: any;
  }
}

const LayoutTopSide: FC<LayoutProps> = ({
  toggleTheme,
  useDefaultTheme,
  children,
}) => {
  const [open, toggle] = useReducer((open) => !open, true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [rabetConnector, setRabetConnector] = useState<any>();

  const connectRabetHandler = async () => {
    try {
      if (!rabetConnector) setRabetConnector(window.rabet);
      if (window.rabet) {
        const result: Rabit_ConnectResult = await window.rabet.connect();
        if (!result.error) {
          dispatch(xmlActions.connectRabetAccount(result));
          dispatch(
            LoadAccountAsync({
              secret: result.publicKey,
              network_phrase: "TESTNET",
            })
          );
        } else {
          alert(result.error);
        }
      }
    } catch (ex) {
      console.error("Rabet connection failed:", ex);
    }
  };

  const logoutHandler = () => {
    dispatch(authActions.logout());
    dispatch(xmlActions.logout());
    navigate("/");
  };

  return (
    <LayoutRoot>
      <CssBaseline />
      <Header
        open={open}
        handleMenuOpen={toggle}
        handleSignUp={connectRabetHandler}
        handleSignIn={connectRabetHandler}
        handleDisconnect={logoutHandler}
        toggleTheme={toggleTheme}
        useDefaultTheme={useDefaultTheme}
      />
      <Navigation open={open} handleMenuClose={toggle} />
      {open ? (
        <LayoutContentShift>
          <ToolbarOffset />
          {children}
        </LayoutContentShift>
      ) : (
        <LayoutContent>
          <ToolbarOffset />
          {children}
        </LayoutContent>
      )}
      <footer>
        <Footer />
      </footer>
    </LayoutRoot>
  );
};

export default LayoutTopSide;
