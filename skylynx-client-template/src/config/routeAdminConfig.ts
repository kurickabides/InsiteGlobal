import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AuthPage from "../pages/authPage";
import Dashboard from "../pages/dashboard";
import Home from "../pages/home";
import Settings from "../pages/settings";
import WalletPage from "../pages/accounts/walletsAccounts";
import {RouteItem }from "./types";

//export const routeAdminConfig: RouteItem[] = [
//  {
//    key: "router-home",
//    title: "Home",
//    path: "/",
//    tooltip: "Home Page",
//    icon: HomeIcon,
//    component: Home,
//    enabled: true,
//  },
//  {
//    key: "router-dashboard",
//    title: "Dashboard",
//    path: "/dashboard",
//    tooltip: "User Dashboard",
//    icon: DashboardIcon,
//    component: Dashboard,
//    condition: (state) => !state.auth?.isLoggedIn,
//  },
//  {
//    key: "router-wallet",
//    title: "Wallet",
//    path: "/wallet",
//    tooltip: "Your Wallet",
//    icon: WalletIcon,
//    component: WalletPage,
//    condition: (state) => state.userBankAccounts?.isLoaded ?? false,
//  },
//  {
//    key: "router-settings",
//    title: "Settings",
//    path: "/settings",
//    tooltip: "Manage App",
//    icon: SettingsIcon,
//    component: Settings,
//    condition: (state) => state.auth?.user?.roles?.includes("Admin") ?? false,
//  },
//  {
//    key: "router-auth",
//    title: "Login",
//    path: "/auth",
//    tooltip: "User Auth",
//    icon: WalletIcon,
//    component: AuthPage,
//    condition: (state) => !state.auth?.isLoggedIn,
//  },
//];
//