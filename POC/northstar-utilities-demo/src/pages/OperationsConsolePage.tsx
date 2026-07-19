// ================================================
// File: Operations Console Page
// Description: Hosts the NorthStar interactive proof-of-concept console hub experience.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: OperationsConsolePage.tsx
// Type: React TypeScript page component file
// ================================================

import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import BoltIcon from "@mui/icons-material/Bolt";
import BuildIcon from "@mui/icons-material/Build";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EngineeringIcon from "@mui/icons-material/Engineering";
import FilterListIcon from "@mui/icons-material/FilterList";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MapIcon from "@mui/icons-material/Map";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ReplayIcon from "@mui/icons-material/Replay";
import SearchIcon from "@mui/icons-material/Search";
import SummarizeIcon from "@mui/icons-material/Summarize";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import WorkIcon from "@mui/icons-material/Work";
import { MouseEvent, ReactElement, useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { EsriMapViewer } from "../components/esri/EsriMapViewer";
import { EsriLayerConfig, EsriMarkerConfig } from "../components/esri/types";
import { generatedCrews, generatedWorkOrders } from "../data/generatedOperationsData";

type HubKey = "dashboard" | "workOrders" | "workforce" | "dispatch" | "reports";
type TaskKey = "emergency" | "crews" | "assignment" | "impact";
type WorkOrderHealth = "onTrack" | "belowEfficiency" | "dangerZone";

interface WorkOrder {
  id: string;
  type: string;
  domain: "Gas" | "Electric";
  priority: "Emergency" | "Critical" | "High" | "Routine";
  status: string;
  district: string;
  sla: string;
  impact: string;
  crew: string;
  assignmentState: "assigned" | "evaluated" | "unevaluated";
  assignedAt?: string;
  skills: string[];
  equipment: string[];
  longitude: number;
  latitude: number;
}

interface CrewOption {
  name: string;
  fit: number;
  eta: string;
  district: string;
  status: string;
  crewType: string;
  vehicleIcon: "truck" | "bucket" | "van" | "patrol";
  currentAssignment: string;
  certifications: string[];
  equipment: string;
  overtime: string;
  hourly: string;
  effectiveCost: string;
  longitude: number;
  latitude: number;
  strengths: string[];
  penalties: string[];
}

const generatedConsoleWorkOrders = generatedWorkOrders.map((order) => ({ ...order })) as unknown as WorkOrder[];
const initialCrews = generatedCrews.map((crew) => ({ ...crew })) as unknown as CrewOption[];

function resolveInitialCrewName(order: WorkOrder, workOrderIndex: number): string {
  const hasExistingCrew = initialCrews.some((crew) => crew.name === order.crew);

  if (hasExistingCrew || order.crew === "Pending review") {
    return order.crew;
  }

  const candidates = getRankedCandidateCrews(order, initialCrews);
  const fallbackIndex = candidates.length ? workOrderIndex % candidates.length : 0;

  return candidates[fallbackIndex]?.name ?? order.crew;
}

function normalizeWorkOrderCrewRelationships(workOrders: WorkOrder[]): WorkOrder[] {
  return workOrders.map((order, workOrderIndex) => ({
    ...order,
    crew: resolveInitialCrewName(order, workOrderIndex)
  }));
}

const initialWorkOrders = normalizeWorkOrderCrewRelationships(generatedConsoleWorkOrders);

const defaultWorkOrderId = initialWorkOrders.find((order) => order.priority === "Emergency" && order.assignmentState !== "assigned")?.id ?? initialWorkOrders[0].id;
const defaultCrewName = initialCrews.find((crew) => crew.status === "Available")?.name ?? initialCrews[0].name;

const workflowStorageKey = "northstar-operations-workflow-state";

interface PersistedWorkflowState {
  workOrders: WorkOrder[];
  crews: CrewOption[];
}

function normalizePersistedWorkflowState(state: PersistedWorkflowState): PersistedWorkflowState {
  return {
    ...state,
    workOrders: normalizeWorkOrderCrewRelationships(state.workOrders)
  };
}

const consoleHubItems: { key: HubKey; label: string; icon: JSX.Element; metric: string }[] = [
  { key: "dashboard", label: "Executive Dashboard", icon: <DashboardIcon />, metric: "Live operating picture" },
  { key: "workOrders", label: "Work Orders", icon: <WorkIcon />, metric: "Dispatch queue" },
  { key: "workforce", label: "Workforce", icon: <PeopleIcon />, metric: "Crew roster" },
  { key: "dispatch", label: "Dispatch", icon: <EngineeringIcon />, metric: "Crew allocation" },
  { key: "reports", label: "Report Center", icon: <SummarizeIcon />, metric: "Impact and audit" }
];

const mapLayers: EsriLayerConfig[] = [
  { id: "gas-network", title: "Gas Network", type: "geojson", url: "/mock-data/gas-network.geojson", visible: true, opacity: 0.8 },
  { id: "electric-network", title: "Electric Network", type: "geojson", url: "/mock-data/electric-network.geojson", visible: true, opacity: 0.55 },
  { id: "crew-locations", title: "Crew Locations", type: "geojson", url: "/mock-data/crew-locations.geojson", visible: true, opacity: 0.9 }
];
const dispatchMapDefaultZoom = 13;
const dispatchMapSelectedZoom = 18;

function loadPersistedWorkflowState(): PersistedWorkflowState {
  if (typeof window === "undefined") {
    return { workOrders: initialWorkOrders, crews: initialCrews };
  }

  try {
    const rawValue = window.localStorage.getItem(workflowStorageKey);
    if (!rawValue) {
      return { workOrders: initialWorkOrders, crews: initialCrews };
    }

    const parsedValue = JSON.parse(rawValue) as Partial<PersistedWorkflowState>;
    return normalizePersistedWorkflowState({
      workOrders: parsedValue.workOrders?.length ? parsedValue.workOrders : initialWorkOrders,
      crews: parsedValue.crews?.length ? parsedValue.crews : initialCrews
    });
  } catch {
    return { workOrders: initialWorkOrders, crews: initialCrews };
  }
}

const currentTasks: { key: TaskKey; label: string; detail: string; status: string; hub: HubKey }[] = [
  { key: "emergency", label: "Active emergency work order", detail: "Open the highest-priority gas or power order and review field context.", status: "Next", hub: "workOrders" },
  { key: "crews", label: "Evaluate candidate crews", detail: "Run qualification and effective-cost comparison.", status: "Ready", hub: "dispatch" },
  { key: "assignment", label: "Confirm dispatch assignment", detail: "Assign the recommended crew and update response status.", status: "Queued", hub: "dispatch" },
  { key: "impact", label: "Review business impact", detail: "Show SLA, overtime, travel, and customer impact.", status: "Queued", hub: "reports" }
];

function priorityColor(priority: WorkOrder["priority"]): "error" | "warning" | "primary" | "default" {
  if (priority === "Emergency") {
    return "error";
  }

  if (priority === "Critical" || priority === "High") {
    return "warning";
  }

  return "default";
}

function assignmentLabel(state: WorkOrder["assignmentState"]): string {
  if (state === "assigned") {
    return "Assigned crew";
  }

  if (state === "evaluated") {
    return "Evaluated";
  }

  return "Not evaluated";
}

function parseSlaMinutes(sla: string): number {
  const hourMatch = sla.match(/(\d+)\s*hr/);
  const minuteMatch = sla.match(/(\d+)\s*min/);
  const dayMatch = sla.match(/(\d+)\s*days?/);

  if (dayMatch) {
    return Number(dayMatch[1]) * 24 * 60;
  }

  return (hourMatch ? Number(hourMatch[1]) * 60 : 0) + (minuteMatch ? Number(minuteMatch[1]) : 0);
}

function getWorkOrderHealth(order: WorkOrder): WorkOrderHealth {
  const slaMinutes = parseSlaMinutes(order.sla);

  if (
    (order.assignmentState === "unevaluated" && (order.priority === "Emergency" || order.priority === "Critical")) ||
    (order.priority === "Emergency" && slaMinutes <= 60)
  ) {
    return "dangerZone";
  }

  if (
    order.assignmentState === "unevaluated" ||
    order.status === "Ready to bundle" ||
    order.priority === "High" ||
    (order.priority === "Critical" && slaMinutes <= 120)
  ) {
    return "belowEfficiency";
  }

  return "onTrack";
}

function healthColor(health: WorkOrderHealth): "success" | "warning" | "error" {
  if (health === "dangerZone") {
    return "error";
  }

  if (health === "belowEfficiency") {
    return "warning";
  }

  return "success";
}

function vehicleLabel(icon: CrewOption["vehicleIcon"]): string {
  if (icon === "bucket") {
    return "Bucket truck";
  }

  if (icon === "van") {
    return "Service van";
  }

  if (icon === "patrol") {
    return "Patrol vehicle";
  }

  return "Utility truck";
}

function workOrderMarkerStyle(order: WorkOrder, _isSelected: boolean): Pick<EsriMarkerConfig, "color" | "outlineColor" | "shape" | "size"> {
  if (order.assignmentState === "assigned") {
    return {
      color: order.domain === "Electric" ? "#2563eb" : "#16a34a",
      outlineColor: "#ffffff",
      shape: "square",
      size: 12
    };
  }

  if (order.priority === "Emergency") {
    return {
      color: "#dc2626",
      outlineColor: "#ffffff",
      shape: "triangle",
      size: 14
    };
  }

  if (order.assignmentState === "evaluated") {
    return {
      color: "#2563eb",
      outlineColor: "#ffffff",
      shape: "diamond",
      size: 13
    };
  }

  return {
    color: "#dc2626",
    outlineColor: "#ffffff",
    shape: "triangle",
    size: 13
  };
}

function getCrewMapDomain(crew: CrewOption): "gas" | "power" {
  return crew.crewType.includes("Gas") || crew.name.includes("Gas") ? "gas" : "power";
}

function getCrewMarkerColor(crew: CrewOption): string {
  return getCrewMapDomain(crew) === "gas" ? "#facc15" : "#2563eb";
}

function getCrewMarkerOutlineColor(crew: CrewOption): string {
  return getCrewMapDomain(crew) === "gas" ? "#713f12" : "#dbeafe";
}

function getRequiredCrewFamilies(order: WorkOrder): string[] {
  if (order.domain === "Gas") {
    if (order.type.includes("Leak")) {
      return ["Gas Emergency"];
    }

    if (order.type.includes("Service")) {
      return ["Gas Construction"];
    }

    return ["Gas Maintenance", "Gas Construction"];
  }

  if (order.type.includes("Transformer") || order.type.includes("Outage") || order.type.includes("Trouble")) {
    return ["Electric Trouble", "Line Patrol"];
  }

  if (order.type.includes("Underground")) {
    return ["Underground Electric"];
  }

  if (order.type.includes("Vegetation")) {
    return ["Vegetation"];
  }

  return ["Electric Trouble", "Underground Electric", "Line Patrol"];
}

function getCandidateCrews(order: WorkOrder, crewPool: CrewOption[] = initialCrews): CrewOption[] {
  const requiredFamilies = getRequiredCrewFamilies(order);

  return crewPool
    .filter((crew) => (
      crew.status === "Available"
      && crew.equipment !== "Limited"
      && requiredFamilies.some((family) => crew.crewType.includes(family) || crew.name.includes(family))
    ))
    .sort((a, b) => {
      if (a.status === "Available" && b.status !== "Available") {
        return -1;
      }

      if (a.status !== "Available" && b.status === "Available") {
        return 1;
      }

      return b.fit - a.fit;
    });
}

function parseMinutes(value: string): number {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : 999;
}

function parseCurrency(value: string): number {
  return Number(value.replace(/[^0-9.]/g, ""));
}

interface ScheduleStep {
  label: string;
  estimateMinutes: number;
}

interface ScheduleWindowItem {
  label: string;
  meta: string;
  tone: "success" | "primary";
}

function formatClockTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = minutes / 60;
  return Number.isInteger(hours) ? `${hours} hr` : `${hours.toFixed(1)} hr`;
}

