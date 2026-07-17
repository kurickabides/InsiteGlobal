# NorthStar Operations Console Delivery Plan

## Purpose

This plan tracks the NorthStar Utilities interactive proof-of-concept. The console should feel like a working utility operations application, not a slide-based workflow. The guided presentation frames the problem, then launches the **NorthStar Operations Console** where the presenter can operate the demo through real app modules.

## Core Direction

Use the title:

> **NorthStar Operations Console**

Use the launch button label:

> **Launch Interactive Demo**

The console home is a **Console Hub** with four app modules:

- **Executive Dashboard**: operating picture, KPIs, active incident, service territory map, crew readiness.
- **Work Orders**: selectable dispatch queue, selected work order details, skills, equipment, SLA, customer impact.
- **Dispatch**: task-sensitive map window, crew evaluation, ranking, recommendation, schedule window.
- **Report Center**: recommendation audit, ETA improvement, overtime avoided, travel/customer impact, ROI bridge.

The right-side **Current Task** panel drives the live demo path. It should take the user into app screens instead of listing abstract workflow steps.

## Demo Path

The primary live path is:

1. Presentation: AI Crew Recommendation.
2. Click **Launch Interactive Demo**.
3. Console Hub opens.
4. Click **Active emergency work order** in Current Task.
5. Review `WO-1842` in Work Orders.
6. Click **Evaluate candidate crews**.
7. Dispatch map changes to crew proximity context.
8. Click **Evaluate Crews**.
9. Crew B is ranked and recommended.
10. Continue later phases with assignment, explainability, and ROI close.

## Assumptions

- The primary emergency scenario is `WO-1842`, a gas leak emergency near a hospital corridor.
- Crew B remains the deterministic recommendation.
- The app uses local synthetic utility data with the ArcGIS Maps SDK for JavaScript map module. Esri AI agent and `@arcgis/ai-components` are not used.
- Production deployment with ArcGIS technology must follow Esri attribution and licensing requirements. The demo should avoid secure/private ArcGIS services unless an approved API key or organization access is available.
- The demo must support guided presentation mode and standalone console mode.

## Target Console Modules

### Executive Dashboard

- [x] Show a utility operations shell instead of a presentation card.
- [x] Show KPI tiles for active work, SLA risk, utilization, and modeled savings.
- [x] Show selected emergency context.
- [x] Show local service territory map with gas, electric, crew, and work order context.
- [x] Show crew readiness.
- [ ] Add drill-down controls from dashboard KPIs into Work Orders and Dispatch.

### Work Orders

- [x] Show a selectable planner queue table.
- [x] Default to `WO-1842`.
- [x] Include gas leak, transformer outage, meter inspection, pole patrol, and regulator inspection work orders.
- [x] Highlight the selected work order.
- [x] Show selected work order priority, domain, district, SLA, assignment, customer impact, required skills, and equipment.
- [x] Update map and summary context when selected work order changes.
- [ ] Add table filtering/search behavior.

### Dispatch

- [x] Show a dedicated ArcGIS JavaScript map window inside Dispatch.
- [x] Change map context based on Current Task.
- [x] Show emergency task context for selected work order.
- [x] Show crew proximity context when evaluating candidate crews.
- [x] Show dispatch route preview context for assignment task.
- [x] Show customer/SLA impact context for impact task.
- [x] Add **Evaluate Crews** button.
- [x] Show short progress state while evaluating.
- [x] Rank candidate crews after evaluation.
- [x] Highlight Crew B as recommended.
- [x] Show fit score, ETA, hourly rate, effective cost, equipment readiness, and overtime risk.
- [x] Show strengths and penalties so the result is explainable.
- [ ] Add assignment state change after **Assign Crew B**.

### Report Center

- [x] Show ETA improvement, overtime avoided, and customer risk reduction.
- [x] Show recommendation audit points.
- [ ] Add final assignment details after Crew B is assigned.
- [ ] Add return-to-executive-close action.

## Phase 1: Demo Launch Navigation

