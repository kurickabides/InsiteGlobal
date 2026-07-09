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
  | "utilityChallenges"
  | "overview"
  | "dashboard"
  | "fieldMap"
  | "workOrders"
  | "crewRecommendation"
  | "explainability"
  | "architecture"
  | "roi";

export interface DemoRoute {
  path: string;
  title: string;
  eyebrow: string;
  summary: string;
  surfaceTitle: string;
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
    surfaceTitle: "What the demo will prove",
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
    surfaceTitle: "The dispatch decision gap",
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
    summary: "Utility dispatch teams must coordinate gas and electric emergencies, planned work, crew qualifications, equipment, mutual aid, and customer commitments across a changing service territory.",
    surfaceTitle: "Operational constraints that shape every assignment",
    focus: ["Protect life and service reliability", "Balance shared crews across gas and electric work", "Prove every assignment is qualified, timely, and cost-aware"],
    metrics: [
      { label: "Emergency Mix", value: "31%" },
      { label: "Cross-domain Crews", value: "18" },
      { label: "Constraint Checks", value: "7" }
    ],
    componentKey: "utilityChallenges"
  },
  {
    path: "/northstar-overview",
    title: "NorthStar Overview",
    eyebrow: "Fictional combined utility",
    summary: "NorthStar Utilities represents a portfolio-ready electric and gas operator with realistic field workflows.",
    surfaceTitle: "What you should learn by the end",
    focus: ["Service areas", "Crew profiles", "Work orders", "Performance history"],
    componentKey: "overview"
  },
  {
    path: "/executive-dashboard",
    title: "Executive Dashboard",
    eyebrow: "Operational snapshot",
    summary: "A KPI view for active work, available crews, emergencies, labor savings, and customer impact.",
    surfaceTitle: "Live operating posture",
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
    summary: "Interactive field view for service area polygons, work order points, crew locations, and route simulation.",
    surfaceTitle: "Geospatial context for the decision",
    focus: ["Service territories", "Crew proximity", "Work order priority"],
    componentKey: "fieldMap"
  },
  {
    path: "/work-orders",
    title: "Work Orders",
    eyebrow: "Dispatch queue",
    summary: "A prioritized queue for gas leaks, electric outages, inspections, and maintenance work.",
    surfaceTitle: "Selected emergency work order",
    focus: ["Priority filtering", "Assignment status", "Estimated duration"],
    componentKey: "workOrders"
  },
  {
    path: "/ai-crew-recommendation",
    title: "AI Crew Recommendation",
    eyebrow: "Decision support",
    summary: "Rank crews by qualification, service area fit, equipment, productivity, travel, and adjusted cost.",
    surfaceTitle: "Ranked crew recommendation",
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
    surfaceTitle: "Transparent recommendation logic",
    focus: ["Qualification gates", "Effective cost drivers", "Risk and SLA penalties"],
    componentKey: "explainability",
    metrics: [
      { label: "Qualification Gates", value: "5 / 5" },
      { label: "Risk Reduction", value: "31%" },
      { label: "Audit Confidence", value: "High" }
    ]
  },
  {
    path: "/architecture",
    title: "Architecture",
    eyebrow: "Demo architecture",
    summary: "React, MUI, Esri JS, local API, workforce data model, and route simulation service.",
    surfaceTitle: "Reference architecture for the demo",
    focus: ["Frontend shell", "REST endpoints", "SQL or PostGIS data layer"],
    componentKey: "architecture"
  },
  {
    path: "/roi",
    title: "ROI",
    eyebrow: "Business value",
    summary: "Summarize overtime avoided, travel reduction, productivity gains, and customer impact.",
    surfaceTitle: "Value model and executive close",
    focus: ["Labor cost reduction", "Faster response", "More defensible dispatch decisions"],
    componentKey: "roi",
    metrics: [
      { label: "Overtime Avoided", value: "210 hrs" },
      { label: "Travel Reduction", value: "14%" },
      { label: "Response Improvement", value: "22%" }
    ]
  }
];