function getScheduleTemplate(order: WorkOrder): ScheduleStep[] {
  if (order.type.includes("Leak")) {
    return [
      { label: "Safety assessment", estimateMinutes: 15 },
      { label: "Leak isolation", estimateMinutes: 30 },
      { label: "Repair and restore service", estimateMinutes: 180 }
    ];
  }

  if (order.type.includes("Service Installation")) {
    return [
      { label: "Site setup and locate verification", estimateMinutes: 15 },
      { label: "Service line installation", estimateMinutes: 30 },
      { label: "Pressure test and customer relight", estimateMinutes: 120 }
    ];
  }

  if (order.type.includes("Regulator")) {
    return [
      { label: "Regulator inspection", estimateMinutes: 15 },
      { label: "Pressure adjustment", estimateMinutes: 30 },
      { label: "Compliance test and documentation", estimateMinutes: 120 }
    ];
  }

  if (order.type.includes("Corrosion")) {
    return [
      { label: "Expose and inspect asset", estimateMinutes: 15 },
      { label: "Readings and coating check", estimateMinutes: 30 },
      { label: "Mitigation repair and photos", estimateMinutes: 120 }
    ];
  }

  if (order.type.includes("Feeder")) {
    return [
      { label: "Feeder patrol and switching review", estimateMinutes: 15 },
      { label: "Fault section isolation", estimateMinutes: 30 },
      { label: "Restore branch and verify load", estimateMinutes: 180 }
    ];
  }

  if (order.type.includes("Transformer")) {
    return [
      { label: "Transformer site assessment", estimateMinutes: 15 },
      { label: "De-energize and stage replacement", estimateMinutes: 30 },
      { label: "Replace transformer and re-energize", estimateMinutes: 180 }
    ];
  }

  if (order.type.includes("Pole")) {
    return [
      { label: "Traffic and work zone setup", estimateMinutes: 15 },
      { label: "Transfer equipment and conductors", estimateMinutes: 30 },
      { label: "Set pole and complete restoration", estimateMinutes: 180 }
    ];
  }

  if (order.type.includes("Underground")) {
    return [
      { label: "Cable fault locate", estimateMinutes: 15 },
      { label: "Open vault and isolate cable", estimateMinutes: 30 },
      { label: "Splice repair and test cable", estimateMinutes: 180 }
    ];
  }

  if (order.type.includes("Vegetation")) {
    return [
      { label: "Hazard tree assessment", estimateMinutes: 15 },
      { label: "Line clearance setup", estimateMinutes: 30 },
      { label: "Cut, clear, and release circuit", estimateMinutes: 120 }
    ];
  }

  return [
    { label: "Field assessment", estimateMinutes: 15 },
    { label: "Primary work task", estimateMinutes: 30 },
    { label: "Repair and closeout", estimateMinutes: 120 }
  ];
}

