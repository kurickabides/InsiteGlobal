// ================================================
// File: Presentation Tree Configuration
// Description: Provides the default guided presentation flow for new POC projects.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: presentationTree.ts
// Type: TypeScript configuration file
// ================================================

import { PresentationNode } from "@/types/presentation";

export const presentationTree: PresentationNode[] = [
  {
    id: "welcome",
    path: "/welcome",
    title: "Welcome",
    eyebrow: "Skylynx Presentation Template",
    summary: "A guided workspace for building runnable proof-of-concept demos with reusable presentation flow, Redux state, and real-world app patterns.",
    focus: ["Introduce the demo", "Set audience expectations", "Start the guided flow"],
    metrics: [
      { label: "Template Mode", value: "Guided" },
      { label: "Runtime", value: "Vite" },
      { label: "State", value: "Redux" }
    ]
  },
  {
    id: "business-context",
    path: "/business-context",
    title: "Business Context",
    eyebrow: "Presentation setup",
    summary: "Frame the client problem, target users, operating environment, and the decision the POC is designed to support.",
    focus: ["Client narrative", "User roles", "Decision workflow"]
  },
  {
    id: "demo-surface",
    path: "/demo-surface",
    title: "Demo Surface",
    eyebrow: "Reusable app canvas",
    summary: "Show the primary interactive workspace for dashboards, maps, documents, and concept-specific modules.",
    focus: ["Dashboard area", "Module placement", "Scenario walkthrough"]
  },
  {
    id: "map-and-documents",
    path: "/map-and-documents",
    title: "Map and Documents",
    eyebrow: "Core POC capabilities",
    summary: "Reserve a standard place in the flow for Esri map views and PDF-driven evidence or engineering documents.",
    focus: ["Esri map module", "PDF viewer module", "Mock data sources"]
  },
  {
    id: "value-summary",
    path: "/value-summary",
    title: "Value Summary",
    eyebrow: "Executive close",
    summary: "Summarize the measurable value, next implementation steps, and what should be validated after the POC demo.",
    focus: ["Business value", "Technical fit", "Next steps"],
    metrics: [
      { label: "Flow Steps", value: "5" },
      { label: "Navigation", value: "Previous / Continue" },
      { label: "Template Status", value: "Ready to Extend" }
    ]
  }
];
