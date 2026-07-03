// ================================================

import { styled } from "@mui/material/styles";
import { Typography, Box } from "@mui/material";
import { FlexCenterFull } from "./loading"; // Reuse global centering style

export const SplashContainer = styled(FlexCenterFull)(({ theme }) => ({
  flexDirection: "column",
  backgroundColor: theme.palette.background.default,
  height: "100vh",
  width: "100vw",
}));

export const SplashLogo = styled("img")(({ theme }) => ({
  width: 300,
  marginBottom: theme.spacing(5),
}));

export const SplashMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

export const SplashLoaderWrapper = styled(Box)(({ theme }) => ({
  width: "80%",
  marginTop: theme.spacing(2),
}));