function getScheduleWindowItems(order: WorkOrder, crew?: CrewOption): ScheduleWindowItem[] {
  const steps = getScheduleTemplate(order);

  if (order.assignmentState !== "assigned" || !crew) {
    return [
      { label: "Travel to job", meta: "Use selected crew ETA after assignment", tone: "success" },
      ...steps.map((step, index) => ({
        label: `${index + 1}. ${step.label}`,
        meta: `${formatDuration(step.estimateMinutes)} estimate`,
        tone: "primary" as const
      })),
      { label: "Complete", meta: `${formatDuration(steps.reduce((total, step) => total + step.estimateMinutes, 0))} field work estimate`, tone: "primary" }
    ];
  }

  const assignedAt = order.assignedAt ? new Date(order.assignedAt) : new Date();
  const travelMinutes = parseMinutes(crew.eta);
  const jobStart = addMinutes(assignedAt, travelMinutes);
  let cursor = jobStart;
  const scheduledSteps = steps.map((step, index) => {
    cursor = addMinutes(cursor, step.estimateMinutes);
    return {
      label: `${index + 1}. ${step.label}`,
      meta: formatClockTime(cursor),
      tone: "primary" as const
    };
  });

  return [
    { label: "Travel to job", meta: `${formatClockTime(assignedAt)} - ${formatClockTime(jobStart)} (${formatDuration(travelMinutes)})`, tone: "success" },
    { label: "Job starts", meta: formatClockTime(jobStart), tone: "success" },
    ...scheduledSteps,
    { label: "Complete", meta: formatClockTime(cursor), tone: "primary" }
  ];
}

interface RankedCrewOption extends CrewOption {
  decisionScore: number;
  decisionReasons: string[];
}

function getRankedCandidateCrews(order: WorkOrder, crewPool: CrewOption[] = initialCrews): RankedCrewOption[] {
  const candidates = getCandidateCrews(order, crewPool);
  const costs = candidates.map((crew) => parseCurrency(crew.effectiveCost));
  const etas = candidates.map((crew) => parseMinutes(crew.eta));
  const minCost = Math.min(...costs);
  const maxCost = Math.max(...costs);
  const minEta = Math.min(...etas);
  const maxEta = Math.max(...etas);

  return candidates
    .map((crew) => {
      const cost = parseCurrency(crew.effectiveCost);
      const eta = parseMinutes(crew.eta);
      const costScore = maxCost === minCost ? 100 : 100 - ((cost - minCost) / (maxCost - minCost)) * 100;
      const etaScore = maxEta === minEta ? 100 : 100 - ((eta - minEta) / (maxEta - minEta)) * 100;
      const availabilityScore = crew.status === "Available" ? 100 : 70;
      const equipmentScore = crew.equipment === "Ready" ? 100 : crew.equipment === "Staged" ? 85 : 65;
      const decisionScore = Math.round((crew.fit * 0.35) + (costScore * 0.3) + (etaScore * 0.2) + (availabilityScore * 0.1) + (equipmentScore * 0.05));
      const decisionReasons = [
        `${crew.fit}% skill fit for ${order.type}`,
        `${crew.effectiveCost} modeled effective cost`,
        `${crew.eta} travel ETA`,
        `${crew.equipment} equipment profile`
      ];

      return {
        ...crew,
        decisionScore,
        decisionReasons
      };
    })
    .sort((a, b) => {
      if (b.decisionScore !== a.decisionScore) {
        return b.decisionScore - a.decisionScore;
      }

      return parseCurrency(a.effectiveCost) - parseCurrency(b.effectiveCost);
    });
}

function toAssignedCrewRow(crew: CrewOption, order: WorkOrder): RankedCrewOption {
  return {
    ...crew,
    decisionScore: 100,
    decisionReasons: [
      `Assigned to ${order.id}`,
      `${crew.crewType} crew dispatched`,
      `${crew.currentAssignment}`,
      `${crew.equipment} equipment profile`
    ]
  };
}

function getTaskMapTitle(activeTask: TaskKey, selectedOrder: WorkOrder): string {
  if (activeTask === "crews") {
    return `Crew proximity for ${selectedOrder.id}`;
  }

  if (activeTask === "assignment") {
    return "Dispatch route preview for recommended crew";
  }

  if (activeTask === "impact") {
    return `Customer and SLA impact for ${selectedOrder.id}`;
  }

  return `Field context for ${selectedOrder.id}`;
}

function getTaskMapMarkers(activeTask: TaskKey, selectedOrder: WorkOrder, showCrews = true, workOrderPool: WorkOrder[] = initialWorkOrders, crewPool: CrewOption[] = initialCrews): EsriMarkerConfig[] {
  const candidateCrewNames = new Set(getCandidateCrews(selectedOrder, crewPool).map((crew) => crew.name));
  const workOrderMarkers: EsriMarkerConfig[] = workOrderPool.map((order) => ({
    id: order.id,
    label: `${order.id} - ${assignmentLabel(order.assignmentState)}`,
    longitude: order.longitude,
    latitude: order.latitude,
    ...workOrderMarkerStyle(order, order.id === selectedOrder.id),
    popupContent: `${order.type}<br/>${order.priority} priority<br/>${assignmentLabel(order.assignmentState)}<br/>${order.crew}`
  }));

  const visibleCrews = showCrews
    ? crewPool.filter((crew) => Number.isFinite(crew.longitude) && Number.isFinite(crew.latitude))
    : [];
  const crewMarkers: EsriMarkerConfig[] = visibleCrews.map((crew) => ({
    id: `crew-${crew.name}`,
    label: `${crew.name} - ${crew.crewType}`,
    longitude: crew.longitude,
    latitude: crew.latitude,
    color: getCrewMarkerColor(crew),
    outlineColor: getCrewMarkerOutlineColor(crew),
    size: candidateCrewNames.has(crew.name) || crew.name === selectedOrder.crew ? 24 : 21,
    icon: crew.vehicleIcon,
    popupContent: `${crew.crewType}<br/>${crew.status}<br/>${crew.currentAssignment}<br/>ETA to selected order: ${crew.eta}<br/>${getCrewMapDomain(crew) === "gas" ? "Gas crew" : "Power crew"}`
  }));

  if (activeTask === "impact") {
    return [
      ...workOrderMarkers,
      ...crewMarkers,
      { id: "hospital-corridor", label: "Hospital Corridor", longitude: -122.656, latitude: 45.518, color: "#7c3aed", size: 11 },
      { id: "affected-zone", label: "1,240 Customers", longitude: -122.668, latitude: 45.508, color: "#f97316", size: 11 }
    ];
  }

  return [...workOrderMarkers, ...crewMarkers];
}

function MetricTile({ label, value, detail, tone = "primary" }: { label: string; value: string; detail: string; tone?: "primary" | "error" | "warning" | "success" }) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5, height: "100%", bgcolor: "white" }}>
      <Stack direction="row" justifyContent="space-between" gap={1}>
        <Typography color="text.secondary" variant="body2">{label}</Typography>
        <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: `${tone}.main`, mt: 0.75 }} />
      </Stack>
      <Typography fontWeight={900} sx={{ mt: 0.75, fontSize: 28 }}>{value}</Typography>
      <Typography color="text.secondary" variant="body2">{detail}</Typography>
    </Paper>
  );
}

