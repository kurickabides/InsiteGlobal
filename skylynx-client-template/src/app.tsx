// ================================================
// ✅ Component: App
// Description: Main App Entry with Portal Bootstrap Wrapper
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: App.tsx
// ================================================

import React, { FC, ReactElement, useReducer, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "./hooks/reduxHooks";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
  Theme,
} from "@mui/material/styles";
import { Helmet } from "react-helmet";
import { selectUI } from "./components/ui/uiSlice";
import { authActions, selectAuth } from "./components/auth/authSlice";
import Toast from "./components/ui/dialogs/toast";
import ShellLayout from "./components/ui/layouts/shellLayout";
import { Loadroutes } from "./config/loadroutes";
import { createDarkTheme, createLightTheme } from "./theme/appTheme";
import { Web3ReactProvider } from "@web3-react/core";
import { RouteItem } from "./config/types";
import { ToastItem } from "./components/ui/types";
import { APP_TITLE } from "./helpers/constants";
import { ethers } from "ethers";
import AuthPage from "./pages/authPage";
import AuthLayout from "./components/layouts/authLayout";
import AppBootstrap from "./appBootstrap"; // ✅ Wrap app entry
import { RouteRegistry } from "./config/routeRegistry";
const AppContext = React.createContext(null);

function getLibrary(provider: any): ethers.providers.Web3Provider {
  const library = new ethers.providers.Web3Provider(provider);
  library.detectNetwork();
  library.pollingInterval = 12000;
  return library;
}

const DefaultComponent: FC = (): ReactElement => (
  <div>{`No Component Defined.`}</div>
);

function App() {
  const [useDefaultTheme, toggle] = useReducer((theme) => !theme, true);
  const uiState = useAppSelector(selectUI);
  const authState = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const logoutTimer = useRef<NodeJS.Timeout | null>(null);

  const theme: Theme = responsiveFontSizes(
    useDefaultTheme ? createLightTheme("Default") : createDarkTheme("Default")
  );

  const routes: RouteItem[] = Loadroutes();

  const createTimer = (remainingTime: number) => {
    logoutTimer.current = setTimeout(
      () => dispatch(authActions.logout()),
      remainingTime
    );
  };

  useEffect(() => {
    if (authState.isLoggedIn) {
      createTimer(authState.remainingTime);
    }
    if (!authState.isLoggedIn && logoutTimer.current !== null) {
      clearTimeout(logoutTimer.current);
    }
  }, [uiState, authState, dispatch]);

  const toastMessageState: ToastItem = {
    status: uiState.notification.status,
    message: uiState.notification.message,
  };

  return (
    <AppContext.Provider value={null}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <AppBootstrap>
          <BrowserRouter>
            <Helmet>
              <title>{APP_TITLE}</title>
            </Helmet>
            <ThemeProvider theme={theme}>
              {uiState.notification?.status !== "idle" && (
                <Toast toastMessage={toastMessageState} />
              )}

              <Routes>
                <Route
                  path="/auth"
                  element={
                    <AuthLayout>
                      <AuthPage />
                    </AuthLayout>
                  }
                />

                <Route
                  path="*"
                  element={
                    <ShellLayout
                      toggleTheme={toggle}
                      useDefaultTheme={useDefaultTheme}
                    >
                      <Routes>
                        {routes.map((route: RouteItem) =>
                          route.subRoutes ? (
                            route.subRoutes.map((item: RouteItem) =>
                              item.path ? (
                                <Route
                                  key={item.key as string}
                                  path={item.path}
                                  element={
                                    item.component ? (
                                      <item.component />
                                    ) : (
                                      <DefaultComponent />
                                    )
                                  }
                                />
                              ) : null
                            )
                          ) : route.path ? (
                            <Route
                              key={route.key as string}
                              path={route.path}
                              element={
                                route.component ? (
                                  <route.component />
                                ) : (
                                  <DefaultComponent />
                                )
                              }
                            />
                          ) : null
                        )}
                      </Routes>
                      <Routes>{RouteRegistry.getRoutes()}</Routes>
                    </ShellLayout>
                  }
                />
              </Routes>
            </ThemeProvider>
          </BrowserRouter>
        </AppBootstrap>
      </Web3ReactProvider>
    </AppContext.Provider>
  );
}

export default App;
