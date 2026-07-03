import React, { ReactNode } from "react";
import { SkylynxBaseWrapperProps } from "../../../core/types";
import { IPortal } from "../../../../entities/portal";
import { SkylynxNet_UserProfile } from "../../../auth/types";
;

export interface SkylynxModuleSettings {
  title: string;
  showTitle?: boolean; // default: true
  height: number;
}
export interface UserProfileSettings
  extends SkylynxModuleSettings,
    SkylynxNet_UserProfile {}

export interface ModuleFrameProps<TSettings extends SkylynxModuleSettings = SkylynxModuleSettings> {
  settings: TSettings;
  onSettingsUpdate: (newSettings: TSettings) => void;
  children: React.ReactNode;
}

export interface ModuleSettingsDialogProps<
  TSettings extends SkylynxModuleSettings = SkylynxModuleSettings
> {
  open: boolean;
  settings: TSettings;
  onSave: (newSettings: TSettings) => void;
  onClose: () => void;
}

export interface ModuleWrapperProps extends SkylynxBaseWrapperProps {
  themeKey?: string;
}

export interface LayoutWrapperProps extends SkylynxBaseWrapperProps {
  themeKey?: string;
}

export interface PortalWrapperProps extends SkylynxBaseWrapperProps {
  themeKey?: string; // Optional override for theming
}

export interface PageWrapperProps extends SkylynxBaseWrapperProps {
  themeKey?: string; // Optional override for theming
}

export interface DyFormWrapperProps extends SkylynxBaseWrapperProps {
  themeKey?: string; // Optional override for theming
}

export interface AuthModuleSettings extends SkylynxModuleSettings {
  enableSignup: boolean;
  signupFormTemplate?: string; // e.g., "tmpSignupForm"
  requireEmailVerification: boolean;
  requirePhoneVerification: boolean;
  enableCaptcha: boolean;
  captchaType?: "reCAPTCHA" | "hCaptcha";
  autoLoginAfterSignup?: boolean;
  defaultRedirect?: string;
}