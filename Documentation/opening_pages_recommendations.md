# NorthStar Utilities Opening Pages Readiness Recommendations

## Purpose

This document translates the current NorthStar Utilities demo documentation into a focused next-step plan for polishing the opening two presentation pages: **Welcome** and **Business Problem**.

## Documentation Signals Reviewed

- The master plan positions the demo as a portfolio-quality React application that should function as both an executive presentation and a working AI-enabled utility operations demo.
- The planned demo flow starts with Welcome, Business Problem, Utility Challenges, and NorthStar Overview before moving into dashboard, map, work orders, AI recommendation, explainability, architecture, and ROI.
- The original demo brief emphasizes faster and more reliable insight into work planning, crew assignment, labor cost, qualification data, and assignment consistency.
- The workforce data model frames the core value proposition as recommending the best qualified crew at the lowest effective cost, not simply the lowest hourly rate.
- The current React proof of concept has route metadata for the first two pages, but the page body still renders a generic placeholder workspace rather than presentation-ready content.

## Recommended Presentation Goal

The first two pages should quickly answer three questions for an executive audience:

1. **What is this demo?** An AI-enabled utility labor intelligence demo for a fictional combined gas and electric utility.
2. **Why does it matter?** Manual crew assignment can miss lower-cost qualified options and create avoidable overtime, travel, and risk.
3. **What will the audience see next?** A guided workflow from business problem to operational dashboard, map, work orders, crew recommendation, explainability, and ROI.

## Page 1: Welcome

### Recommended Message

Position NorthStar Utilities as a credible executive demo rather than a generic app landing page.

Suggested hero copy:

> NorthStar Utilities is an AI-enabled labor intelligence demo for gas and electric field operations. It shows how planners can combine work orders, crew qualifications, labor rates, service territories, travel, and performance history to make faster, more defensible dispatch decisions.

### Recommended Content Blocks

- **Demo thesis:** Best qualified crew at the lowest effective cost.
- **Audience promise:** The presentation will move from operating pressure to a transparent crew recommendation and measurable ROI.
- **Demo path preview:** Business problem, utility challenges, overview, dashboard, map, work orders, AI recommendation, explainability, architecture, and ROI.
- **Credibility callout:** Fictional NorthStar Utilities uses realistic synthetic gas and electric operations data designed around workforce planning concepts.

### Recommended Visual Direction

- Replace the generic placeholder with a polished executive hero panel.
- Add three high-level cards: **Plan Work**, **Recommend Crews**, and **Explain Savings**.
- Use NorthStar-style operating metrics sparingly on this page, such as active work orders, available crews, emergency events, and estimated monthly savings.

## Page 2: Business Problem

### Recommended Message

Make the problem concrete: dispatchers need to choose qualified crews quickly while balancing cost, geography, availability, certifications, overtime, and service risk.

Suggested hero copy:

> Utility operations teams often assign work based on availability, habit, or incomplete information. That can lead to qualified lower-cost crews being overlooked, overtime being used too early, and field leaders lacking a transparent explanation for why a crew was selected.

### Recommended Content Blocks

- **Current-state pain:** Manual selection, disconnected labor and asset data, limited cost visibility, and inconsistent qualification checks.
- **Operational consequence:** Avoidable overtime, excess travel, underutilized crews, slower response, and harder planner review.
- **Decision question:** Which qualified crew should get this job when labor cost, travel time, skill fit, service territory, equipment, and overtime risk are all considered?
- **Bridge to next page:** Gas and electric work adds complexity because work types, certifications, equipment, and emergency response rules vary by domain.

### Recommended Visual Direction

- Replace the generic placeholder with a two-column problem frame:
  - Left column: **Today: manual dispatch tradeoffs**.
  - Right column: **NorthStar: optimized qualified assignment**.
- Add a small ranked crew comparison teaser showing why the cheapest hourly crew is not always the lowest effective-cost crew.
- Include one simple executive metric strip, such as estimated avoidable spend, assignment exceptions, overtime exposure, and travel reduction opportunity.

## Implementation Next Steps

1. **Create page-specific content data** so Welcome and Business Problem can render custom panels instead of the shared placeholder.
2. **Update the `DemoPage` component** to support route-specific content sections, such as hero cards, process steps, comparison panels, and metric strips.
3. **Polish the first two route definitions** with presentation-ready copy, executive metric labels, and page-specific focus points.
4. **Keep pages 3 through 11 in the current reusable template** until the opening narrative is approved.
5. **Run a production build** after updates to confirm the Vite proof of concept remains runnable.
6. **Capture a screenshot** after visual changes so the opening pages can be reviewed before the presentation.

## Definition of Done for the Opening Two Pages

- The Welcome page clearly introduces NorthStar Utilities, the AI labor intelligence theme, and the guided presentation flow.
- The Business Problem page clearly explains why current crew assignment is inefficient and what decision NorthStar improves.
- Both pages avoid placeholder language.
- Both pages are visually distinct enough for a live presentation.
- The opening narrative aligns with the demo documentation and the workforce data model.
- The app builds successfully with `npm run build`.
