// ================================================
// File: Redux Hooks
// Description: Provides typed Redux hooks for the Skylynx client template.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: hooks.ts
// Type: TypeScript Redux helper file
// ================================================

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/appStore/store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
