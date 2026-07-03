// ================================================
// ✅ Selector: selectModuleState
// Description: Typed accessor for dynamic module state
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: appStore/moduleStateSelector.ts
// ================================================

import { RootState } from "./store";

export function selectModuleState<T>(
  state: RootState,
  moduleKey: string
): T | undefined {
  return (state.moduleRegistry as Record<string, any>)[moduleKey] as
    | T
    | undefined;
}