### Objective

Allow the audience to jump from the guided presentation into the interactive console.

### Tasks

- [x] Add `/operations-console` route.
- [x] Create `OperationsConsolePage.tsx`.
- [x] Add **Launch Interactive Demo** button to AI Crew Recommendation.
- [x] Add **Launch Interactive Demo** button to ROI/final section.
- [x] Ensure launch buttons navigate to `/operations-console`.

### Acceptance Criteria

- [x] The user can launch the console from AI Crew Recommendation.
- [x] The user can launch the console from ROI/final section.
- [x] The console opens as a distinct app experience.

## Phase 2: Console Hub And App Shell

### Objective

Create a real operations-app container, matching enterprise service/utility software patterns.

### Tasks

- [x] Build purple product header.
- [x] Add left icon rail.
- [x] Replace static workflow with **Console Hub**.
- [x] Add module buttons for Executive Dashboard, Work Orders, Dispatch, and Report Center.
- [x] Move **Demo Controls** to a header hamburger menu.
- [x] Add **Return to Presentation** to the menu.
- [x] Add **Explainability**, **ROI**, and **Restart Demo** menu actions.
- [x] Rename decision/workflow panel to **Current Task**.
- [x] Make Current Task items clickable.

### Acceptance Criteria

- [x] The console feels like an application, not a slide.
- [x] The user can move between all four modules.
- [x] Current Task navigates into app screens.
- [x] Demo controls are accessible from the header.

## Phase 3: Interactive Work Order Workflow

### Objective

Let the user select emergency and non-emergency work orders and see realistic utility dispatch details.

### Tasks

- [x] Include emergency gas leak work order `WO-1842`.
- [x] Include transformer outage, meter inspection, pole damage patrol, and regulator inspection.
- [x] Add selectable work order table.
- [x] Highlight selected work order.
- [x] Default selected work order to `WO-1842`.
- [x] Show selected work order details.
- [x] Show priority, domain, district, customer impact, required skills, equipment, SLA, assignment, and status.
- [x] Update console summary/map context when work order selection changes.
- [ ] Move hard-coded console work order data into a reusable data module.

### Acceptance Criteria

- [x] The user can select a work order.
- [x] `WO-1842` is selected by default.
- [x] Selecting a work order updates the detail panel.
- [x] The gas leak emergency is clearly the hero scenario.

## Phase 4: Map And Field Context

### Objective

Show field/geospatial context in the console using the ArcGIS Maps SDK for JavaScript while avoiding Esri AI/agent components.

### Tasks

- [x] Use ArcGIS Maps SDK for JavaScript map renderer.
- [x] Display selected work order location.
- [x] Display service territory layers.
- [x] Display gas and electric network context.
- [x] Display crew/work order markers.
- [x] Add Dispatch map window.
- [x] Change Dispatch map context based on Current Task.
- [x] Show crew proximity list/context.
- [x] Show customer/SLA impact context.
- [x] Provide loading/error fallback in the map component.

### Acceptance Criteria

- [x] The user can see where the selected emergency is located.
- [x] The user can understand which crews are nearby.
- [x] The Dispatch map changes when the task changes.
- [x] The demo uses local GeoJSON operational layers and avoids Esri AI/agent dependencies.
- [ ] Add approved API key or deployment licensing notes if hosted basemaps/services are used beyond demo/dev.

## Phase 5: Crew Evaluation And Recommendation

### Objective

Make the Dispatch module functional by evaluating crews interactively.

### Tasks

- [x] Add **Evaluate Crews** button.
- [x] Show progress state after clicking Evaluate Crews.
- [x] Rank candidate crews after evaluation.
- [x] Highlight Crew B as the recommendation.
- [x] Show fit score for each crew.
- [x] Show travel/ETA for each crew.
- [x] Show hourly rate and effective cost.
- [x] Show equipment readiness.
- [x] Show overtime risk.
- [x] Show strengths and penalties for non-winning crews.
- [ ] Move crew data and scoring factors into a reusable module.
- [ ] Add unit tests for deterministic scoring once a test runner is added.

