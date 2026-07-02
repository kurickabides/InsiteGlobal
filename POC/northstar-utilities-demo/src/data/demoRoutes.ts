// ================================================
// Component: Demo Route Data
// Description: Stores route metadata used to drive demo navigation and pages.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: demoRoutes.ts
// Type: TypeScript data module file
// ================================================

export interface DemoRoute {
  path: string;
  title: string;
  eyebrow: string;
  summary: string;
  focus: string[];
  metrics?: Array<{
    label: string;
    value: string;
  }>;
}

export const demoRoutes: DemoRoute[] = [
  {
    path: "/welcome",
    title: "Welcome",
    eyebrow: "NorthStar Utilities",
    summary: "Executive demo workspace for AI-enabled utility labor intelligence.",
    focus: ["Set the business context", "Introduce the operating model", "Frame the dispatch decision"]
  },
  {
    path: "/business-problem",
    title: "Business Problem",
    eyebrow: "Operations pressure",
    summary: "Field leaders need qualified crews assigned faster while controlling overtime, travel, and risk.",
    focus: ["Slow manual crew selection", "Disconnected labor and asset data", "Limited cost visibility"]
  },
  {
    path: "/utility-challenges",
    title: "Utility Challenges",
    eyebrow: "Gas and electric complexity",
    summary: "The demo combines electric and gas work with shared crews, equipment, districts, and priority rules.",
    focus: ["Emergency response", "Skill and certification matching", "Service territory constraints"]
  },
  {
    path: "/northstar-overview",
    title: "NorthStar Overview",
    eyebrow: "Fictional combined utility",
    summary: "NorthStar Utilities represents a portfolio-ready electric and gas operator with realistic field workflows.",
    focus: ["Service areas", "Crew profiles", "Work orders", "Performance history"]
  },
  {
    path: "/executive-dashboard",
    title: "Executive Dashboard",
    eyebrow: "Operational snapshot",
    summary: "A KPI view for active work, available crews, emergencies, labor savings, and customer impact.",
    focus: ["Dispatch volume", "Resource capacity", "Cost avoidance"],
    metrics: [
      { label: "Active Work Orders", value: "128" },
      { label: "Available Crews", value: "34" },
      { label: "Labor Savings", value: "$42K" }
    ]
  },
  {
    path: "/map",
    title: "Map",
    eyebrow: "Esri field view",
    summary: "Placeholder for service area polygons, work order points, crew locations, and route simulation.",
    focus: ["Service territories", "Crew proximity", "Work order priority"]
  },
  {
    path: "/work-orders",
    title: "Work Orders",
    eyebrow: "Dispatch queue",
    summary: "A prioritized queue for gas leaks, electric outages, inspections, and maintenance work.",
    focus: ["Priority filtering", "Assignment status", "Estimated duration"]
  },
  {
    path: "/ai-crew-recommendation",
    title: "AI Crew Recommendation",
    eyebrow: "Decision support",
    summary: "Rank crews by qualification, service area fit, equipment, productivity, travel, and adjusted cost.",
    focus: ["Skill match", "Equipment match", "Performance-adjusted cost"],
    metrics: [
      { label: "Top Match", value: "Crew B" },
      { label: "Skill Fit", value: "96%" },
      { label: "Cost Delta", value: "-18%" }
    ]
  },
  {
    path: "/explainability",
    title: "Explainability",
    eyebrow: "Transparent recommendations",
    summary: "Show why the recommended crew wins even when its hourly rate is not the lowest.",
    focus: ["Qualification checks", "Cost drivers", "Risk penalties"]
  },
  {
    path: "/architecture",
    title: "Architecture",
    eyebrow: "Demo architecture",
    summary: "React, MUI, Esri JS, local API, workforce data model, and route simulation service.",
    focus: ["Frontend shell", "REST endpoints", "SQL or PostGIS data layer"]
  },
  {
    path: "/roi",
    title: "ROI",
    eyebrow: "Business value",
    summary: "Summarize overtime avoided, travel reduction, productivity gains, and customer impact.",
    focus: ["Labor cost reduction", "Faster response", "More defensible dispatch decisions"],
    metrics: [
      { label: "Overtime Avoided", value: "210 hrs" },
      { label: "Travel Reduction", value: "14%" },
      { label: "Response Improvement", value: "22%" }
    ]
  }
];
