// ================================================
// File: Application Theme
// Description: Defines the Material UI theme for the Skylynx client template.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: theme.ts
// Type: TypeScript theme configuration file
// ================================================

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#14532d"
    },
    secondary: {
      main: "#0f766e"
    },
    background: {
      default: "#f7f8f5",
      paper: "#ffffff"
    },
    text: {
      primary: "#1f2933",
      secondary: "#52606d"
    }
  },
  shape: {
    borderRadius: 8
  },
  typography: {
    fontFamily: "\"Inter\", \"Segoe UI\", Arial, sans-serif",
    h1: {
      fontSize: "2.25rem",
      fontWeight: 700,
      letterSpacing: 0
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 700,
      letterSpacing: 0
    },
    button: {
      textTransform: "none",
      fontWeight: 700,
      letterSpacing: 0
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none"
        }
      }
    }
  }
});
