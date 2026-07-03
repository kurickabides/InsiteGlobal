import { styled } from "@mui/material/styles";

export const ToastSection = styled("section")(({ theme }) => ({
  margin: "3rem auto",
  width: "100%",
  maxWidth: "25rem",
  borderRadius: "6px",
  backgroundColor: theme.palette.secondary.main,
  boxShadow: `
    0 0 3px ${theme.palette.primary.main},
    0 0 9px ${theme.palette.primary.main},
    0 0 11px ${theme.palette.primary.main},
    0 0 30px ${theme.palette.primary.main}
  `,
  padding: "1rem",
  textAlign: "left",
}));

export const ToastErrorText = styled("h2")(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: "bold",
  marginBottom: "0.5rem",
}));

export const ToastSuccessText = styled("h2")(() => ({
  marginTop: "1.5rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));
