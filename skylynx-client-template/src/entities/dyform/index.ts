// ================================================
// ✅ Entity: DyFormViewModel
// Description: Defines DyForm types
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename:/entities/dyform/index.ts
// ================================================

import { SkylynxDataModel, IKeyValuePair } from "../../components/core/types";

// ================================================
// ✅ Interface: LoadPortalFormRequest
// Description: Load request payload for dynamic form ViewModel
// ================================================
export interface LoadPortalFormRequest {
  templateName: string;
  portalName: string;
  moduleName: string;
  params?: IKeyValuePair[];
}

export enum ViewModelName {
  vmUserProfile_View = "vmUserProfile_View",
  vmUserProfile_Edit = "vmUserProfile_Edit",
  vmPortalAdmin_View = "vmPortalAdmin_View",
}

export enum ViewNames {
  view = "View",
  edit = "Edit",
  admin = "Admin",
}
export interface DyFormSections {
  sectionId: string;
  sectionName: string;
  label: string;
  sortOrder: number;
  fields?: DyFormField[];
  children?: DyFormSections[];
}

export interface DyFormViewModel {
  viewModel: string;
  userId?: string;
  portalName: string;
  moduleName: string;
  context: {
    formName: string;
    template: string;
    version: string;
    resolver: {
      method: string;
      path: string;
      type: string;
    };
  };
  sections: DyFormSection[];
}
export interface DyFormFieldType {
  fieldTypeId: string;
  fieldTypeName: string;
  componentName: string;
}

export interface DyFormSection {
  sectionId: string;
  name: string;
  label?: string;
  sortOrder?: number;
  resolvers?: DyFormResolver[];
  fields: DyFormField[];
}

export interface DyFormField {
  fieldId: string;
  label: string;
  tooltip?: string;
  placeholder?: string;
  value?: any;
  fieldType: DyFormFieldType;
  readonly?: boolean;
  required?: boolean;
  sortOrder: number;
  rules?: DyFormRule[];
  domain?: DyFormDomain;
  sourceKey: string;
  sourcePath: string;
  isDirectProperty: boolean;
}

export interface DyFormRule {
  type: string;
  value: any;
}

export interface DyFormDomain {
  name: string;
  options: IKeyValuePair[];
}

export interface DyFormResolver {
  context: string;
  type: string;
  target: string;
  path?: string;
  method?: string;
  notes?: string;
}
