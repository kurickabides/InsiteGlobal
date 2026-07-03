// ================================================
// ✅ Registry: RouteRegistry
// Description: Central registry for dynamic route → component mappings
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: routeRegistry.tsx
// ================================================

import React from "react";
import { Route, RouteObject } from "react-router-dom";

type RegisteredRoute = {
  path: string;
  element: JSX.Element;
};

const routeMap: Map<string, JSX.Element> = new Map();

export const RouteRegistry = {
  register: (path: string, element: JSX.Element) => {
    if (!path || !element) return;
    routeMap.set(path, element);
  },

  getRoutes: (): JSX.Element[] => {
    return Array.from(routeMap.entries()).map(([path, element]) => (
      <Route key={path} path={path} element={element} />
    ));
  },

  clear: () => {
    routeMap.clear();
  },

  keys: (): string[] => {
    return Array.from(routeMap.keys());
  },
};
