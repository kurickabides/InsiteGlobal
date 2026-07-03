// ================================================
// ✅ Factory: ThemeFactory
// Description: Dynamically builds MUI theme using Portal metadata or default fallback
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: themeFactory.ts
// ================================================

import { Theme } from "@mui/material/styles";
import { createLightTheme, createDarkTheme } from "../../theme/appTheme";
import {
  SkylynxThemeEnum,
  SkylynxThemeMeta,
  IMixinStyle,
} from "../../entities/skyLynx";

/**
 * Applies mixins (if any) into the MUI theme instance.
 */
function applyMixins(
  theme: Theme,
  mixins?: Record<string, IMixinStyle>
): Theme {
  if (!mixins) return theme;

  theme.mixins = {
    ...theme.mixins,
    ...mixins,
  };

  return theme;
}

export function ThemeFactory(themeMeta: SkylynxThemeMeta): Theme {
  const themeKey =
    themeMeta.key in SkylynxThemeEnum ? themeMeta.key : "Default";
  const variant = themeMeta.mode ?? "light";

  let baseTheme: Theme;

  switch (variant) {
    case "dark":
      baseTheme = createDarkTheme(themeKey as SkylynxThemeEnum);
      break;
    case "light":
    default:
      baseTheme = createLightTheme(themeKey as SkylynxThemeEnum);
      break;
  }

  return applyMixins(baseTheme, themeMeta.mixins);
}

// Fallback example for direct use
export const DefaultTheme: Theme = createLightTheme("Default");
