# NorthStar Utilities Workforce Mock Data Plan

## Purpose

This document defines a practical mock data strategy for the NorthStar Utilities Workforce / Labor Intelligence demo. The goal is to create realistic utility workforce data that supports both **Gas** and **Electric / Power** operations while demonstrating labor optimization, crew recommendations, performance-adjusted cost, rate cards, skills, certifications, availability, geography, and explainable AI recommendations.

The mock data should help answer this business question:

> Are we assigning utility work to the best qualified crew when we consider skill, certification, location, labor rate, overtime risk, availability, and actual worker performance?

The demo should prove that the cheapest hourly rate is not always the cheapest total assignment.

---

## 1. Core Demo Story

The workforce model should support a realistic planning scenario where multiple crews are available for a work order, but each has different tradeoffs.

| Crew | Rate | Performance | Travel | Overtime Risk | Result |
|---|---:|---:|---:|---:|---|
| Crew A | $95/hr | 0.85 | 12 miles | Low | Good |
| Crew B | $78/hr | 1.35 | 24 miles | Low | Best value |
| Crew C | $70/hr | 0.60 | 5 miles | High | Looks cheap, but slower |
| Crew D | $110/hr | 1.10 | 3 miles | Low | Best for emergency only |

### Effective Labor Cost Formula

```text
Effective Labor Cost =
  Hourly Rate
  × Estimated Hours
  ÷ Performance Factor
  + Travel Cost
  + Overtime Premium
```

A worker or crew with a higher hourly rate may still be cheaper if they complete work faster, avoid overtime, or are better positioned geographically.

---

## 2. Mock Data Domains

The mock dataset should be generated in logical groups instead of random isolated tables.

Recommended domains:

1. Workforce / People
2. Skills
3. Certifications
4. Rate Cards
5. Crews
6. Crew Members
7. Equipment
8. Yards / Service Centers
9. Assets
10. Work Types
11. Work Orders
12. Crew Candidate Recommendations
13. Assignments
14. Recommendation Audit / Explainability

---

## 3. Workforce / People

This is the base worker table. Each worker should have discipline, cost, skill, availability, and performance data.

### Suggested Fields

| Field | Example |
|---|---|
| WorkerID | WKR-1001 |
| FirstName | Marcus |
| LastName | Reed |
| EmployeeType | Union, Contractor, Supervisor |
| UtilityDiscipline | Electric, Gas, Shared |
| HomeYardID | YARD-01 |
| BaseHourlyRate | 58.50 |
| OvertimeRate | 87.75 |
| PerformanceFactor | 1.18 |
| AvailabilityStatus | Available, Assigned, PTO, Training |
| SeniorityLevel | Apprentice, Journeyman, Lead, Supervisor |
| SafetyScore | 94 |
| QualityScore | 91 |
| AvgCompletionFactor | 1.12 |
| ActiveFlag | 1 |

### Performance Factor Meaning

| PerformanceFactor | Meaning |
|---:|---|
| 0.75 | Slower than expected |
| 1.00 | Normal productivity |
| 1.25 | 25% faster than expected |
| 1.50 | Very high performer |

This enables the recommendation engine to explain why a higher-rate worker may still produce the lowest total cost.

Example:

> Crew E is not the lowest hourly rate, but based on historical completion speed, it has the lowest estimated total cost.

---

## 4. Skills Lookup

Skills should support Electric, Gas, and Shared utility work.

