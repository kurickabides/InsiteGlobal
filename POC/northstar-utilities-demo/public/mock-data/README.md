<!--
================================================
File: NorthStar Mock Data README
Description: Documents the static mock data used by the NorthStar Utilities presentation demo.
Author: NimbusCore.OpenAI
Architect: Chad Martin
Company: InsiteGlobal
Filename: README.md
Type: Markdown documentation file
================================================
-->

# NorthStar Utilities Mock Data

This folder contains static JSON and GeoJSON files used by the NorthStar Utilities presentation demo. The data is synthetic and organized around two presentation stories:

1. **Gas Leak Emergency** — a central gas zone leak investigation where the recommended crew wins on certification, equipment, productivity, proximity, and performance-adjusted cost.
2. **Power Branch Outage** — a tree limb falls on a main electric feed and knocks out a small branch serving 27 customers.

The files are intentionally small, internally linked, and browser-fetchable from `/mock-data/<filename>`.

## Primary story files

- `northstar-demo-manifest.json`
- `dashboard-kpis.json`
- `roi-summary.json`
- `work-orders.json`
- `crew-recommendations.json`
- `simulation-routes.json`

## Map files

- `service-areas.geojson`
- `electric-network.geojson`
- `gas-network.geojson`
- `customers.geojson`

## Workforce reference files

- `utility-domains.json`
- `skills.json`
- `work-types.json`
- `equipment-types.json`
- `equipment.json`
- `rate-cards.json`
- `skill-rates.json`
- `users.json`
- `user-skills.json`
- `user-performance.json`
- `crews.json`
- `crew-members.json`
- `crew-equipment.json`
- `work-assignments.json`
