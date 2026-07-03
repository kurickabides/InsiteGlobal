import { styled } from "@mui/material/styles";


export const FlexCenterFull = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
}));

// 🔒 Local styling only
export const CenteredProgressBar = styled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
}));
