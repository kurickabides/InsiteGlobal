//Types for ui components
import { ReactNode } from "react";
import { RouteItem } from "../../../config/types";

export interface HeaderProps {
  open: boolean;
  handleMenuOpen: () => void;
  handleSignUp: () => void;
  handleSignIn: () => void;
  handleDisconnect: () => void;
  toggleTheme: () => void;
  useDefaultTheme: boolean;
}

export interface HeaderComponentProps {
  width?: string;
  height?: string;
  top?: number;
}

export interface LayoutProps {
  toggleTheme: () => void;
  useDefaultTheme: boolean;
  children: ReactNode;
}

export interface LayoutSideViewProps {
  toggleTheme: () => void;
  useDefaultTheme: boolean;
  children: ReactNode;
}
export interface LayoutProps {
  toggleTheme: () => void;
  useDefaultTheme: boolean;
  children: ReactNode;
}

export interface NavigationProps {
  open: boolean;
  handleMenuClose: () => void;
}

export interface HeaderMinimalProps {
  open: boolean;
  handleMenuOpen: () => void;
  handleMetaMaskConnect: () => void;
  handleDisconnect: () => void;
  toggleTheme: () => void;
  useDefaultTheme: boolean;
}
export type ToastStatus = "success" | "loading" | "idle" | "info" |"warning" |"error";
export interface ToastItem {
  status: ToastStatus;
  message: string;
}

export interface UIState {
  isLoading: boolean;
  notification: ToastItem;
}
export interface TimerState {
  isLoading: boolean;
  notification: ToastItem;
}

export interface AppMenuProps {
  open: boolean;
}
export interface MenuItemProps extends RouteItem {
  open: boolean; // passed from parent Menu to hide/show text
}
//for fun remove if never use
export type Pokemon = { name: string; url: string };

//Forms
interface ViewEditLayoutProps {
  mode: "view" | "edit";
  onToggle: () => void;
  viewComponent: React.ReactNode;
  editComponent: React.ReactNode;
}

