// ================================================
// ✅ Constants: Fallbacks for App Runtime Values
// Description: Static fallback values if .env/hydrated values are unavailable
// Author: NimbusCore.OpenAI
// Company: CryoRio
// ================================================

import { getEnvVar } from "../config/envHydrator";

// 🔧 App Identity
export const APP_TITLE = getEnvVar("REACT_APP_NAME") || "SkyLynxs";
export const FOOTER_TEXT = `${new Date().getFullYear()} @Skylynx LLC`;

// 🌐 App URLs
export const AuthServer_URL =
  getEnvVar("AuthServer_URL") || "http://localhost:5001/api/auth/";
export const SkylynxServer_URL =
  getEnvVar("SkylynxServer_URL") || "http://localhost:5001/api";
export const SkylynxServer_TemplatesURL =
  getEnvVar("SkylynxServer_TemplatesURL") ||
  "http://localhost:5001/api/nimbus/templates/targets/";
export const app_URL = getEnvVar("app_URL") || "https://skylynxnet:5001/";

// 🆔 Internal Portal Resolution
export const SkylynxKey_APIKEY =
  getEnvVar("SKYLYNX_API_KEY") || "2EEBE1A1-23CD-4C16-96E7-567C02EF79EA";
export const SkylynxKey_HostPortal =
  getEnvVar("SKYLYNX_HOST_PORTAL") || "SkyLynxNet";

// 📐 UI Constants
export const Sketch_HEIGHT = 300;
export const Sketch_WIDTH = 500;
export const FOOTER_HEIGHT = 30;
export const HEADER_HEIGHT = 60;
export const DRAWER_WIDTH = 250;
export const PAGE_WIDTH = 500;

// 🧾 Page Titles
export const PAGE_TITLE_HOME = "Home";
export const PAGE_TITLE_AUTH = "Login/Signup";
export const PAGE_TITLE_AUTH_SIGNUP = "Signup";
export const PAGE_TITLE_AUTH_LOGIN = "Login/Signup";
export const PAGE_TITLE_DASHBOARD = "Dashboard";
export const PAGE_TITLE_ACCOUNTS = "Accounts";
export const SUBPAGE_TITLE_BANK = "Devices";
export const SUBPAGE_TITLE_ETH = "Network";
export const SUBPAGE_TITLE_XLM = "Wallet";
export const PAGE_TITLE_SETTINGS = "Settings";

// ❗ Error Window UI
export const ERRORWIN_TOP = `30vh`;
export const ERRORWIN_LEFT = `15rem`;
export const ERRORWIN_WIDTH = `30rem`;
