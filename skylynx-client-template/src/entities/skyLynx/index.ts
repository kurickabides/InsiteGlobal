// ================================================
// ✅ Entity: SkylynxDataModel + SkylynxPortalPayload
// Description: Core base model and payload for system-wide use
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename:/entities/skylynx/index.ts
// ================================================
import { DyFormSections } from "../dyform";
import { IPortal, IModule } from "../portal";

import {
  ProtosTemplate,
  TemplateRelationship,
  SkylynxTemplateNode,
  SkylynxDataModel,
  SkylynxPortalVariantContext,
  SkylynxUserProfile,
  vmAspNetUserModel,
  vmAddressModel,
  vmProviderProfileValueModel,
  ViewModelParams,
  vmProviderProfileFieldModel,
} from "../../components/core/types";


//Themes Hardeded for now but will move to ThemeOptions or Pallet table.
// ================================================
// ✅ Interface: IFontTypography
// Description: Defines font customization options for Skylynx theming
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: themeTypes.ts
// ================================================

export interface IFontTypography {
  fontFamily?: string; // Global override for all fonts
  fontSize?: number; // Base font size (e.g., 16 or 18)

  // Optional sub-style overrides
  h1?: Partial<IFontStyle>;
  h2?: Partial<IFontStyle>;
  h3?: Partial<IFontStyle>;
  h4?: Partial<IFontStyle>;
  h5?: Partial<IFontStyle>;
  h6?: Partial<IFontStyle>;
  body1?: Partial<IFontStyle>;
  body2?: Partial<IFontStyle>;
  button?: Partial<IFontStyle>;
  caption?: Partial<IFontStyle>;
}

export interface IFontStyle {
  fontSize: number;
  fontWeight: number;
  fontStyle?: "normal" | "italic";
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
}


export enum SkylynxThemeEnum {
  Default = "Default",
  FeldPro = "FeldPro",
  CryoRIO = "CryoRIO",
}
 export interface IMixinStyle {
   padding?: string;
   margin?: string;
   borderRadius?: string;
   boxShadow?: string;
   [key: string]: string | number | undefined; // to allow CSS-in-JS flexibility
 } 

export interface SkylynxThemeMeta {
  key: keyof typeof SkylynxThemeEnum;
  mode?: "light" | "dark";
  typography?: IFontTypography;
  mixins?: Record<string, IMixinStyle>;
}
export interface SkylynxPortalViewModel {
  portalName: string;
  moduleName: string;
  children?: SkylynxPortalViewModel[];
}

export type SkylynxDataModelRecords = Record<
  string,
  SkylynxDataModel | SkylynxDataModel[]
>;

// ================================================
// ✅ Interface: SkylynxPortalResponse
// Description: Final portal form response with config, metadata, and resolved data
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename:skylynxPortalResponse.ts
// ================================================
// Template config used to resolve and render this form
// Fully resolved section + field structure (including nested sections)
// Keyed by ViewModelName, with each record holding data for that view
export interface SkylynxPortalResponse {
  viewModel: string;
  portalName: string;
  moduleName: string;
  template?: ProtosTemplate;
  sections: DyFormSections[];
  data: SkylynxDataModelRecords;
}

// ✅ Interface: SkylynxPortalCache
// Description: Root-level ViewModel structure with variants
// ================================================
export type SkylynxPortalCache = Record<string, SkylynxPortalConfig>;

// ✅ Interface: SkylynxPortalConfig
// Description: Root-level ViewModel structure with variants
// ================================================
export interface SkylynxPortalConfig extends SkylynxTemplateNode {
  portal: IPortal;
  variants: SkylynxTemplateNode[];
}
