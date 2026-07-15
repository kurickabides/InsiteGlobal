# NorthStar Operations Console Delivery Plan

## Purpose

This delivery plan captures the design direction, implementation tasks, and progress checklist for turning the NorthStar Utilities presentation into a functional, interactive proof-of-concept demo.

The target experience is a hybrid flow:

1. Use the existing guided presentation to frame the business problem and solution vision.
2. Launch an interactive proof-of-concept from the presentation using the button label **Launch Interactive Demo**.
3. Present the working demo as the **NorthStar Operations Console**.
4. Return from the console to the executive close, explainability, architecture, or ROI sections.

## Core Decision

Use the title:

> **NorthStar Operations Console**

Use the launch button label:

> **Launch Interactive Demo**

## Delivery Approach

Build this work in sections rather than as one large change. The safest sequence is:

1. Navigation and console shell.
2. Interactive work order and map context.
3. Crew recommendation workflow.
4. Explainability and ROI close.
5. Polish, testing, screenshots, and rehearsal.

The primary demo bridge should be:

> **AI Crew Recommendation → Launch Interactive Demo → NorthStar Operations Console → Return to Executive Close**

This directly addresses the team feedback that the demo should be presented as a functional, interactive solution rather than only a slide-based concept.

## Assumptions

- The current presentation flow stays mostly the same.
- The primary interactive scenario is the emergency gas leak work order.
- The emergency work order is `WO-1842`.
- Crew B remains the recommended assignment.
- The demo is a functional proof-of-concept, not a production system.
- The experience supports both guided presentation mode and standalone console mode.

## Target Presentation Flow

- [ ] Welcome
- [ ] Business Problem
- [ ] Utility Challenges
- [ ] NorthStar Overview
- [ ] Executive Dashboard
- [ ] Map
- [ ] Work Orders
- [ ] AI Crew Recommendation
- [x] Launch Interactive Demo
- [x] NorthStar Operations Console
- [ ] Explainability
- [ ] Architecture
- [ ] ROI

## Target Console Workflow

- [ ] Review operating situation.
- [ ] Select emergency work order.
- [ ] View map and geospatial context.
- [ ] Evaluate candidate crews.
- [ ] Generate crew recommendation.
- [ ] Explain why the recommended crew wins.
- [ ] Confirm assignment.
- [ ] Show business impact.
- [ ] Return to presentation close.

## Phase 1: Add Demo Launch Navigation

### Objective

Allow the audience to jump from the guided presentation into the interactive console.

### Tasks

- [x] Add a new `/operations-console` route.
- [x] Create `OperationsConsolePage.tsx`.
- [x] Display the page title **NorthStar Operations Console**.
- [x] Display a subtitle such as **Interactive dispatch workflow for gas and electric field operations**.
- [x] Add a **Launch Interactive Demo** button to the AI Crew Recommendation section.
- [x] Keep a **Continue Presentation** option on the AI Crew Recommendation section.
- [x] Add a **Launch Interactive Demo** button to the final ROI section beside Restart.
- [x] Ensure the launch button navigates to `/operations-console`.

### Acceptance Criteria

- [x] The user can launch the console from AI Crew Recommendation.
- [x] The user can launch the console from the ROI/final section.
- [x] The AI Crew Recommendation page clearly offers both the product demo path and the continue-presentation path.
- [x] The final section supports replaying the demo during Q&A.

## Phase 2: Build NorthStar Operations Console Shell

### Objective

Create the app-like container for the interactive demo experience.

### Tasks

- [x] Build the main console layout.
- [x] Add a scenario banner for the active emergency.
- [x] Add a guided workflow stepper.
- [x] Add a main content area for the current workflow step.
- [x] Add a decision summary panel.
- [x] Add a **Demo Controls** menu.
- [x] Add **Return to Presentation** to the controls menu.
- [x] Add **Jump to Explainability** to the controls menu.
- [x] Add **Jump to Architecture** to the controls menu.
- [x] Add **Jump to ROI** to the controls menu.
- [x] Add **Restart Demo** to the controls menu.
- [ ] Add **Exit Presentation Mode** to the controls menu.

### Acceptance Criteria

- [x] The console feels visually distinct from the presentation slides.
- [x] The console title is **NorthStar Operations Console**.
- [ ] The user can move through the console workflow steps.
- [x] The user can jump back to presentation sections from the console.
- [x] The user can restart the interactive demo without restarting the whole presentation.

## Phase 3: Build Interactive Work Order Workflow

### Objective

Let the user select the emergency case and see realistic dispatch information.

### Tasks

