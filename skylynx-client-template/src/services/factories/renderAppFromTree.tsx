// ================================================
// ✅ Component: RenderAppFromTree
// Description: Renders full App layout from hydrated PortalTemplate tree
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: RenderAppFromTree.tsx
// ================================================

import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Routes, Route } from "react-router-dom";
import LayoutWrapper from "../../components/ui/layouts/layoutWrapper";
import AuthLayout from "../../components/layouts/authLayout";
import AuthPage from "../../pages/authPage";
import PageWrapper from "../../components/ui/page/pageWrapper";
import { SkylynxRenderNode } from "../../components/core/types";
import { LayoutFactory } from "./layoutFactory";
import { createLightTheme, createDarkTheme } from "../../theme/appTheme";
import { ITheme } from "../../entities/portal";

export const RenderAppFromTree: React.FC<{
  tree: SkylynxRenderNode;
}> = ({ tree }) => {
  // ✅ 1. Find the Theme node
  const themeNode = tree.children?.find(
    (c) => c.template.templateType?.TargetTypeName === "Theme"
  );

  const themeData = themeNode?.targetComponent?.data as ITheme;
  const defaultMode =
    themeData?.DefaultMode?.toLowerCase() === "dark" ? "dark" : "light";

  const themeOptionNode = themeNode?.children?.find(
    (c) => c.template.templateType?.TargetTypeName === "ThemeColors"
  );

  const themeOption = themeData.ThemeOption
  
  const muiTheme =
    defaultMode === "dark"
      ? createDarkTheme(themeOption)
      : createLightTheme(themeOption as any);

  // ✅ 2. Find all Page nodes
  const pageNodes =
    tree.children?.filter(
      (c) => c.template.templateType?.TargetTypeName === "Page"
    ) ?? [];

  return (
    <ThemeProvider theme={muiTheme}>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthLayout>
              <AuthPage />
            </AuthLayout>
          }
        />

        {pageNodes.map((page) => {
          const layoutNode = page.children?.find(
            (c) => c.template.templateType?.TargetTypeName === "Layout"
          );

          return (
            <Route
              key={page.template.templateID}
              path={page.targetComponent?.data?.routePath ?? "/"}
              element={
                layoutNode ? (
                  <LayoutFactory node={layoutNode} />
                ) : (
                  <LayoutWrapper renderNode={page}>
                    <PageWrapper node={layoutNode} />
                  </LayoutWrapper>
                )
              }
            />
          );
        })}
      </Routes>
    </ThemeProvider>
  );
};
