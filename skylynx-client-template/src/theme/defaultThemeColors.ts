// ================================================
// Default Theme Colors (defaultThemeColors)
// ================================================

export default class defaultThemeColors {
  static Light = {
    primary: {
      50: "#E3F2FD",
      100: "#BBDEFB",
      200: "#90CAF9",
      300: "#64B5F6",
      400: "#42A5F5",
      500: "#2196F3",
      600: "#1E88E5",
      700: "#1976D2",
      800: "#1565C0",
      900: "#0D47A1",
    },
    secondary: {
      50: "#F9F99A",
      100: "#F9F98E",
      200: "#FFFF6B",
      300: "#F6F654",
      400: "#FFFF1A",
      500: "#EFEF12",
      600: "#DBDB14",
      700: "#CECE19",
      800: "#B8B813",
      900: "#A1A10D",
    },
    accent: {
      50: "#D0DAE9",
      100: "#D0DAE9",
      200: "#BEC9D9",
      300: "#A7AFBC",
      400: "#949DA9",
      500: "#8993A1",
      600: "#7F8691",
      700: "#79808A",
      800: "#6E747E",
      900: "#5E646D",
    },
  };

  static Dark = {
    primary: {
      50: "#E3F2FD",
      100: "#BBDEFB",
      200: "#90CAF9",
      300: "#64B5F6",
      400: "#42A5F5",
      500: "#2196F3",
      600: "#1E88E5",
      700: "#1976D2",
      800: "#1565C0",
      900: "#0D47A1",
    },
    secondary: {
      50: "#F9F99A",
      100: "#F9F98E",
      200: "#FFFF6B",
      300: "#F6F654",
      400: "#FFFF1A",
      500: "#EFEF12",
      600: "#DBDB14",
      700: "#CECE19",
      800: "#B8B813",
      900: "#A1A10D",
    },
    accent: {
      50: "#D0DAE9",
      100: "#D0DAE9",
      200: "#BEC9D9",
      300: "#A7AFBC",
      400: "#949DA9",
      500: "#8993A1",
      600: "#7F8691",
      700: "#79808A",
      800: "#6E747E",
      900: "#5E646D",
    },
  };

  static getColors(variant: "light" | "dark") {
    return variant === "light" ? this.Light : this.Dark;
  }
}
