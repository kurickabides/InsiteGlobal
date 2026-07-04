// ================================================
// File: Presentation Types
// Description: Defines reusable presentation tree and runtime state models for guided POC demos.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: presentation.ts
// Type: TypeScript type definition file
// ================================================

export interface PresentationMetric {
  label: string;
  value: string;
}

export interface PresentationNode {
  id: string;
  path: string;
  title: string;
  eyebrow: string;
  summary: string;
  focus: string[];
  metrics?: PresentationMetric[];
  componentKey?: string;
  children?: PresentationNode[];
}

export type PresentationMode = "guided" | "freeNavigation";

export interface PresentationState {
  activeNodeId: string;
  completedNodeIds: string[];
  mode: PresentationMode;
}
