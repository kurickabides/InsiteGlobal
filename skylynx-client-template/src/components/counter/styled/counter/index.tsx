// ================================================
// ✅ Styles: Counter Component Styles
// File: components/counter/styles.ts
// Description: Styled layout helpers for Counter component
// ================================================

import { styled } from "@mui/material/styles";
import { NumberButton } from "../../../../theme/appStyles";
export const Row = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

export const CounterValue = styled("span")(({ theme }) => ({
  marginTop: theme.spacing(3),
  fontSize: "78px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

export const AsyncButton = styled(NumberButton)(({ theme }) => ({
  position: "relative",
  "&:after": {
    content: "''",
    backgroundColor: theme.palette.primary.light,
    display: "block",
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
    opacity: 0,
    transition: "width 1s linear, opacity 0.5s ease 1s",
  },
  "&:active:after": {
    width: "0%",
    opacity: 1,
    transition: "0s",
  },
}));