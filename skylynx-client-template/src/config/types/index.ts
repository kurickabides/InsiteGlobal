import { ComponentType, FC } from "react";
import { RootState } from "../../appStore/store"; // import your state type

export interface RouteItem {
  key: string;
  title: string;
  tooltip?: string;
  path?: string;
  component?: FC<{}>;
  enabled?: boolean;
  icon?: ComponentType;
  subRoutes?: RouteItem[];
  appendDivider?: boolean;
  walletNeeded?: boolean;
  // 🔥 Dynamic condition (optional)
  condition?: (state: Partial<RootState>) => boolean;
}


