// ================================================
// ✅ Utility: ModuleRegistry (Redux-Aware)
// Description: Registry of dynamic modules and their reducers by portal
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: services/registry/moduleRegistry.ts
// ================================================

import {
  RegistryNamespace,
  ModuleRegistryEntry,
  ModuleRegistrationOptions,
} from "../components/core/types";
import { Reducer, combineReducers } from "redux";

const moduleStore: Record<
  RegistryNamespace,
  Record<string, ModuleRegistryEntry>
> = {};

const reducerStore: Record<RegistryNamespace, Record<string, Reducer>> = {};

export class ModuleRegistry {
  /**
   * ✅ Register a dynamic module entry + optional reducer
   */
  static register(options: ModuleRegistrationOptions) {
    const { RouteRegistryEntry, namespace = "host", reducer } = options;

    const name = RouteRegistryEntry.name;

    // Register visual module
    if (!moduleStore[namespace]) moduleStore[namespace] = {};
    moduleStore[namespace][name] = RouteRegistryEntry;

    // Register state reducer if provided
    if (reducer) {
      if (!reducerStore[namespace]) reducerStore[namespace] = {};
      reducerStore[namespace][name] = reducer;
    }
  }

  /**
   * ✅ Resolve a module component by name and namespace
   */
  static resolve(
    name: string,
    namespace: RegistryNamespace = "host"
  ): React.FC<any> | undefined {
    return moduleStore[namespace]?.[name]?.component;
  }

  /**
   * ✅ Find full module metadata entry by name and namespace
   */
  static findModuleByName(
    name: string,
    namespace: RegistryNamespace = "host"
  ): ModuleRegistryEntry | undefined {
    return moduleStore[namespace]?.[name];
  }

  /**
   * ✅ Update only the component of a registered module
   */
  static setComponent(
    name: string,
    component: React.FC,
    namespace: RegistryNamespace = "host"
  ): void {
    const entry = moduleStore[namespace]?.[name];
    if (entry) {
      entry.component = component;
    } else {
      console.warn(
        `⚠️ Module "${name}" not found in namespace "${namespace}" — cannot set component.`
      );
    }
  }

  /**
   * ✅ Replace/patch module entry fields (name must already exist)
   */
  static updateModuleEntry(
    name: string,
    updates: Partial<ModuleRegistryEntry>,
    namespace: RegistryNamespace = "host"
  ): void {
    const entry = moduleStore[namespace]?.[name];
    if (entry) {
      moduleStore[namespace][name] = {
        ...entry,
        ...updates,
      };
    } else {
      console.warn(
        `⚠️ Module "${name}" not found in namespace "${namespace}" — cannot update entry.`
      );
    }
  }

  /**
   * ✅ List all registered modules for a namespace
   */
  static list(namespace: RegistryNamespace = "host"): ModuleRegistryEntry[] {
    return Object.values(moduleStore[namespace] || {});
  }

  /**
   * ✅ Return combined reducer for all modules in a namespace
   */
  static getCombinedReducer(namespace: RegistryNamespace = "host"): Reducer {
    return combineReducers(reducerStore[namespace] || {});
  }

  /**
   * ✅ Clear all registered modules and reducers for a namespace
   */
  static clearNamespace(namespace: RegistryNamespace) {
    delete moduleStore[namespace];
    delete reducerStore[namespace];
  }
}