- [ ] Move shared work order data into a reusable data module.
- [ ] Include the emergency gas leak work order `WO-1842`.
- [ ] Include additional work orders such as transformer outage, meter inspection, pole damage patrol, and regulator inspection.
- [ ] Add selectable work order cards.
- [ ] Highlight the selected work order.
- [ ] Default the selected work order to `WO-1842`.
- [ ] Show selected work order details.
- [ ] Show priority, district, customer impact, required skills, equipment, SLA, and status.
- [ ] Update console summary panels when a work order is selected.

### Acceptance Criteria

- [ ] The user can select a work order.
- [ ] `WO-1842` is selected by default.
- [ ] Selecting a work order updates the detail panel.
- [ ] The emergency gas leak scenario is clearly the hero scenario.

## Phase 4: Add Map And Field Context

### Objective

Show geospatial context inside the console so the dispatch decision feels operational and realistic.

### Tasks

- [ ] Reuse the existing Esri map module where practical.
- [ ] Load or display the gas leak emergency story context.
- [ ] Show selected work order location.
- [ ] Show nearby crews or a crew proximity list.
- [ ] Show service territory or district context.
- [ ] Show customer impact context.
- [ ] Show SLA or response-time pressure.
- [ ] Provide a fallback summary if the map fails to load.

### Acceptance Criteria

- [ ] The user can see where the emergency is located.
- [ ] The user can understand which crews are nearby.
- [ ] The field context supports the recommendation story.
- [ ] The demo remains usable if the map has an environment issue.

## Phase 5: Build Crew Evaluation And Recommendation Workflow

### Objective

Make the proof-of-concept feel functional by evaluating crews interactively.

### Tasks

- [ ] Move shared crew data into a reusable data module.
- [ ] Create or centralize recommendation scoring logic.
- [ ] Add an **Evaluate Crews** button.
- [ ] Show a short loading/progress state after clicking Evaluate Crews.
- [ ] Rank candidate crews after evaluation.
- [ ] Highlight Crew B as the recommended crew.
- [ ] Show fit score for each crew.
- [ ] Show travel time for each crew.
- [ ] Show hourly rate and effective cost for each crew.
- [ ] Show equipment readiness.
- [ ] Show overtime risk.
- [ ] Show disqualified or penalized reasons for non-winning crews.

### Suggested Scoring Factors

- Required certifications.
- Equipment readiness.
- Travel and SLA fit.
- Productivity factor.
- Overtime risk.
- Cost efficiency.

### Acceptance Criteria

- [ ] The user can click **Evaluate Crews**.
- [ ] Crew ranking appears after evaluation.
- [ ] Crew B is recommended.
- [ ] The result is deterministic and demo-safe.
- [ ] The recommendation looks explainable rather than arbitrary.

## Phase 6: Build Explainability Inside The Console

### Objective

Show why the AI recommendation should be trusted.

### Tasks

- [ ] Add a **Why Crew B Wins** panel.
- [ ] Show qualification gates.
- [ ] Show gas emergency certification result.
- [ ] Show equipment readiness result.
- [ ] Show travel and SLA exposure result.
- [ ] Show effective cost result.
- [ ] Show overtime risk result.
- [ ] Show customer impact protection.
- [ ] Add a score breakdown table.
- [ ] Add a planner-facing explanation in plain English.

### Suggested Planner Explanation

> Recommend Crew B because it is fully qualified for gas emergency response, already carries the required equipment, reaches the site inside the SLA window, and produces the lowest effective cost despite not having the lowest hourly rate.

### Acceptance Criteria

- [ ] The user can understand why Crew B wins.
- [ ] The user can understand why other crews did not win.
- [ ] The recommendation is transparent and defensible.
- [ ] The explanation connects safety, cost, travel, equipment, and SLA factors.

## Phase 7: Add Assignment Confirmation And ROI Impact

### Objective

Close the loop from recommendation to business value.

### Tasks

- [ ] Add an **Assign Crew B** button.
- [ ] Change the selected work order status after assignment.
- [ ] Show assigned crew details.
- [ ] Show ETA improvement.
- [ ] Show overtime avoided.
- [ ] Show travel reduction.
- [ ] Show effective cost savings.
- [ ] Show SLA risk reduction.
- [ ] Show customer impact protected.
- [ ] Add a **Return to Executive Close** button.
- [ ] Add optional buttons for **Explain the Recommendation**, **View Architecture**, and **Restart Interactive Demo**.

### Acceptance Criteria

