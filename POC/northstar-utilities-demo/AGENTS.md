<!--
================================================
Component: Repository Agent Instructions
Description: Defines project conventions and the required file header standard.
Author: NimbusCore.OpenAI
Architect: Chad Martin
Company: InsiteGlobal
Filename: AGENTS.md
Type: Markdown agent instruction file
================================================
-->

# Repository Guidelines

## File Header Standard

All new application source and supported configuration files must start with the NimbusCore/InsiteGlobal header format shown below. Update the `Component`, `Description`, `Filename`, and `Type` fields so they accurately describe the file being edited.

```ts
// ================================================
// Component: Descriptive File or Component Name
// Description: One concise sentence describing the file purpose.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: Example.tsx
// Type: React TypeScript component file
// ================================================
```

Use the correct comment syntax for the file type. Do not add headers to strict JSON files such as `package.json` or `tsconfig.json`, because comments would make them invalid.

## Project Structure & Module Organization

This repository is currently in an early planning stage for the NorthStar Utilities labor intelligence demo. Core documentation lives in `Documentation/`, including the product plan and workforce data model. `DataModel/` is intended for SQL schemas, seed data, generated datasets, and data dictionary artifacts. `POC/` is intended for prototypes and exploratory proof-of-concept work.

When the React application is scaffolded, place application code in `src/`, static browser assets in `public/`, and generated build output in `dist/`. Keep reusable UI in `src/components/`, feature modules in `src/modules/`, shared services in `src/services/`, and typed models in `src/types/`.

## Build, Test, and Development Commands

No runnable application has been scaffolded yet. Once the Vite React app is added, use these expected commands:

- `npm run dev`: start the local development server.
- `npm run build`: create a production build.
- `npm run preview`: serve the production build locally.
- `npm test`: run the test suite once a test runner is configured.

Document any new scripts in `package.json` and update this guide when commands change.

## Coding Style & Naming Conventions

Use TypeScript and React function components for application code. Prefer strict, explicit types and avoid broad `any` unless there is a clear integration boundary. Use 2-space indentation, double quotes for strings/imports, and semicolons.

Name React components with `PascalCase`, such as `WorkOrderMap.tsx`. Name hooks, utilities, and services with `camelCase`, such as `useCrewRecommendations.ts` or `calculateAdjustedCost.ts`. Avoid spaces in filenames and keep paths portable across Windows, Linux, and CI.

## Testing Guidelines

Use colocated tests with `.spec.ts` or `.spec.tsx` naming. Prioritize tests for recommendation scoring, data transforms, services, and reducers before UI snapshots. Add a test runner such as Vitest before relying on automated checks in CI.

## Commit & Pull Request Guidelines

Recent history uses short imperative commit messages, for example `update docs`. Keep commits focused and describe the changed behavior or artifact, such as `Add workforce seed schema`.

Pull requests should include a concise summary, test or build results, linked issues when available, and screenshots or recordings for visible UI changes. Call out data model, configuration, and asset changes explicitly.

## Security & Configuration Tips

Do not commit local secrets, credentials, or machine-specific environment files. Keep `.env` and `.env.local` ignored. When adding runtime configuration, document required variable names and provide safe local defaults.
