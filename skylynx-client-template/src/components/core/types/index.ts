

// ================================================
// ✅ Skylynx Core Types Interfaces: 
// Description: Holds all core global types shared across all modules
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: types/skylynx/core/types.ts
// ================================================
import React, { ReactNode } from "react";
import { Reducer } from "redux";
import { IPortal } from "../../../entities/portal";

export interface SkylynxPortalTreeState {
  tree?: SkylynxPortalTree;
  loading: boolean;
  error?: string;
}
//New interfacees move SkylynxPortalTreeState out of store
export type PortalNamespace = "host" | string;

export interface TreePair {
  original: SkylynxPortalTree;
  current: SkylynxPortalTree;
}



// Define shape of a registry entry
export interface ITargetRegistryEntry {
  data?: Record<string, ITargetComponent>;
}
export interface TargetRegistryStateCollection {
  [namespace: string]: TargetRegistryState;
}

export enum RegistryStatus {
  Loading = "loading",
  Ok = "ok",
  Error = "error",
}
export interface TargetRegistryState {
  targets: Record<string, ITargetRegistryEntry>;
  lastResolvedAt: string;
  status: RegistryStatus;
}

export type RegistryNamespace = "host" | string;

export interface ModuleRegistryEntry {
  name: string;
  component: React.FC<any>;
  description?: string;
}

export interface RouteRegistryEntry {
  path: string;
  element: JSX.Element;
  namespace: RegistryNamespace;
}
export interface ModuleRegistrationOptions {
  RouteRegistryEntry: ModuleRegistryEntry;
  namespace?: RegistryNamespace;
  reducer?: Reducer;
}

export interface ProtosTargetTypeState {
  types: TemplateType[];
  loading: boolean;
  error?: string;
}

// ================================================
// ✅ Entity: IKeyValuePair
// Description: Represents a single input for any type or array
// ================================================
export interface IKeyValuePair {
  key: string;
  value: string;
}


// Protos Template Interfaces
export interface IResolver {
  resolverId: string;
  resolverType: string; // from ResolverType table
  target: string;
  description?: string;
}
export interface DyFormResolver extends IResolver {
  context: string;
  path?: string;
  method?: string;
  notes?: string;
}
export interface SkylynxDataModel {
  createdAt?: Date;
  updatedAt?: Date;
  status?: string; // Optional status message or state (e.g., 'active', 'error', etc.)
}

export type ViewModelParams = {
  [paramName: string]: string | number | boolean | null;
};

export interface SkylynxPortalVariantContext {
  formName: string;
  template: string;
  version: string;
  resolverId: string;
}

//Datamodels

export interface SkylynxUserProfile {
  aspNetUserModel: vmAspNetUserModel;
  mailingAddressModel: vmAddressModel;
  billingAddressModel: vmAddressModel;
  providerProfileFieldModel: vmProviderProfileFieldModel;
  providerProfileValueModel: vmProviderProfileValueModel;
}

export interface vmAspNetUserModel extends SkylynxDataModel {
  Id: string;
  UserName: string;
  NormalizedUserName: string;
  Email: string;
  NormalizedEmail: string;
  EmailConfirmed: boolean;
  PasswordHash?: string;
  SecurityStamp?: string;
  ConcurrencyStamp?: string;
  PhoneNumber?: string;
  PhoneNumberConfirmed: boolean;
  TwoFactorEnabled: boolean;
  LockoutEnd?: Date;
  LockoutEnabled: boolean;
  AccessFailedCount: number;
}

export interface vmAddressModel extends SkylynxDataModel {
  AddyID: string;
  Street1?: string;
  Street2?: string;
  City?: string;
  State?: string;
  PostalCode?: string;
  Country?: string;
  Latitude?: number;
  Longitude?: number;
}
export interface vmProviderProfileValueModel extends SkylynxDataModel {
  UserID: string;
  ProviderID: string;
  FieldID: string;
  FieldValue: string;
}

export interface vmProviderProfileFieldModel extends SkylynxDataModel {
  FieldID: string;
  ProviderID: string;
  FieldName: string;
  FieldTypeID: string;
  IsRequired: boolean;
  SortOrder: number;
}

export interface SkylynxPortalTree {
  PortalName: string;
  PortalTemplate: ProtosTemplate;
  PortalObject?: IPortal;
  children?: SkylynxTemplateNode[];
}


export interface ProtosTemplate {
  templateID: string;
  templateName: string;
  templateType: TemplateType;
  version: string;
  versionID: string; // TemplateVersionID
  resolver?: IResolver;
  sortOrder?: number;
  targetID?: string;
}


export type TemplateRelationship = {
  parentType: string;
  allowedChildTypes: string[];
};

// ================================================
// ✅ Interface: SkylynxPortalViewModel
// Description: Represents a ViewModel node in the config tree
// ================================================
export interface SkylynxTemplateNode {
  nodeName: string;
  template: ProtosTemplate;
  targetObject: ITargetComponent;
  children?: SkylynxTemplateNode[];
}

export interface TemplateType {
  targetTypeID: string;
  TargetTypeName: string;
  description?: string;
  createdAt?: Date;
}

export interface ProtosTargetTypeState {
  types: TemplateType[];
  loading: boolean;
  error?: string;
}

//DyForm Types 


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

export interface ISkylynxViewModel {
  portalName: string;
  moduleName?: string;
  templateVersion: string;
  resolver?: IResolver | DyFormResolver;
  contextKey?: string; // optional tag
}

export interface ITargetObject extends SkylynxDataModel {
  componentName?: string;
  componentPath?: string;
  ComponentConfig?: string;
}

//this has the Component information along with targt reocrds data they can be loaded into component if need like title and other info need to hydrate website
export interface ITargetComponent {
  componentName?: string;
  componentPath?: string;
  ComponentConfig?: string;
  data?: ITargetObject; //targets record
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




//Base Wrapper Interfaces

export interface SkylynxBaseWrapperProps {
  renderNode: SkylynxRenderNode;
  children?: ReactNode;
  style?: React.ElementType;
  visible?: boolean;
  themeContext?: any;
}

export interface SkylynxRenderNode<
  VM = ISkylynxViewModel,
  DM = SkylynxDataModel,
  TC = ITargetComponent
> {
  template: ProtosTemplate;
  viewModel: VM;
  dataModel: DM;
  targetComponent?: TC;
  children?: SkylynxRenderNode<
    ISkylynxViewModel,
    SkylynxDataModel,
    ITargetComponent
  >[];
}

