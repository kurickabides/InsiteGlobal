// ================================================
// File: Application Configuration
// Description: Defines reusable app branding and presentation behavior defaults.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: appConfig.ts
// Type: TypeScript configuration file
// ================================================

export const appConfig = {
  appName: "Skylynx Client Template",
  subtitle: "Presentation-driven POC starter",
  splash: {
    message: "Preparing your presentation..."
  },
  presentation: {
    allowFreeNavigation: true
  },
  data: {
    mockDataRoot: "/mock-data",
    datasourceRoot: "/datasources",
    documentsRoot: "/documents",
    workersRoot: "/workers"
  }
};
