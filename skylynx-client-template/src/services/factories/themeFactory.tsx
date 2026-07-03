// ================================================
// ✅ Factory: ThemeFactory
// Description: Applies MUI theme from base Theme + ThemeColors metadata
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: ThemeFactory.tsx
// ================================================
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { TreeFactory } from "./treeFactory";
import { SkylynxRenderNode } from "../../components/core/types";
import { ITheme } from "../../entities/portal";

import { createLightTheme, createDarkTheme } from "../../theme/appTheme";

type ThemeFactoryProps = {
  node: SkylynxRenderNode<ITheme>;
};

export const ThemeFactory: React.FC<ThemeFactoryProps> = ({ node }) => {
  const theme = node.targetComponent?.data as ITheme;
  const mode = theme.DefaultMode?.toLowerCase() === "dark" ? "dark" : "light";

  const childTheme = node.children?.find(
    (c) => c.template.templateType?.TargetTypeName === "ThemeColors"
  );

  const themeOption = childTheme?.targetComponent?.ThemeOption ?? "Default";

  const muiTheme =
    mode === "dark"
      ? createDarkTheme(themeOption as any)
      : createLightTheme(themeOption as any);

  const childrenToRender = node.children?.filter(
    (c) => c.template.templateType?.TargetTypeName !== "ThemeColors"
  );

  return (
    <ThemeProvider theme={muiTheme}>
      {childrenToRender?.map((child) => (
        <TreeFactory key={child.template.templateID} node={child} />
      ))}
    </ThemeProvider>
  );
};
