// ================================================
// ✅ Component: LoadingIndicatorBar
// File: components/layout/LoadingIndicatorBar.tsx
// Description: Linear loading bar with centered layout
// ================================================

import React from "react";
import { styled } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";
import { CenteredProgressBar } from "../styled/loading";

// 🔒 Local styling only


const LoadingProgessBar = () => (
  <CenteredProgressBar>
    <LinearProgress color="secondary" style={{ width: "100%" }} />
  </CenteredProgressBar>
);

export default LoadingProgessBar;