| SkillID | SkillName | Discipline | SkillCategory |
|---|---|---|---|
| SK-ELEC-001 | Overhead Line Repair | Electric | Distribution |
| SK-ELEC-002 | Underground Cable Repair | Electric | Underground |
| SK-ELEC-003 | Transformer Replacement | Electric | Equipment |
| SK-ELEC-004 | Vegetation Clearance | Electric | Field Support |
| SK-GAS-001 | Gas Leak Investigation | Gas | Emergency |
| SK-GAS-002 | Service Line Installation | Gas | Construction |
| SK-GAS-003 | Corrosion Inspection | Gas | Compliance |
| SK-GAS-004 | Regulator Maintenance | Gas | Pressure |
| SK-SHARED-001 | Safety Inspection | Shared | Safety |
| SK-SHARED-002 | QA/QC Inspection | Shared | Quality |
| SK-SHARED-003 | Traffic Control | Shared | Field Support |
| SK-SHARED-004 | Excavation / Trenching | Shared | Construction |
| SK-SHARED-005 | Damage Assessment | Shared | Storm |
| SK-SHARED-006 | GIS Field Verification | Shared | Mapping |
| SK-SHARED-007 | Customer Notification | Shared | Customer |
| SK-SHARED-008 | Drone / Photo Inspection | Shared | Inspection |

### Recommended Shared Skills

These shared skills help demonstrate cross-discipline workforce optimization.

| Shared Skill | Why It Matters |
|---|---|
| Safety Inspection | Needed across gas and electric |
| QA/QC | Works for construction, repair, and compliance |
| Traffic Control | Common to road and field work |
| Excavation / Trenching | Gas service and underground electric |
| Damage Assessment | Storms, outages, and emergency events |
| GIS Field Verification | Asset validation for both networks |
| Customer Notification | Planned outages and gas shutdowns |
| Environmental / Spill Response | Relevant to both disciplines |
| Drone / Photo Inspection | Poles, substations, pipelines, regulator stations |
| Permitting / ROW Coordination | Construction and maintenance |

---

## 5. Certifications

Skills represent what someone can do. Certifications represent what they are allowed or qualified to do safely, legally, or by company policy.

| CertificationID | CertificationName | Discipline | ExpirationRequired |
|---|---|---|---|
| CERT-ELEC-001 | OSHA 10 Electric Utility | Electric | Yes |
| CERT-ELEC-002 | Bucket Truck Qualified | Electric | Yes |
| CERT-ELEC-003 | Hot Work Qualified | Electric | Yes |
| CERT-GAS-001 | Gas Operator Qualification | Gas | Yes |
| CERT-GAS-002 | Leak Survey Qualified | Gas | Yes |
| CERT-GAS-003 | Plastic Fusion Certified | Gas | Yes |
| CERT-SHARED-001 | Confined Space | Shared | Yes |
| CERT-SHARED-002 | First Aid / CPR | Shared | Yes |
| CERT-SHARED-003 | Traffic Control Certified | Shared | Yes |
| CERT-SHARED-004 | Excavation Safety | Shared | Yes |

### Certification Demo Value

Certifications create realistic exclusion logic.

Example:

> Crew 12 has the lowest cost, but is excluded because its Gas Operator Qualification expires before the scheduled work date.

This gives the demo strong explainability.

---

## 6. Rate Cards

Rate cards should be separate from workers because rates can vary by skill, labor class, vendor, shift, union, and work type.

### Rate Drivers

| Rate Driver | Example |
|---|---|
| Skill | Underground cable repair costs more than inspection |
| Labor Class | Apprentice, Journeyman, Lead |
| Union Local | Local 101, Local 204 |
| Vendor | Internal, contractor company |
| Work Type | Emergency, planned, compliance |
| Shift | Regular, night, weekend |
| Discipline | Electric, Gas, Shared |

### Suggested Fields

| Field | Example |
|---|---|
| RateCardID | RC-1001 |
| SkillID | SK-GAS-001 |
| LaborClass | Journeyman |
| RegularRate | 72.00 |
| OvertimeRate | 108.00 |
| DoubleTimeRate | 144.00 |
| MinimumCalloutHours | 4 |
| EffectiveStartDate | 2026-01-01 |
| EffectiveEndDate | 2026-12-31 |
| VendorID | VEND-INTERNAL |

---

## 7. Crews