- [ ] The user can confirm the recommended assignment.
- [ ] The work order visibly changes state after assignment.
- [ ] The console shows measurable business impact.
- [ ] The user can return to ROI or the executive close.

## Phase 8: Add Presentation Mode And Console Mode Controls

### Objective

Allow the app to be shown as either a guided presentation or a standalone product-style console.

### Tasks

- [ ] Add a mode concept such as `presentation` and `console`.
- [ ] Support a URL query pattern such as `/operations-console?mode=console` if practical.
- [ ] Add **Exit Presentation Mode** to reduce slide-like framing.
- [ ] Add **Return to Guided Presentation** if presentation mode is off.
- [ ] Ensure demo controls remain accessible in both modes.

### Acceptance Criteria

- [ ] The console can be shown as part of the guided presentation.
- [ ] The console can be shown as a standalone operations app.
- [ ] The presenter can move between modes without disrupting the live demo.

## Phase 9: Polish, Testing, Screenshots, And Rehearsal

### Objective

Make the demo stable, polished, and presentation-ready.

### Tasks

- [ ] Improve layout spacing and visual hierarchy.
- [ ] Tighten button labels.
- [ ] Confirm responsive layout on presentation screen size.
- [ ] Run TypeScript/build checks.
- [ ] Capture screenshots of key states.
- [ ] Prepare a fallback screenshot path in case the live map has an issue.
- [ ] Rehearse the live path.
- [ ] Prepare a short talk track for each major step.

### Acceptance Criteria

- [ ] `npm run build` succeeds.
- [ ] The main live demo path works without console errors.
- [ ] Screenshots are available as backup.
- [ ] The presenter can complete the demo smoothly within the available time.

## Four-Day Delivery Schedule

### Day 1: Navigation And Console Shell

- [x] Add `/operations-console` route.
- [x] Create NorthStar Operations Console page.
- [x] Add **Launch Interactive Demo** buttons.
- [x] Add Demo Controls menu.
- [x] Add workflow stepper.

**Success target:** The audience can clearly move from presentation mode into interactive demo mode.

### Day 2: Work Order, Map, And Crew Data

- [ ] Add selectable work orders.
- [ ] Highlight the gas leak emergency scenario.
- [ ] Add map or field context.
- [ ] Centralize crew and work order data.

**Success target:** The console feels like a utility operations screen, not a static slide.

### Day 3: Recommendation, Explainability, And Assignment

- [ ] Add **Evaluate Crews** action.
- [ ] Rank candidate crews.
- [ ] Recommend Crew B.
- [ ] Add explainability details.
- [ ] Add **Assign Crew B** action.

**Success target:** The demo proves the product value through an interactive workflow.

### Day 4: ROI, Polish, Testing, And Rehearsal

- [ ] Add business impact panel.
- [ ] Add return-to-presentation flow.
- [ ] Polish UI.
- [ ] Run build.
- [ ] Capture screenshots.
- [ ] Rehearse the live path.

**Success target:** The demo is stable, polished, and ready for the presentation.

## Live Demo Script

### Opening

> I will start with a short business framing, then switch into the NorthStar Operations Console to show the workflow as a dispatcher or operations leader would experience it.

### Transition At AI Crew Recommendation

> This is the decision we want to make explainable: not just who is cheapest or closest, but who is qualified, equipped, available, and lowest effective cost. Let us launch the interactive demo.

Click:

> **Launch Interactive Demo**

### In NorthStar Operations Console

> We are looking at an emergency gas leak work order near a hospital corridor. The console evaluates the work requirements, crew qualifications, equipment readiness, travel time, overtime risk, and productivity history.

Click:

> **Evaluate Crews**

### Recommendation Moment

> Crew B is recommended. Notice that it is not simply the lowest hourly rate. It wins because it is fully qualified, has the right equipment already assigned, can arrive inside the SLA window, and produces the lowest effective cost.

Click:

> **Assign Crew B**

### Close

> Now I will return to the executive close and show how this scales into measurable business value.

Click:

> **Return to Executive Close**

## Final Readiness Checklist

- [ ] Presentation opening is concise.
- [x] AI Crew Recommendation has **Launch Interactive Demo**.
- [x] NorthStar Operations Console opens correctly.
- [ ] Work order selection works.
- [ ] Map or field context is visible.
- [ ] Crew evaluation works.
- [ ] Crew B recommendation appears.
- [ ] Explanation is clear.
- [ ] Assignment confirmation works.
- [ ] ROI/business impact is visible.
- [x] Return to presentation works.
- [ ] Build passes.
- [ ] Screenshots are captured.
- [ ] Live talk track is rehearsed.