### Acceptance Criteria

- [x] The user can click **Evaluate Crews**.
- [x] Crew ranking appears after evaluation.
- [x] Crew B is recommended.
- [x] The result is deterministic and demo-safe.
- [x] The recommendation is explainable, not arbitrary.

## Phase 6: Explainability Inside The Console

### Objective

Show why the recommendation should be trusted inside the app workflow.

### Tasks

- [ ] Add **Why Crew B Wins** panel in Dispatch or Report Center.
- [ ] Show qualification gates.
- [ ] Show gas emergency certification result.
- [ ] Show equipment readiness result.
- [ ] Show travel and SLA exposure result.
- [ ] Show effective cost result.
- [ ] Show overtime risk result.
- [ ] Show customer impact protection.
- [ ] Add score breakdown table.
- [ ] Add planner-facing explanation.

## Phase 7: Assignment Confirmation And ROI Impact

### Objective

Close the loop from recommendation to business value.

### Tasks

- [ ] Add working **Assign Crew B** behavior.
- [ ] Change selected work order status after assignment.
- [ ] Show assigned crew details.
- [ ] Show ETA improvement.
- [ ] Show overtime avoided.
- [ ] Show travel reduction.
- [ ] Show effective cost savings.
- [ ] Show SLA risk reduction.
- [ ] Show customer impact protected.
- [ ] Add **Return to Executive Close** action.

## Phase 8: Presentation Mode And Console Mode Controls

### Objective

Allow the app to be shown as guided presentation or standalone operations app.

### Tasks

- [ ] Add `presentation` and `console` mode concept.
- [ ] Support `/operations-console?mode=console`.
- [ ] Add **Exit Presentation Mode**.
- [ ] Add **Return to Guided Presentation** when standalone mode is active.
- [ ] Keep demo controls available in both modes.

## Phase 9: Polish, Testing, Screenshots, And Rehearsal

### Objective

Make the demo stable and presentation-ready.

### Tasks

- [ ] Improve responsive layout.
- [ ] Tighten utility-app terminology.
- [ ] Capture screenshots for dashboard, work orders, dispatch before evaluation, dispatch after evaluation, and report center.
- [ ] Prepare fallback screenshot path.
- [ ] Run build checks.
- [ ] Rehearse live talk track.

## Live Demo Script

### Opening

> I will start with a short business framing, then switch into the NorthStar Operations Console to show the workflow as a dispatcher or operations leader would experience it.

### Transition At AI Crew Recommendation

> This is the decision we want to make explainable: not just who is cheapest or closest, but who is qualified, equipped, available, and lowest effective cost. Let us launch the interactive demo.

Click:

> **Launch Interactive Demo**

### In NorthStar Operations Console

> We are now in the Console Hub. I will open the active emergency work order, review the field context, then evaluate crews in Dispatch.

Click:

> **Active emergency work order**

Then:

> The work order screen shows priority, SLA, customer impact, required skills, and equipment. Now I will evaluate crews.

Click:

> **Evaluate candidate crews**

Then:

> The Dispatch map changes to crew proximity. I will run the crew evaluation.

Click:

> **Evaluate Crews**

### Recommendation Moment

> Crew B is recommended. It wins because it is qualified for gas emergency response, already has the right equipment, can arrive inside the SLA window, and produces the lowest effective cost.

## Final Readiness Checklist

- [x] Launch Interactive Demo exists.
- [x] NorthStar Operations Console opens.
- [x] Console Hub has four app modules.
- [x] Work order selection works.
- [x] Map/field context is visible.
- [x] Dispatch map changes by task.
- [x] Crew evaluation works.
- [x] Crew B recommendation appears.
- [x] Build passes.
- [ ] Assignment confirmation works.
- [ ] Console explainability panel is complete.
- [ ] ROI/business impact updates after assignment.
- [ ] Screenshots are captured.
- [ ] Live talk track is rehearsed.