A crew is made up of people, equipment, skills, shift availability, and location.

### Suggested Fields

| Field | Example |
|---|---|
| CrewID | CREW-E-101 |
| CrewName | Electric Trouble Crew 101 |
| Discipline | Electric |
| HomeYardID | YARD-01 |
| CrewType | Trouble, Line, Gas Leak, Inspector |
| ShiftStart | 07:00 |
| ShiftEnd | 15:30 |
| CrewStatus | Available |
| CurrentLatitude | 40.733 |
| CurrentLongitude | -74.102 |
| CrewPerformanceFactor | 1.12 |
| MaxDailyHours | 10 |

### Electric Crew Types

| Crew Type | Suggested Count |
|---|---:|
| Trouble Crew | 8 |
| Overhead Line Crew | 6 |
| Underground Cable Crew | 5 |
| Transformer Crew | 4 |
| Vegetation Crew | 4 |
| Substation Crew | 3 |
| Meter Crew | 4 |
| Storm Assessment Crew | 5 |

### Gas Crew Types

| Crew Type | Suggested Count |
|---|---:|
| Leak Investigation Crew | 6 |
| Gas Emergency Crew | 5 |
| Service Installation Crew | 4 |
| Corrosion Inspection Crew | 4 |
| Regulator Maintenance Crew | 3 |
| Pipeline Patrol Crew | 3 |
| Meter / Service Crew | 4 |

### Shared Crew Types

| Crew Type | Suggested Count |
|---|---:|
| Safety Inspector | 4 |
| QA/QC Inspector | 4 |
| Traffic Control Crew | 5 |
| Excavation Crew | 5 |
| GIS Field Verification Crew | 3 |
| Damage Assessment Crew | 4 |

---

## 8. Work Orders

Work orders are where the demo becomes meaningful. Each work order should contain discipline, work type, location, priority, skill requirement, certification requirement, estimated hours, and assignment data.

### Suggested Fields

| Field | Example |
|---|---|
| WorkOrderID | WO-2026-10001 |
| WorkTypeID | WT-GAS-LEAK-01 |
| Discipline | Gas |
| Priority | Emergency |
| Status | Open |
| RequiredSkillID | SK-GAS-001 |
| RequiredCertificationID | CERT-GAS-001 |
| EstimatedHours | 3.5 |
| ScheduledStart | 2026-07-06 09:00 |
| DueBy | 2026-07-06 12:00 |
| Latitude | 40.718 |
| Longitude | -74.020 |
| CustomerImpactCount | 42 |
| AssetID | GAS-MAIN-2049 |
| ComplexityScore | 3 |
| RiskScore | 8 |
| AssignedCrewID | CREW-G-204 |
| RecommendedCrewID | CREW-G-201 |
| AssignmentReason | Historical/manual assignment |
| RecommendationReason | Lower total effective cost |

### Electric Work Types

| Work Type | Priority Mix |
|---|---|
| Outage Investigation | Emergency |
| Transformer Replacement | High |
| Downed Wire | Emergency |
| Underground Cable Fault | High |
| Pole Inspection | Normal |
| Vegetation Clearance | Normal |
| Meter Replacement | Normal |
| Storm Damage Assessment | High / Emergency |
| Substation Inspection | Normal |
| Feeder Patrol | Normal |

### Gas Work Types

| Work Type | Priority Mix |
|---|---|
| Gas Leak Investigation | Emergency |
| Odor Complaint | Emergency |
| Regulator Maintenance | High / Normal |
| Corrosion Inspection | Compliance |
| Service Line Installation | Planned |
| Meter Set / Turn On | Planned |
| Valve Inspection | Compliance |
| Pipeline Patrol | Compliance |
| Emergency Shutoff | Emergency |
| Main Repair | High |

---

## 9. Recommendation Candidate Table

The candidate table is one of the most important tables in the mock model. It stores multiple possible crews for every work order and explains why each crew was ranked, selected, or excluded.

