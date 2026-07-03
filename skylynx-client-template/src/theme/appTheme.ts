import { createTheme, Theme } from "@mui/material/styles";
import fieldProColors from "./fieldProColors";
import cryoRIOColors from "./cryoRIOColors";
import defaultThemeColors from "./defaultThemeColors";
import { ColorTheme } from "./types";

const getThemeColors = (theme: ColorTheme, variant: "light" | "dark") => {
  switch (theme) {
    case "FeldPro":
      return fieldProColors.getColors(variant);
    case "CryoRIO":
      return cryoRIOColors.getColors(variant);
    case "Default":
    default:
      return defaultThemeColors.getColors(variant);
  }
};

const applyPalette = (colors: any) => ({
  primary: {
    main: colors.primary[500],
    light: colors.primary[200],
    dark: colors.primary[700],
  },
  secondary: {
    main: colors.secondary[500],
    light: colors.secondary[200],
    dark: colors.secondary[700],
  },
});

const createLightTheme = (theme: ColorTheme): Theme => {
  const colors = getThemeColors(theme, "light");
  return createTheme({
    palette: {
      mode: "light",
      ...applyPalette(colors),
    },
    typography: {
      fontFamily: "Leelawadee UI",
      fontSize: 18,
      fontWeightMedium: 500,
      body1: { fontWeight: 500 },
      body2: { fontWeight: 500 },
      button: { fontStyle: "italic" },
    },
  });
};

const createDarkTheme = (theme: ColorTheme): Theme => {
  const colors = getThemeColors(theme, "dark");
  return createTheme({
    palette: {
      mode: "dark",
      ...applyPalette(colors),
    },
    typography: {
      fontFamily: "Leelawadee UI",
      fontSize: 18,
      fontWeightMedium: 500,
      body1: { fontWeight: 500 },
      body2: { fontWeight: 500 },
      button: { fontStyle: "italic" },
    },
  });
};

export { createLightTheme, createDarkTheme };
