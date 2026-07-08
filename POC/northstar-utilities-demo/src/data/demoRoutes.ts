// ================================================
// File: Demo Route Data
// Description: Stores route metadata used to drive demo navigation and pages.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: demoRoutes.ts
// Type: TypeScript data module file
// ================================================

export type DemoComponentKey =
  | "default"
  | "welcome"
  | "businessProblem"
  | "overview"
  | "dashboard"
  | "fieldMap"
  | "workOrders"
  | "crewRecommendation"
  | "architecture"
  | "roi";

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
  componentKey?: DemoComponentKey;
}

export const demoRoutes: DemoRoute[] = [
  {
    path: "/welcome",
    title: "Welcome",
    eyebrow: "NorthStar Utilities",
    summary: "AI-enabled labor intelligence for gas and electric field operations, showing how planners make faster, more defensible dispatch decisions.",
    focus: ["Best qualified crew at lowest effective cost", "Guided executive workflow", "Realistic synthetic utility operations data"],
    metrics: [
      { label: "Active Work Orders", value: "128" },
      { label: "Available Crews", value: "34" },
      { label: "Monthly Savings Opportunity", value: "$150K" }
    ],
    componentKey: "welcome"
  },
  {
    path: "/business-problem",
    title: "Business Problem",
    eyebrow: "Operations pressure",
    summary: "Dispatchers must choose qualified crews quickly while balancing cost, geography, availability, certifications, overtime, and service risk.",
    focus: ["Manual selection tradeoffs", "Disconnected labor and asset data", "Transparent qualified assignment"],
    metrics: [
      { label: "Avoidable Spend", value: "$48K" },
      { label: "Assignment Exceptions", value: "17" },
      { label: "Travel Reduction Opportunity", value: "14%" }
    ],
    componentKey: "businessProblem"
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
    focus: ["Service areas", "Crew profiles", "Work orders", "Performance history"],
    componentKey: "overview"
  },
  {
    path: "/executive-dashboard",
    title: "Executive Dashboard",
    eyebrow: "Operational snapshot",
    summary: "A KPI view for active work, available crews, emergencies, labor savings, and customer impact.",
    focus: ["Dispatch volume", "Resource capacity", "Cost avoidance"],
    componentKey: "dashboard",
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
    focus: ["Service territories", "Crew proximity", "Work order priority"],
    componentKey: "fieldMap"
  },
  {
    path: "/work-orders",
    title: "Work Orders",
    eyebrow: "Dispatch queue",
    summary: "A prioritized queue for gas leaks, electric outages, inspections, and maintenance work.",
    focus: ["Priority filtering", "Assignment status", "Estimated duration"],
    componentKey: "workOrders"
  },
  {
    path: "/ai-crew-recommendation",
    title: "AI Crew Recommendation",
    eyebrow: "Decision support",
    summary: "Rank crews by qualification, service area fit, equipment, productivity, travel, and adjusted cost.",
    focus: ["Skill match", "Equipment match", "Performance-adjusted cost"],
    componentKey: "crewRecommendation",
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
    focus: ["Frontend shell", "REST endpoints", "SQL or PostGIS data layer"],
    componentKey: "architecture"
  },
  {
    path: "/roi",
    title: "ROI",
    eyebrow: "Business value",
    summary: "Summarize overtime avoided, travel reduction, productivity gains, and customer impact.",
    focus: ["Labor cost reduction", "Faster response", "More defensible dispatch decisions"],
    componentKey: "roi",
    metrics: [
      { label: "Overtime Avoided", value: "210 hrs" },
      { label: "Travel Reduction", value: "14%" },
      { label: "Response Improvement", value: "22%" }
    ]
  }
];