### Suggested Fields

| Field | Example |
|---|---|
| CandidateID | CAND-10001 |
| WorkOrderID | WO-2026-10001 |
| CrewID | CREW-G-201 |
| IsQualified | 1 |
| HasRequiredSkill | 1 |
| HasCertification | 1 |
| DistanceMiles | 8.4 |
| TravelMinutes | 22 |
| EstimatedLaborCost | 336.00 |
| EstimatedTravelCost | 48.00 |
| OvertimeCost | 0.00 |
| PerformanceAdjustedHours | 2.9 |
| TotalEstimatedCost | 384.00 |
| RecommendationRank | 1 |
| ExclusionReason | NULL |

### Example Candidate Results

| Crew | Qualified | Distance | Rate | Performance | Total Cost | Rank |
|---|---:|---:|---:|---:|---:|---:|
| CREW-G-201 | Yes | 8 mi | $76 | 1.20 | $384 | 1 |
| CREW-G-204 | Yes | 4 mi | $92 | 0.90 | $522 | 2 |
| CREW-S-301 | No | 6 mi | $65 | 1.10 | N/A | Excluded |
| CREW-G-209 | Yes | 21 mi | $70 | 1.00 | $489 | 3 |

Example explanation:

> Recommended Crew G-201 because it is qualified, available, has no overtime exposure, and has the lowest performance-adjusted cost.

---

## 10. Recommended Mock Data Volume

For the first version, the dataset should be large enough to feel real but small enough to debug.

| Table | Suggested Count |
|---|---:|
| Yards / Service Centers | 6-10 |
| Workers | 150-250 |
| Crews | 45-70 |
| Skills | 25-40 |
| Certifications | 20-35 |
| Rate Cards | 100-200 |
| Assets | 500-2,000 |
| Work Orders | 1,000-3,000 |
| Crew Candidate Scores | 5,000-15,000 |
| Historical Assignments | 1,000-5,000 |
| Schedule Blocks | 2,000-5,000 |

### Recommended First Demo Dataset

```text
10 yards
200 workers
60 crews
35 skills
30 certifications
1,500 work orders
7,500 candidate crew recommendation rows
```

---

## 11. Mock Data Patterns to Include

The data should not be too clean. The value of the demo comes from controlled imperfections.

### Pattern 1: Higher-Cost Crew Was Assigned

Create 20-30% of historical assignments where a lower-cost qualified crew was available.

Example:

```text
Assigned Crew Cost:     $1,240
Recommended Crew Cost:  $910
Avoidable Cost:         $330
```

This supports the KPI:

> Avoidable Labor Cost

### Pattern 2: Cheap Crew Is Not Always Best

Create cases where the lowest hourly rate is not selected because of:

- Low performance factor
- Longer travel distance
- Overtime risk
- Missing certification
- Shift ending soon
- Equipment unavailable
- Crew already assigned nearby but at capacity

This supports performance-adjusted optimization.

### Pattern 3: Shared Crews Reduce Bottlenecks

Create work orders where shared skills help both Gas and Electric.

| Work Order | Discipline | Needed Skill | Recommended Crew |
|---|---|---|---|
| WO-10021 | Electric | Traffic Control | Shared Crew |
| WO-10022 | Gas | Excavation | Shared Crew |
| WO-10023 | Electric | Safety Inspection | Shared Inspector |
| WO-10024 | Gas | QA/QC | Shared Inspector |

### Pattern 4: Emergency Overrides Cost

For emergency work, the selected crew should sometimes be more expensive but closer or better certified.

Example:

```text
Reason:
Emergency job. Closest qualified gas emergency crew selected despite higher labor rate.
```

### Pattern 5: Compliance Work Favors Certification

For gas corrosion inspections or electric pole inspections, certification and schedule matter more than emergency response speed.

Example:

```text
Crew excluded because corrosion certification expires before scheduled date.
```

### Pattern 6: Geography Matters

Place yards and work orders in geographic clusters.

| Area | Use |
|---|---|
| Downtown | Dense emergency work |
| North District | Electric overhead |
| South District | Gas service installations |
| Industrial Zone | Regulators, substations, high-risk assets |
| Suburban Area | Vegetation, meters, service work |
| Coastal / Flood Zone | Storm damage and corrosion |

---

## 12. Fields for AI Recommendation

The AI / optimization engine should calculate and expose these fields.

| Field | Purpose |
|---|---|
| IsQualified | Hard filter |
| SkillMatchScore | Measures fit |
| CertificationMatchScore | Measures compliance |
| DistanceMiles | Travel cost |
| TravelMinutes | Schedule impact |
| AvailabilityScore | Dispatch readiness |
| PerformanceFactor | Speed adjustment |
| LaborRate | Cost basis |
| OvertimeRiskScore | Cost / risk |
| EquipmentMatchScore | Bucket truck, gas detector, excavator |
| SafetyScore | Risk guardrail |
| QualityScore | Rework risk |
| TotalEstimatedCost | Main ranking |
| RecommendationRank | Output |
| ExplainabilityText | UI display |

---

## 13. Recommendation Scoring Formula

For the mock demo, keep the logic simple and explainable.

```text
PerformanceAdjustedHours =
  EstimatedHours / CrewPerformanceFactor

LaborCost =
  PerformanceAdjustedHours × CrewBlendedHourlyRate

TravelCost =
  TravelMinutes × TravelCostPerMinute

OvertimeCost =
  ExpectedOvertimeHours × OvertimeRate

RiskPenalty =
  RiskScore × SafetyPenaltyFactor

TotalEstimatedCost =
  LaborCost + TravelCost + OvertimeCost + RiskPenalty
```

### Crew Exclusion Logic

Exclude crews where:

```text
IsAvailable = false
OR RequiredSkill missing
OR RequiredCertification missing
OR Certification expired
OR RequiredEquipment missing
OR Crew discipline incompatible
```

---

## 14. Mock Data Generation Sequence

Generate the dataset in this order.

### Step 1: Create Lookup Tables

```text
UtilityDisciplines
SkillCategories
Skills
Certifications
LaborClasses
CrewTypes
WorkTypes
PriorityLevels
EquipmentTypes
Yards
ServiceTerritories
RateCards
```

### Step 2: Create Workers

Suggested distribution:

```text
60% Electric
30% Gas
10% Shared
```

Example worker count:

| Discipline | Workers |
|---|---:|
| Electric | 120 |
| Gas | 60 |
| Shared | 20 |
| Supervisors | 10 |
| QA / Safety | 10 |

### Step 3: Assign Skills and Certifications

Each worker should have 2-6 skills.

Rules:

```text
Electric workers get mostly electric skills.
Gas workers get mostly gas skills.
Shared workers get shared skills.
Senior workers get more certifications.
Apprentices get fewer certifications.
Some certifications should be expired.
```

Include 5-10% expired certifications to create realistic exceptions.

### Step 4: Build Crews

Each crew should have:

```text
2-5 workers
1 lead
1 home yard
1 or more equipment items
1 crew performance factor
```

Crew performance can be the average of member performance, weighted toward the crew lead.

### Step 5: Generate Work Orders

Create work orders across 90-180 days.

Suggested work order mix:

| Category | Percent |
|---|---:|
| Planned maintenance | 35% |
| Compliance inspection | 20% |
| Emergency response | 15% |
| Construction / service | 15% |
| Storm / outage | 10% |
| QA / rework | 5% |

### Step 6: Generate Candidate Crews

For every work order, generate 3-8 candidate crews.

Each candidate should include:

```text
Qualified / not qualified
Distance
Travel time
Labor cost
Overtime risk
Performance-adjusted cost
Rank
Exclusion reason
```

