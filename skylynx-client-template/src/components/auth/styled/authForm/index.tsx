// ================================================
// ✅ Styles: AuthForm Component Styles
// File: components/auth/styled/authForm.ts
// Description: Custom layout styles for auth card
// ================================================

import { styled } from "@mui/material/styles";
import { Card, CardContent } from "@mui/material";
import layoutMixins from "../../../../theme/themeMixins";

export const AuthCard = styled(Card)(({ theme }) => ({
  width: "95%",
  maxWidth: "25rem",
  margin: "3rem auto",
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[5],
}));

export const AuthCardContent = styled(CardContent)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const AuthLabel = styled("label")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  color: theme.palette.text.secondary,
  fontWeight: "bold",
  marginBottom: theme.spacing(1),
}));