function WorkOrderTable({ selectedId, onSelect, workOrders }: { selectedId: string; onSelect: (id: string) => void; workOrders: WorkOrder[] }) {
  return (
    <Table size="small" stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell>Work Order</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Priority</TableCell>
          <TableCell>District</TableCell>
          <TableCell>SLA</TableCell>
          <TableCell>Assignment</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {workOrders.map((order) => (
          <TableRow
            hover
            key={order.id}
            onClick={() => onSelect(order.id)}
            selected={order.id === selectedId}
            sx={{ cursor: "pointer" }}
          >
            <TableCell sx={{ fontWeight: 900 }}>{order.id}</TableCell>
            <TableCell>{order.type}</TableCell>
            <TableCell><Chip color={priorityColor(order.priority)} label={order.priority} size="small" /></TableCell>
            <TableCell>{order.district}</TableCell>
            <TableCell>{order.sla}</TableCell>
            <TableCell>{assignmentLabel(order.assignmentState)}</TableCell>
            <TableCell>{order.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function DashboardScreen({ selectedOrder, markers, crews, workOrders }: { selectedOrder: WorkOrder; markers: EsriMarkerConfig[]; crews: CrewOption[]; workOrders: WorkOrder[] }) {
  const statusCounts = workOrders.reduce<Record<string, number>>((counts, order) => ({
    ...counts,
    [order.status]: (counts[order.status] ?? 0) + 1
  }), {});
  const statusBreakdown = Object.entries(statusCounts);
  const maxStatusCount = Math.max(1, ...statusBreakdown.map(([, count]) => count));
  const emergencyOrCriticalCount = workOrders.filter((order) => order.priority === "Emergency" || order.priority === "Critical").length;
  const availableCrewCount = crews.filter((crew) => crew.status === "Available").length;
  const assignedCrewCount = crews.filter((crew) => crew.status === "Assigned").length;
  const slaRiskCount = workOrders.filter((order) => order.sla.includes("<") || order.priority === "Emergency" || order.priority === "Critical").length;
  const districtEfficiency = Object.entries(
    workOrders.reduce<Record<string, { total: number; healthy: number }>>((counts, order) => {
      const districtCounts = counts[order.district] ?? { total: 0, healthy: 0 };
      const isHealthy = getWorkOrderHealth(order) === "onTrack";

      return {
        ...counts,
        [order.district]: {
          total: districtCounts.total + 1,
          healthy: districtCounts.healthy + (isHealthy ? 1 : 0)
        }
      };
    }, {})
  ).map(([district, counts]) => ({
    district,
    efficiency: Math.round((counts.healthy / counts.total) * 100)
  }));

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap">
          <Box>
            <Typography variant="h2">Executive Dashboard</Typography>
            <Typography color="text.secondary">NorthStar Utilities operating picture for gas and electric field response.</Typography>
          </Box>
          <Stack direction="row" gap={1} flexWrap="wrap">
            <Chip icon={<WarningAmberIcon />} color="error" label="Emergency active" />
            <Chip icon={<CheckCircleIcon />} color="success" label="Qualified crews available" />
          </Stack>
        </Stack>
      </Grid>

      <Grid item md={3} xs={12}><MetricTile label="Active Work Orders" value={`${workOrders.length}`} detail={`${emergencyOrCriticalCount} emergency or critical`} tone="primary" /></Grid>
      <Grid item md={3} xs={12}><MetricTile label="SLA Risk" value={`${slaRiskCount}`} detail="Priority jobs inside the response window" tone="error" /></Grid>
      <Grid item md={3} xs={12}><MetricTile label="Crew Utilization" value={`${assignedCrewCount} assigned`} detail={`${availableCrewCount} available crews`} tone="warning" /></Grid>
      <Grid item md={3} xs={12}><MetricTile label="Assigned Orders" value={`${statusCounts.Assigned ?? 0}`} detail="Tracked in demo workflow state" tone="success" /></Grid>

      <Grid item lg={8} xs={12}>
        <Paper variant="outlined" sx={{ overflow: "hidden", height: "100%" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1, bgcolor: "grey.50", borderBottom: "1px solid", borderColor: "divider" }}>
            <Stack direction="row" alignItems="center" gap={1}>
              <AssessmentIcon color="primary" />
              <Typography fontWeight={900}>Completion Status and Efficiency</Typography>
            </Stack>
            <Chip label="Healthy target: 80%+" size="small" />
          </Stack>
          <Grid container spacing={0} sx={{ p: 2 }}>
            <Grid item md={7} xs={12}>
              <Typography color="text.secondary" fontWeight={800} variant="body2">Work order completion status</Typography>
              <Stack spacing={1.25} sx={{ mt: 1.5 }}>
                {Object.entries(statusCounts).map(([status, count]) => (
                  <Stack key={status} spacing={0.5}>
                    <Stack direction="row" justifyContent="space-between" gap={1}>
                      <Typography fontWeight={800}>{status}</Typography>
                      <Typography color="text.secondary" variant="body2">{count} orders</Typography>
                    </Stack>
                    <Box sx={{ height: 18, bgcolor: "grey.100", borderRadius: 1, overflow: "hidden" }}>
                      <Box sx={{ width: `${(count / maxStatusCount) * 100}%`, height: "100%", bgcolor: status === "Assigned" || status === "Scheduled" ? "success.main" : status === "Needs assignment" ? "error.main" : "warning.main" }} />
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Grid>
            <Grid item md={5} xs={12}>
              <Box sx={{ pl: { md: 2 }, pt: { xs: 2, md: 0 } }}>
                <Typography color="text.secondary" fontWeight={800} variant="body2">District efficiency</Typography>
                <Stack direction="row" alignItems="flex-end" gap={1.25} sx={{ height: 202, mt: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
                  {districtEfficiency.map((item) => (
                    <Stack key={item.district} alignItems="center" justifyContent="flex-end" sx={{ flex: 1, height: "100%" }}>
                      <Typography fontWeight={900} variant="body2">{item.efficiency}%</Typography>
                      <Box sx={{ width: "100%", maxWidth: 42, height: `${item.efficiency}%`, minHeight: 18, bgcolor: item.efficiency >= 80 ? "success.main" : item.efficiency >= 60 ? "warning.main" : "error.main", borderRadius: "4px 4px 0 0" }} />
                      <Typography color="text.secondary" sx={{ mt: 0.75 }} variant="body2">{item.district}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid item lg={4} xs={12}>
        <Stack spacing={2}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography fontWeight={900}>Active Incident</Typography>
            <Divider sx={{ my: 1.5 }} />
            <Typography fontWeight={900}>{selectedOrder.id} - {selectedOrder.type}</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.75 }}>{selectedOrder.impact}</Typography>
            <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 1.5 }}>
              <Chip color={priorityColor(selectedOrder.priority)} label={selectedOrder.priority} size="small" />
              <Chip label={selectedOrder.sla} size="small" />
              <Chip label={selectedOrder.district} size="small" />
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography fontWeight={900}>Work Order Status</Typography>
            <Stack spacing={1.25} sx={{ mt: 1.5 }}>
              {statusBreakdown.map(([status, count]) => (
                <Box key={status}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontWeight={800}>{status}</Typography>
                    <Typography color="text.secondary" variant="body2">{count}</Typography>
                  </Stack>
                  <LinearProgress value={(count / maxStatusCount) * 100} variant="determinate" />
                </Box>
              ))}
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography fontWeight={900}>Crew Readiness</Typography>
            <Stack spacing={1.25} sx={{ mt: 1.5 }}>
              {crews.map((crew) => (
                <Box key={crew.name}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontWeight={800}>{crew.name}</Typography>
                    <Typography color="text.secondary" variant="body2">{crew.fit}%</Typography>
                  </Stack>
                  <LinearProgress color={crew.fit >= 90 ? "success" : "primary"} value={crew.fit} variant="determinate" />
                </Box>
              ))}
            </Stack>
          </Paper>
        </Stack>
      </Grid>
    </Grid>
  );
}

function WorkOrdersScreen({ selectedOrder, onSelectOrder, workOrders }: { selectedOrder: WorkOrder; onSelectOrder: (id: string) => void; workOrders: WorkOrder[] }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap">
          <Box>
            <Typography variant="h2">Work Orders</Typography>
            <Typography color="text.secondary">Dispatch queue with priority, SLA, skills, equipment, customer impact, and assignment state.</Typography>
          </Box>
          <Stack direction="row" gap={1}>
            <Button startIcon={<SearchIcon />} size="small" variant="outlined">Find</Button>
            <Button startIcon={<FilterListIcon />} size="small" variant="outlined">Filters</Button>
          </Stack>
        </Stack>
      </Grid>

      <Grid item lg={8} xs={12}>
        <Paper variant="outlined" sx={{ overflow: "hidden" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1, bgcolor: "grey.50", borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography fontWeight={900}>Planner Queue</Typography>
            <Chip label={`${workOrders.length} records`} size="small" />
          </Stack>
          <Box sx={{ maxHeight: 394, overflow: "auto" }}>
            <WorkOrderTable selectedId={selectedOrder.id} onSelect={onSelectOrder} workOrders={workOrders} />
          </Box>
        </Paper>
      </Grid>

      <Grid item lg={4} xs={12}>
        <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
          <Stack direction="row" justifyContent="space-between" gap={1}>
            <Box>
              <Typography color="text.secondary" variant="body2">Selected work order</Typography>
              <Typography fontWeight={900} fontSize={22}>{selectedOrder.id}</Typography>
            </Box>
            <Chip color={priorityColor(selectedOrder.priority)} label={selectedOrder.priority} />
          </Stack>
          <Divider sx={{ my: 1.5 }} />
          <Typography fontWeight={900}>{selectedOrder.type}</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>{selectedOrder.impact}</Typography>
          <Grid container spacing={1.25} sx={{ mt: 1 }}>
            <Grid item xs={6}><Typography color="text.secondary" variant="body2">Domain</Typography><Typography fontWeight={800}>{selectedOrder.domain}</Typography></Grid>
            <Grid item xs={6}><Typography color="text.secondary" variant="body2">District</Typography><Typography fontWeight={800}>{selectedOrder.district}</Typography></Grid>
            <Grid item xs={6}><Typography color="text.secondary" variant="body2">SLA</Typography><Typography fontWeight={800}>{selectedOrder.sla}</Typography></Grid>
            <Grid item xs={6}><Typography color="text.secondary" variant="body2">Assignment</Typography><Typography fontWeight={800}>{selectedOrder.crew}</Typography></Grid>
          </Grid>
          <Divider sx={{ my: 1.5 }} />
          <Typography fontWeight={900}>Required Skills</Typography>
          <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mt: 1 }}>
            {selectedOrder.skills.map((skill) => <Chip key={skill} label={skill} size="small" variant="outlined" />)}
          </Stack>
          <Typography fontWeight={900} sx={{ mt: 2 }}>Equipment</Typography>
          <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mt: 1 }}>
            {selectedOrder.equipment.map((item) => <Chip key={item} label={item} size="small" variant="outlined" />)}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}

function CrewTable({ selectedName, onSelect, crews }: { selectedName: string; onSelect: (name: string) => void; crews: CrewOption[] }) {
  return (
    <Table size="small" stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell>Crew</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>District</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Vehicle</TableCell>
          <TableCell>Rate</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {crews.map((crew) => (
          <TableRow
            hover
            key={crew.name}
            onClick={() => onSelect(crew.name)}
            selected={crew.name === selectedName}
            sx={{ cursor: "pointer" }}
          >
            <TableCell sx={{ fontWeight: 900 }}>{crew.name}</TableCell>
            <TableCell>{crew.crewType}</TableCell>
            <TableCell>{crew.district}</TableCell>
            <TableCell><Chip color={crew.status === "Available" ? "success" : "default"} label={crew.status} size="small" /></TableCell>
            <TableCell>{vehicleLabel(crew.vehicleIcon)}</TableCell>
            <TableCell>{crew.hourly}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function WorkforceScreen({ selectedCrewName, onSelectCrew, crews }: { selectedCrewName: string; onSelectCrew: (name: string) => void; crews: CrewOption[] }) {
  const selectedCrew = crews.find((crew) => crew.name === selectedCrewName) ?? crews[0];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap">
          <Box>
            <Typography variant="h2">Workforce</Typography>
            <Typography color="text.secondary">Crew roster with vehicle type, certifications, assignment state, and dispatch readiness.</Typography>
          </Box>
          <Stack direction="row" gap={1}>
            <Button startIcon={<SearchIcon />} size="small" variant="outlined">Find</Button>
            <Button startIcon={<FilterListIcon />} size="small" variant="outlined">Filters</Button>
          </Stack>
        </Stack>
      </Grid>

      <Grid item lg={8} xs={12}>
        <Paper variant="outlined" sx={{ overflow: "hidden" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1, bgcolor: "grey.50", borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography fontWeight={900}>Crew List</Typography>
            <Chip label={`${crews.length} crews`} size="small" />
          </Stack>
          <Box sx={{ maxHeight: 394, overflow: "auto" }}>
            <CrewTable selectedName={selectedCrew.name} onSelect={onSelectCrew} crews={crews} />
          </Box>
        </Paper>
      </Grid>

      <Grid item lg={4} xs={12}>
        <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
          <Stack direction="row" justifyContent="space-between" gap={1}>
            <Box>
              <Typography color="text.secondary" variant="body2">Selected crew</Typography>
              <Typography fontWeight={900} fontSize={22}>{selectedCrew.name}</Typography>
            </Box>
            <Chip color={selectedCrew.status === "Available" ? "success" : "default"} label={selectedCrew.status} />
          </Stack>
          <Divider sx={{ my: 1.5 }} />
          <Grid container spacing={1.25}>
            <Grid item xs={6}><Typography color="text.secondary" variant="body2">Crew Type</Typography><Typography fontWeight={800}>{selectedCrew.crewType}</Typography></Grid>
            <Grid item xs={6}><Typography color="text.secondary" variant="body2">District</Typography><Typography fontWeight={800}>{selectedCrew.district}</Typography></Grid>
            <Grid item xs={6}><Typography color="text.secondary" variant="body2">Hourly Rate</Typography><Typography fontWeight={800}>{selectedCrew.hourly}</Typography></Grid>
            <Grid item xs={6}><Typography color="text.secondary" variant="body2">Overtime Risk</Typography><Typography fontWeight={800}>{selectedCrew.overtime}</Typography></Grid>
          </Grid>
          <Typography fontWeight={900} sx={{ mt: 2 }}>Current Assignment</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>{selectedCrew.currentAssignment}</Typography>
          <Typography fontWeight={900} sx={{ mt: 2 }}>Certifications</Typography>
          <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mt: 1 }}>
            {selectedCrew.certifications.map((certification) => <Chip key={certification} label={certification} size="small" variant="outlined" />)}
          </Stack>
          <Typography fontWeight={900} sx={{ mt: 2 }}>Dispatch Notes</Typography>
          <Stack spacing={0.75} sx={{ mt: 1 }}>
            {[...selectedCrew.strengths, ...selectedCrew.penalties].slice(0, 4).map((note) => (
              <Stack key={note} direction="row" alignItems="center" gap={1}>
                <BuildIcon color="primary" fontSize="small" />
                <Typography variant="body2">{note}</Typography>
              </Stack>
            ))}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}

function DispatchScreen({
  activeTask,
  evaluated,
  evaluating,
  onEvaluate,
  onSelectOrder,
  onAssignCrew,
  onRefreshWorkOrders,
  onUnassignCrew,
  selectedOrder,
  hasSelectedWorkOrder,
  workOrders,
  crews
}: {
  activeTask: TaskKey;
  evaluated: boolean;
  evaluating: boolean;
  onEvaluate: () => void;
  onSelectOrder: (id: string) => void;
  onAssignCrew: (crew: RankedCrewOption) => void;
  onRefreshWorkOrders: () => void;
  onUnassignCrew: () => void;
  selectedOrder: WorkOrder;
  hasSelectedWorkOrder: boolean;
  workOrders: WorkOrder[];
  crews: CrewOption[];
}) {
  const [showCrewMarkers, setShowCrewMarkers] = useState(true);
  const [showMapLegend, setShowMapLegend] = useState(true);
  const dispatchMarkers = getTaskMapMarkers(activeTask, selectedOrder, showCrewMarkers, workOrders, crews);
  const mappedCrewCount = crews.filter((crew) => Number.isFinite(crew.longitude) && Number.isFinite(crew.latitude)).length;
  const assignedCrew = crews.find((crew) => selectedOrder.assignmentState === "assigned" && crew.name === selectedOrder.crew);
  const rankedCrews = hasSelectedWorkOrder
    ? assignedCrew
      ? [toAssignedCrewRow(assignedCrew, selectedOrder)]
      : getRankedCandidateCrews(selectedOrder, crews)
    : [];
  const recommendedCrew = rankedCrews[0];
  const scheduleCrew = assignedCrew ?? recommendedCrew;
  const scheduleItems = getScheduleWindowItems(selectedOrder, scheduleCrew);
  const isSelectedOrderAssigned = selectedOrder.assignmentState === "assigned";

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between" gap={2} flexWrap="wrap">
          <Box>
            <Typography variant="h2">Dispatch</Typography>
            <Typography color="text.secondary">Crew allocation, route readiness, and schedule impact for {selectedOrder.id}.</Typography>
          </Box>
          <Stack direction="row" gap={1} flexWrap="wrap">
            <Button onClick={onRefreshWorkOrders} startIcon={<ReplayIcon />} variant="outlined">
              Refresh Work Orders
            </Button>
            <Button disabled={!isSelectedOrderAssigned} onClick={onUnassignCrew} variant="outlined">
              Unassign Crew
            </Button>
            <Button disabled={evaluating || !hasSelectedWorkOrder || isSelectedOrderAssigned} onClick={onEvaluate} variant="contained">
              {isSelectedOrderAssigned ? "Crew Assigned" : evaluated ? "Re-evaluate Crews" : "Evaluate Crews"}
            </Button>
          </Stack>
        </Stack>
      </Grid>
      <Grid item lg={6} xs={12}>
        <Paper variant="outlined" sx={{ overflow: "hidden", maxWidth: { lg: 816 } }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} sx={{ px: 2, py: 1, bgcolor: "grey.50", borderBottom: "1px solid", borderColor: "divider" }}>
            <Stack direction="row" alignItems="center" gap={1}>
              <MapIcon color="primary" />
              <Typography fontWeight={900}>{getTaskMapTitle(activeTask, selectedOrder)}</Typography>
            </Stack>
            <Chip label={showCrewMarkers ? `${mappedCrewCount} crews visible` : "Crews hidden"} size="small" />
          </Stack>
          <Box sx={{ position: "relative" }}>
            <Stack direction="row" spacing={1} sx={{ position: "absolute", right: 12, top: 12, zIndex: 30 }}>
              <Button
                color="success"
                onClick={() => setShowCrewMarkers((current) => !current)}
                size="small"
                sx={{ bgcolor: "white", boxShadow: 3, fontWeight: 900, "&:hover": { bgcolor: "grey.50" } }}
                variant="outlined"
              >
                {showCrewMarkers ? "Hide Crews" : "Show Crews"}
              </Button>
              <Button
                color="success"
                onClick={() => setShowMapLegend((current) => !current)}
                size="small"
                sx={{ bgcolor: "white", boxShadow: 3, fontWeight: 900, "&:hover": { bgcolor: "grey.50" } }}
                variant="outlined"
              >
                {showMapLegend ? "Hide Legend" : "Show Legend"}
              </Button>
            </Stack>
            <EsriMapViewer
              center={[selectedOrder.longitude, selectedOrder.latitude]}
              controls={{ attribution: true, compass: true, legend: showMapLegend, zoom: true }}
              height={432}
              layers={mapLayers}
              markers={dispatchMarkers}
              onMarkerClick={(marker) => {
                if (workOrders.some((order) => order.id === marker.id)) {
                  onSelectOrder(marker.id);
                }
              }}
              title=""
              zoom={hasSelectedWorkOrder ? dispatchMapSelectedZoom : dispatchMapDefaultZoom}
            />
          </Box>
        </Paper>
      </Grid>
      <Grid item lg={6} xs={12}>
        <Paper variant="outlined" sx={{ overflow: "hidden", height: "100%" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} sx={{ px: 2, py: 1, bgcolor: "grey.50", borderBottom: "1px solid", borderColor: "divider" }}>
            <Stack direction="row" alignItems="center" gap={1}>
            <PeopleIcon color="primary" />
            <Typography fontWeight={900}>{isSelectedOrderAssigned ? "Assigned Crew" : "Possible Crews"}</Typography>
            </Stack>
            <Chip color={isSelectedOrderAssigned ? "success" : evaluated ? "success" : "default"} label={isSelectedOrderAssigned ? "Assigned" : evaluated ? "Ranked" : "Not evaluated"} size="small" />
          </Stack>
          {evaluating && <LinearProgress />}
          {hasSelectedWorkOrder && (
            <Typography color="text.secondary" sx={{ px: 2, py: 1, bgcolor: "grey.50", borderBottom: "1px solid", borderColor: "divider" }} variant="body2">
              {isSelectedOrderAssigned ? "This work order is assigned, so only the assigned crew is shown here." : "Effective cost estimates the total job cost after hourly rate, travel time, overtime risk, productivity, and equipment readiness. Ranking uses decision score, not skill fit alone."}
            </Typography>
          )}
          {!hasSelectedWorkOrder ? (
            <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 260, p: 3, textAlign: "center" }}>
              <Typography fontWeight={900}>Select a work order first</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">Click a work order marker on the map or choose one from the Work Orders queue before possible crews are shown.</Typography>
            </Stack>
          ) : (
          <TableContainer sx={{ maxHeight: 440, overflowX: "auto" }}>
          <Table size="small" stickyHeader sx={{ minWidth: 760 }}>
            <TableHead>
              <TableRow>
                <TableCell>Crew</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Skill Fit</TableCell>
                <TableCell>ETA</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Effective</TableCell>
                <TableCell>Equipment</TableCell>
                <TableCell>Overtime</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rankedCrews.map((crew, index) => (
                <TableRow key={crew.name} selected={evaluated && crew.name === recommendedCrew?.name}>
                  <TableCell sx={{ fontWeight: 900 }}>{evaluated && !isSelectedOrderAssigned ? `${index + 1}. ` : ""}{crew.name}</TableCell>
                  <TableCell>{evaluated || isSelectedOrderAssigned ? crew.decisionScore : "-"}</TableCell>
                  <TableCell>{evaluated || isSelectedOrderAssigned ? `${crew.fit}%` : "-"}</TableCell>
                  <TableCell>{crew.eta}</TableCell>
                  <TableCell>{crew.hourly}</TableCell>
                  <TableCell>{evaluated || isSelectedOrderAssigned ? crew.effectiveCost : "-"}</TableCell>
                  <TableCell>{crew.equipment}</TableCell>
                  <TableCell>{crew.overtime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableContainer>
          )}
        </Paper>
      </Grid>
      <Grid item lg={7} xs={12}>
        <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
          <Typography fontWeight={900}>{isSelectedOrderAssigned && recommendedCrew ? `${recommendedCrew.name} is assigned` : evaluated && recommendedCrew ? `Why ${recommendedCrew.name} is recommended` : "Evaluation readiness"}</Typography>
          {evaluated || isSelectedOrderAssigned ? (
            <Grid container spacing={1.25} sx={{ mt: 1 }}>
              {(recommendedCrew?.decisionReasons ?? []).map((strength) => (
                <Grid item md={6} xs={12} key={strength}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <CheckCircleIcon color="success" fontSize="small" />
                    <Typography>{strength}</Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Click a work order on the map to change this list, then evaluate crews to score skill fit, effective cost, travel ETA, availability, and equipment readiness. Effective cost is the modeled total job cost after labor rate, travel, overtime risk, productivity, and equipment readiness are considered.
            </Typography>
          )}
        </Paper>
      </Grid>
      <Grid item lg={5} xs={12}>
        <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
          <Typography fontWeight={900}>{recommendedCrew ? `${recommendedCrew.name} Schedule Window` : "Schedule Window"}</Typography>
          <Stack spacing={1.2} sx={{ mt: 2 }}>
            {scheduleItems.map((item) => (
              <Stack key={`${item.label}-${item.meta}`} direction="row" alignItems="center" gap={1}>
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: item.tone === "success" ? "success.main" : "primary.main" }} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography fontWeight={800}>{item.label}</Typography>
                  <Typography color="text.secondary" variant="body2">{item.meta}</Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
          <Button disabled={isSelectedOrderAssigned || !evaluated || !recommendedCrew} onClick={() => recommendedCrew && onAssignCrew(recommendedCrew)} startIcon={<LocalShippingIcon />} fullWidth sx={{ mt: 2 }} variant="contained">
            {isSelectedOrderAssigned ? `Assigned to ${selectedOrder.crew}` : `Assign ${recommendedCrew?.name ?? "Recommended Crew"}`}
          </Button>
          {isSelectedOrderAssigned && (
            <Button onClick={onUnassignCrew} fullWidth sx={{ mt: 1 }} variant="outlined">
              Unassign and Evaluate Again
            </Button>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}

function ReportsScreen() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h2">Report Center</Typography>
        <Typography color="text.secondary">Operational closeout for recommendation rationale, dispatch audit, and value summary.</Typography>
      </Grid>
      <Grid item md={4} xs={12}><MetricTile label="ETA Improvement" value="23 min" detail="Against next qualified alternative" tone="success" /></Grid>
      <Grid item md={4} xs={12}><MetricTile label="Overtime Avoided" value="2.6 hrs" detail="Single incident estimate" tone="success" /></Grid>
      <Grid item md={4} xs={12}><MetricTile label="Customer Risk" value="-38%" detail="SLA and hospital corridor exposure" tone="success" /></Grid>
      <Grid item xs={12}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography fontWeight={900}>Recommendation Audit</Typography>
          <Stack spacing={1.25} sx={{ mt: 1.5 }}>
            {["Recommended crew passed the required certification gate.", "Equipment package is already assigned or staged.", "Arrival time remains inside the SLA window.", "Effective cost is lowest after travel and overtime adjustments."].map((line) => (
              <Stack direction="row" alignItems="center" gap={1} key={line}>
                <CheckCircleIcon color="success" fontSize="small" />
                <Typography>{line}</Typography>
              </Stack>
            ))}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}

export function OperationsConsolePage() {
  const persistedWorkflowState = useMemo(() => loadPersistedWorkflowState(), []);
  const [activeHub, setActiveHub] = useState<HubKey>("dashboard");
  const [activeTask, setActiveTask] = useState<TaskKey>("emergency");
  const [evaluated, setEvaluated] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(persistedWorkflowState.workOrders);
  const [crews, setCrews] = useState<CrewOption[]>(persistedWorkflowState.crews);
  const [selectedOrderId, setSelectedOrderId] = useState(defaultWorkOrderId);
  const [selectedCrewName, setSelectedCrewName] = useState(defaultCrewName);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(true);
  const isMenuOpen = Boolean(menuAnchor);
  const selectedOrder = workOrders.find((order) => order.id === selectedOrderId) ?? workOrders[0];
  const [hasSelectedWorkOrder, setHasSelectedWorkOrder] = useState(false);
  const markers = useMemo(() => getTaskMapMarkers(activeTask, selectedOrder, hasSelectedWorkOrder, workOrders, crews), [activeTask, crews, hasSelectedWorkOrder, selectedOrder, workOrders]);

  useEffect(() => {
    window.localStorage.setItem(workflowStorageKey, JSON.stringify({ workOrders, crews }));
  }, [crews, workOrders]);

  function openMenu(event: MouseEvent<HTMLButtonElement>) {
    setMenuAnchor(event.currentTarget);
  }

  function closeMenu() {
    setMenuAnchor(null);
  }

  function resetWorkflow() {
    setWorkOrders(initialWorkOrders);
    setCrews(initialCrews);
    setSelectedOrderId(defaultWorkOrderId);
    setSelectedCrewName(defaultCrewName);
    setHasSelectedWorkOrder(false);
    setEvaluated(false);
    setActiveHub("dashboard");
    setActiveTask("emergency");
    closeMenu();
  }

  function refreshWorkOrders() {
    setWorkOrders(initialWorkOrders);
    setCrews(initialCrews);
    setSelectedOrderId(defaultWorkOrderId);
    setSelectedCrewName(defaultCrewName);
    setHasSelectedWorkOrder(false);
    setEvaluated(false);
    setEvaluating(false);
    setActiveTask("emergency");
  }

  function selectTask(task: typeof currentTasks[number]) {
    setActiveTask(task.key);
    setActiveHub(task.hub);
    if (task.key === "emergency") {
      setSelectedOrderId(defaultWorkOrderId);
      setHasSelectedWorkOrder(false);
      setEvaluated(false);
    }
  }

  function selectWorkOrder(orderId: string) {
    setSelectedOrderId(orderId);
    setHasSelectedWorkOrder(true);
    setEvaluated(false);
  }

  function evaluateCrews() {
    setActiveTask("crews");
    setEvaluating(true);
    window.setTimeout(() => {
      setEvaluated(true);
      setEvaluating(false);
    }, 650);
  }

  function assignRecommendedCrew(crew: RankedCrewOption) {
    const previouslyAssignedCrewName = selectedOrder.assignmentState === "assigned" ? selectedOrder.crew : null;

    setWorkOrders((currentWorkOrders) => currentWorkOrders.map((order) => (
      order.id === selectedOrder.id
        ? {
          ...order,
          assignmentState: "assigned",
          status: "Assigned",
          crew: crew.name,
          assignedAt: new Date().toISOString()
        }
        : order
    )));
    setCrews((currentCrews) => currentCrews.map((candidate) => (
      candidate.name === crew.name
        ? {
          ...candidate,
          status: "Assigned",
          currentAssignment: `Assigned to ${selectedOrder.id}`
        }
        : candidate.name === previouslyAssignedCrewName
          ? {
            ...candidate,
            ...(initialCrews.find((initialCrew) => initialCrew.name === candidate.name) ?? candidate)
          }
        : candidate
    )));
    setSelectedCrewName(crew.name);
    setActiveTask("assignment");
    setEvaluated(false);
  }

  function unassignSelectedCrew() {
    if (selectedOrder.assignmentState !== "assigned") {
      return;
    }

    const assignedCrewName = selectedOrder.crew;

    setWorkOrders((currentWorkOrders) => currentWorkOrders.map((order) => (
      order.id === selectedOrder.id
        ? {
          ...order,
          assignmentState: "unevaluated",
          status: "Needs assignment",
          crew: "Pending review",
          assignedAt: undefined
        }
        : order
    )));
    setCrews((currentCrews) => currentCrews.map((candidate) => (
      candidate.name === assignedCrewName
        ? {
          ...candidate,
          ...(initialCrews.find((initialCrew) => initialCrew.name === candidate.name) ?? candidate)
        }
        : candidate
    )));
    setHasSelectedWorkOrder(true);
    setEvaluated(false);
    setActiveTask("crews");
  }

  function renderActiveHub(): ReactElement {
    if (activeHub === "workOrders") {
      return <WorkOrdersScreen selectedOrder={selectedOrder} onSelectOrder={selectWorkOrder} workOrders={workOrders} />;
    }

    if (activeHub === "workforce") {
      return <WorkforceScreen selectedCrewName={selectedCrewName} onSelectCrew={setSelectedCrewName} crews={crews} />;
    }

    if (activeHub === "dispatch") {
      return (
        <DispatchScreen
          activeTask={activeTask}
          evaluated={evaluated}
          evaluating={evaluating}
          onEvaluate={evaluateCrews}
          onSelectOrder={selectWorkOrder}
          onAssignCrew={assignRecommendedCrew}
          onRefreshWorkOrders={refreshWorkOrders}
          onUnassignCrew={unassignSelectedCrew}
          selectedOrder={selectedOrder}
          hasSelectedWorkOrder={hasSelectedWorkOrder}
          workOrders={workOrders}
          crews={crews}
        />
      );
    }

    if (activeHub === "reports") {
      return <ReportsScreen />;
    }

    return <DashboardScreen selectedOrder={selectedOrder} markers={markers} crews={crews} workOrders={workOrders} />;
  }

  return (
    <Box sx={{ bgcolor: "#f3f4f6", mx: { xs: -2, md: -3 }, my: { xs: -2, md: -3 }, minHeight: "calc(100vh - 96px)" }}>
      <Stack direction="row" sx={{ minHeight: "calc(100vh - 96px)" }}>
        <Stack sx={{ width: 44, bgcolor: "#111827", color: "white", py: 1, display: { xs: "none", md: "flex" } }} alignItems="center" spacing={1}>
          {[DashboardIcon, WorkIcon, PeopleIcon, MapIcon, EngineeringIcon, AssessmentIcon].map((Icon, index) => (
            <IconButton key={index} size="small" sx={{ color: "rgba(255,255,255,0.78)" }}>
              <Icon fontSize="small" />
            </IconButton>
          ))}
        </Stack>

        <Stack sx={{ flex: 1, minWidth: 0 }}>
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
            sx={{ px: { xs: 2, md: 2.5 }, py: 1, bgcolor: "#3b005f", color: "white" }}
          >
            <Stack direction="row" alignItems="center" gap={1.5}>
              <Typography fontWeight={900}>NorthStar</Typography>
              <Typography color="rgba(255,255,255,0.72)" variant="body2">Operations Console</Typography>
            </Stack>
            <IconButton aria-controls={isMenuOpen ? "demo-controls-menu" : undefined} aria-haspopup="true" aria-label="Demo controls" onClick={openMenu} sx={{ color: "white" }}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={menuAnchor}
              id="demo-controls-menu"
              onClose={closeMenu}
              open={isMenuOpen}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem component={RouterLink} onClick={closeMenu} to="/ai-crew-recommendation">Return to Presentation</MenuItem>
              <MenuItem component={RouterLink} onClick={closeMenu} to="/explainability"><PsychologyIcon fontSize="small" sx={{ mr: 1 }} /> Explainability</MenuItem>
              <MenuItem component={RouterLink} onClick={closeMenu} to="/roi"><AssessmentIcon fontSize="small" sx={{ mr: 1 }} /> ROI</MenuItem>
              <MenuItem onClick={resetWorkflow}><ReplayIcon fontSize="small" sx={{ mr: 1 }} /> Restart Demo</MenuItem>
            </Menu>
          </Stack>

          <Stack direction="row" gap={0.5} sx={{ px: 1, py: 0.75, bgcolor: "white", borderBottom: "1px solid", borderColor: "divider", overflowX: "auto" }}>
            {consoleHubItems.map((item) => (
              <Button
                key={item.key}
                onClick={() => setActiveHub(item.key)}
                startIcon={item.icon}
                size="small"
                variant={activeHub === item.key ? "contained" : "text"}
                sx={{ flex: "0 0 auto" }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          <Stack direction="row" sx={{ flex: 1, minHeight: 0 }}>
            <Box sx={{ flex: 1, minWidth: 0, p: 2 }}>
              {renderActiveHub()}
            </Box>

            {isTaskPanelOpen ? (
              <Paper square variant="outlined" sx={{ width: 330, display: { xs: "none", lg: "block" }, borderTop: 0, borderRight: 0, borderBottom: 0, p: 2, bgcolor: "white" }}>
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={1}>
                  <div>
                    <Typography variant="h2">Current Task</Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.75 }} variant="body2">Work the live demo from an operational task list.</Typography>
                  </div>
                  <IconButton aria-label="Collapse current task panel" onClick={() => setIsTaskPanelOpen(false)} size="small">
                    <ChevronRightIcon fontSize="small" />
                  </IconButton>
                </Stack>
                <Stack divider={<Divider flexItem />} sx={{ mt: 1.5 }}>
                  {currentTasks.map((task) => (
                    <Button
                      key={task.key}
                      onClick={() => selectTask(task)}
                      sx={{ alignItems: "flex-start", color: "text.primary", justifyContent: "flex-start", px: 0.5, py: 1.25, textAlign: "left" }}
                    >
                      <Stack spacing={0.75} sx={{ width: "100%" }}>
                        <Stack alignItems="center" direction="row" justifyContent="space-between" gap={1}>
                          <Typography fontWeight={900}>{task.label}</Typography>
                          <Chip color={task.key === activeTask ? "primary" : "default"} label={task.status} size="small" />
                        </Stack>
                        <Typography color="text.secondary" variant="body2">{task.detail}</Typography>
                      </Stack>
                    </Button>
                  ))}
                </Stack>
              </Paper>
            ) : (
              <Paper square variant="outlined" sx={{ width: 52, display: { xs: "none", lg: "block" }, borderTop: 0, borderRight: 0, borderBottom: 0, p: 0.75, bgcolor: "white" }}>
                <Stack alignItems="center" spacing={1} sx={{ pt: 0.5 }}>
                  <IconButton aria-label="Expand current task panel" onClick={() => setIsTaskPanelOpen(true)} size="small">
                    <ChevronLeftIcon fontSize="small" />
                  </IconButton>
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "primary.main" }} />
                  <Typography sx={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontWeight: 900, fontSize: 12, lineHeight: 1.2 }}>
                    Current Task
                  </Typography>
                </Stack>
              </Paper>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