### Step 7: Create Historical Assignments

For each work order, pick one assigned crew using this distribution:

```text
70% assigned reasonably
20% assigned to a higher-cost qualified crew
5% assigned to an unqualified or missing-certification crew
5% assigned to emergency override crew
```

This gives the AI realistic exceptions to discover.

---

## 15. Recommended Table List

| Table | Purpose |
|---|---|
| WorkforceWorker | Individual employees / contractors |
| WorkforceCrew | Crew header |
| WorkforceCrewMember | Workers assigned to crews |
| Skill | Skill lookup |
| Certification | Certification lookup |
| WorkerSkill | Worker-to-skill relationship |
| WorkerCertification | Worker-to-certification relationship |
| RateCard | Skill / class / vendor rates |
| Yard | Crew home bases |
| Equipment | Trucks, tools, gas detectors, excavators |
| CrewEquipment | Equipment assigned to crew |
| Asset | Electric / gas assets |
| WorkType | Type of work |
| WorkOrder | Jobs to assign |
| CrewSchedule | Availability and shift blocks |
| WorkOrderCrewCandidate | AI recommendation options |
| WorkOrderAssignment | Actual / historical assignment |
| RecommendationAudit | Explainability and scoring |

---

## 16. Demo KPIs

The mock data should support these KPIs.

| KPI | Calculation |
|---|---|
| Active Work Orders | Count open work orders |
| Available Crews | Count available crews |
| Emergency Events | Count emergency priority jobs |
| Labor Savings | Assigned cost minus recommended cost |
| Overtime Avoided | Assigned overtime minus recommended overtime |
| Travel Reduction | Assigned travel miles minus recommended travel miles |
| Customer Impact | Sum impacted customers |
| Qualification Exceptions | Assigned crew missing skill / certification |
| Cross-Discipline Utilization | Shared crews used on gas / electric work |
| Recommendation Acceptance | Planner accepted recommendation rate |

---

## 17. First Mock Dataset Recommendation

Create this dataset first:

```text
NorthStar Utilities Mock Dataset v1

6 service yards
200 workers
60 crews
35 skills
25 certifications
125 rate card rows
800 electric assets
500 gas assets
1,500 work orders
7,500 crew candidate records
1,500 assignment records
```

Include these intentional data conditions:

```text
300 avoidable-cost assignments
75 qualification exceptions
150 overtime-risk cases
200 emergency override cases
250 shared-skill opportunities
```

---

## 18. Demo Questions the Data Should Answer

The mock dataset should support natural questions such as:

```text
Which jobs were assigned to higher-cost crews even though lower-cost qualified crews were available?

Show me gas leak jobs where the assigned crew was not the lowest total-cost qualified option.

Which shared crews helped reduce electric or gas backlog?

Which work orders had overtime risk that could have been avoided?

Which crews are high cost but still recommended because they complete work faster?

Which crews were excluded because of missing or expired certifications?

Which districts have the most avoidable labor cost?

Which type of work produces the most overtime exposure?
```

---

## 19. Recommended Output Files

Create the mock data as SQL seed scripts plus export files.

| Output | Why |
|---|---|
| SQL seed data | Good for database-backed app |
| GeoJSON | Good for Esri map layers |
| JSON | Good for React mock API |
| CSV | Good for Power BI or quick review |

### Suggested Script Files

```text
01_Lookups.sql
02_Yards.sql
03_Workers.sql
04_Skills_Certs.sql
05_Crews.sql
06_RateCards.sql
07_WorkOrders.sql
08_CrewCandidates.sql
09_Assignments.sql
```

---

## 20. Recommended Next Step

Start by creating the lookup tables and seed data first. Once the lookup data is stable, generate workers, skills, certifications, crews, and work orders.

The most important early deliverable is the **WorkOrderCrewCandidate** table because it drives the explainable AI recommendation story.

