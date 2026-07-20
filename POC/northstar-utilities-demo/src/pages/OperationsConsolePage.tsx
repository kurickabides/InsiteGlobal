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
  Checkbox,
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
  TextField,
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
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ReplayIcon from "@mui/icons-material/Replay";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import SummarizeIcon from "@mui/icons-material/Summarize";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import WorkIcon from "@mui/icons-material/Work";
import { MouseEvent, ReactElement, useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { EsriMapViewer } from "../components/esri/EsriMapViewer";
import { EsriLayerConfig, EsriMarkerConfig } from "../components/esri/types";
import { generatedCrews, generatedWorkOrders } from "../data/generatedOperationsData";

type HubKey = "dashboard" | "workOrders" | "workforce" | "dispatch" | "performance" | "reports" | "settings";
type TaskKey = "emergency" | "crews" | "assignment" | "impact";
type WorkOrderHealth = "onTrack" | "belowEfficiency" | "dangerZone";
type ReportKey = "dailyLog" | "crewSchedules" | "weeklyInstalled" | "inventory";

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

interface EvaluationSettings {
  skillFitWeight: number;
  effectiveCostWeight: number;
  etaWeight: number;
  availabilityWeight: number;
  equipmentWeight: number;
}

interface OperationsSettings {
  emergencySlaMinutes: number;
  criticalSlaMinutes: number;
  highPrioritySlaMinutes: number;
  dailyCrewLimitHours: number;
  materialPickupMinutes: number;
  assignedCrewScorePenalty: number;
  limitedEquipmentScorePenalty: number;
  evaluation: EvaluationSettings;
}

type WorkOrderFilterKey = "emergency" | "critical" | "slaRisk" | "gas" | "electric" | "assigned" | "needsAssignment";
type WorkforceFilterKey = "available" | "assigned" | "gas" | "power" | "highFit" | "overtimeRisk";

const generatedConsoleWorkOrders = generatedWorkOrders.map((order) => ({ ...order })) as unknown as WorkOrder[];
const generatedConsoleCrews = generatedCrews.map((crew) => ({ ...crew })) as unknown as CrewOption[];
const july20DemoWorkOrders = createJuly20DemoWorkOrders(generatedConsoleCrews);
const july20DemoCrewNames = new Set(july20DemoWorkOrders.map((order) => order.crew));
const initialCrews = generatedConsoleCrews.map((crew) => (
  july20DemoCrewNames.has(crew.name)
    ? {
      ...crew,
      status: "Assigned",
      currentAssignment: "July 20 demo schedule"
    }
    : crew
));

const workflowStorageKey = "northstar-operations-workflow-state";
const settingsStorageKey = "northstar-operations-settings";

const defaultOperationsSettings: OperationsSettings = {
  emergencySlaMinutes: 60,
  criticalSlaMinutes: 120,
  highPrioritySlaMinutes: 240,
  dailyCrewLimitHours: 15,
  materialPickupMinutes: 20,
  assignedCrewScorePenalty: 30,
  limitedEquipmentScorePenalty: 20,
  evaluation: {
    skillFitWeight: 35,
    effectiveCostWeight: 30,
    etaWeight: 20,
    availabilityWeight: 10,
    equipmentWeight: 5
  }
};

function createJuly20DemoWorkOrders(crewPool: CrewOption[]): WorkOrder[] {
  const demoCrewPool = crewPool.filter((crew) => crew.status === "Available");
  const demoTypes: Array<Pick<WorkOrder, "type" | "domain" | "priority" | "skills" | "equipment">> = [
    { type: "Gas Service Installation", domain: "Gas", priority: "High", skills: ["Gas service", "Excavation", "Customer relight"], equipment: ["Service truck", "Fusion kit", "Traffic kit"] },
    { type: "Regulator Maintenance", domain: "Gas", priority: "Routine", skills: ["Pressure regulation", "Compliance photos"], equipment: ["Pressure kit", "Service truck"] },
    { type: "Corrosion Inspection", domain: "Gas", priority: "Critical", skills: ["Corrosion inspection", "Compliance photos"], equipment: ["Inspection van", "Survey kit"] },
    { type: "Transformer Replacement", domain: "Electric", priority: "High", skills: ["Transformer replacement", "Switching"], equipment: ["Bucket truck", "Transformer", "Hot stick"] },
    { type: "Pole Replacement", domain: "Electric", priority: "Routine", skills: ["Line construction", "Traffic control"], equipment: ["Bucket truck", "Pole trailer", "Traffic kit"] },
    { type: "Underground Cable Repair", domain: "Electric", priority: "Critical", skills: ["Cable fault location", "Splicing"], equipment: ["Cable fault locator", "Splice kit"] },
    { type: "Vegetation Clearance", domain: "Electric", priority: "High", skills: ["Line clearance", "Vegetation safety"], equipment: ["Bucket truck", "Chainsaw kit"] }
  ];
  const districts = ["North", "Central", "South"];
  const startTimes = [
    "08:00:00", "08:15:00", "08:30:00", "08:45:00", "09:00:00",
    "09:15:00", "09:30:00", "09:45:00", "10:00:00", "10:15:00",
    "10:30:00", "10:45:00", "11:00:00", "11:15:00", "11:30:00",
    "11:45:00", "12:00:00", "12:15:00", "12:30:00", "12:45:00",
    "13:00:00", "13:30:00", "14:00:00", "14:30:00", "15:00:00"
  ];

  return Array.from({ length: 25 }, (_, index) => {
    const template = demoTypes[index % demoTypes.length];
    const crew = demoCrewPool[(index * 7) % demoCrewPool.length] ?? crewPool[index % crewPool.length];
    const district = districts[index % districts.length];
    const latitude = 45.492 + ((index % 8) * 0.009);
    const longitude = -122.704 + ((index % 9) * 0.0085);

    return {
      id: `WO-DEMO-72${String(index + 1).padStart(2, "0")}`,
      type: template.type,
      domain: template.domain,
      priority: template.priority,
      status: "Assigned",
      district,
      sla: template.priority === "Critical" ? "1 hr 45 min" : template.priority === "High" ? "4 hr" : "2 days",
      impact: `July 20 scheduled ${template.domain.toLowerCase()} field work in ${district} district`,
      crew: crew.name,
      assignmentState: "assigned",
      assignedAt: `2026-07-20T${startTimes[index]}-07:00`,
      skills: template.skills,
      equipment: template.equipment,
      longitude,
      latitude
    };
  });
}

function mergeJuly20DemoWorkOrders(workOrders: WorkOrder[]): WorkOrder[] {
  const existingIds = new Set(workOrders.map((order) => order.id));

  return [
    ...workOrders,
    ...july20DemoWorkOrders.filter((order) => !existingIds.has(order.id))
  ];
}

function mergeJuly20DemoCrewAssignments(crews: CrewOption[]): CrewOption[] {
  return crews.map((crew) => (
    july20DemoCrewNames.has(crew.name)
      ? {
        ...crew,
        status: "Assigned",
        currentAssignment: crew.currentAssignment === "Idle" || crew.status === "Available" ? "July 20 demo schedule" : crew.currentAssignment
      }
      : crew
  ));
}

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

const initialWorkOrders = normalizeWorkOrderCrewRelationships(mergeJuly20DemoWorkOrders(generatedConsoleWorkOrders));

const defaultWorkOrderId = initialWorkOrders.find((order) => order.priority === "Emergency" && order.assignmentState !== "assigned")?.id ?? initialWorkOrders[0].id;
const defaultCrewName = initialCrews.find((crew) => crew.status === "Available")?.name ?? initialCrews[0].name;

interface PersistedWorkflowState {
  workOrders: WorkOrder[];
  crews: CrewOption[];
}

function normalizePersistedWorkflowState(state: PersistedWorkflowState): PersistedWorkflowState {
  return {
    ...state,
    workOrders: normalizeWorkOrderCrewRelationships(mergeJuly20DemoWorkOrders(state.workOrders)),
    crews: mergeJuly20DemoCrewAssignments(state.crews)
  };
}

function normalizeOperationsSettings(settings: Partial<OperationsSettings> = {}): OperationsSettings {
  return {
    ...defaultOperationsSettings,
    ...settings,
    evaluation: {
      ...defaultOperationsSettings.evaluation,
      ...(settings.evaluation ?? {})
    }
  };
}

const consoleHubItems: { key: HubKey; label: string; icon: JSX.Element; metric: string }[] = [
  { key: "dashboard", label: "Dashboard", icon: <DashboardIcon />, metric: "Daily schedule" },
  { key: "workOrders", label: "Work Orders", icon: <WorkIcon />, metric: "Dispatch queue" },
  { key: "workforce", label: "Workforce", icon: <PeopleIcon />, metric: "Crew roster" },
  { key: "dispatch", label: "Dispatch", icon: <EngineeringIcon />, metric: "Crew allocation" },
  { key: "performance", label: "Performance", icon: <AssessmentIcon />, metric: "Operating metrics" },
  { key: "reports", label: "Report Center", icon: <SummarizeIcon />, metric: "Impact and audit" },
  { key: "settings", label: "Settings", icon: <SettingsIcon />, metric: "Evaluation tuning" }
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

function loadPersistedOperationsSettings(): OperationsSettings {
  if (typeof window === "undefined") {
    return defaultOperationsSettings;
  }

  try {
    const rawValue = window.localStorage.getItem(settingsStorageKey);
    if (!rawValue) {
      return defaultOperationsSettings;
    }

    return normalizeOperationsSettings(JSON.parse(rawValue) as Partial<OperationsSettings>);
  } catch {
    return defaultOperationsSettings;
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

function getWorkOrderHealth(order: WorkOrder, settings: OperationsSettings = defaultOperationsSettings): WorkOrderHealth {
  const slaMinutes = parseSlaMinutes(order.sla);

  if (
    (order.assignmentState === "unevaluated" && (order.priority === "Emergency" || order.priority === "Critical")) ||
    (order.priority === "Emergency" && slaMinutes <= settings.emergencySlaMinutes)
  ) {
    return "dangerZone";
  }

  if (
    order.assignmentState === "unevaluated" ||
    order.status === "Ready to bundle" ||
    (order.priority === "High" && slaMinutes <= settings.highPrioritySlaMinutes) ||
    (order.priority === "Critical" && slaMinutes <= settings.criticalSlaMinutes)
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

function currencyNumber(value: string): number {
  const parsedValue = Number(value.replace(/[^0-9.]/g, ""));

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function workOrderSearchText(order: WorkOrder): string {
  return [
    order.id,
    order.type,
    order.domain,
    order.priority,
    order.status,
    order.district,
    order.sla,
    order.impact,
    order.crew,
    assignmentLabel(order.assignmentState),
    ...order.skills,
    ...order.equipment
  ].join(" ").toLowerCase();
}

function crewSearchText(crew: CrewOption): string {
  return [
    crew.name,
    crew.crewType,
    crew.district,
    crew.status,
    vehicleLabel(crew.vehicleIcon),
    crew.currentAssignment,
    crew.equipment,
    crew.overtime,
    crew.hourly,
    crew.effectiveCost,
    ...crew.certifications,
    ...crew.strengths,
    ...crew.penalties
  ].join(" ").toLowerCase();
}

function matchesWorkOrderFilter(order: WorkOrder, filter: WorkOrderFilterKey, settings: OperationsSettings = defaultOperationsSettings): boolean {
  if (filter === "emergency") {
    return order.priority === "Emergency";
  }

  if (filter === "critical") {
    return order.priority === "Critical" || order.priority === "High";
  }

  if (filter === "slaRisk") {
    return getWorkOrderHealth(order, settings) !== "onTrack";
  }

  if (filter === "gas") {
    return order.domain === "Gas";
  }

  if (filter === "electric") {
    return order.domain === "Electric";
  }

  if (filter === "assigned") {
    return order.assignmentState === "assigned";
  }

  return order.assignmentState !== "assigned";
}

function matchesWorkforceFilter(crew: CrewOption, filter: WorkforceFilterKey): boolean {
  if (filter === "available") {
    return crew.status === "Available";
  }

  if (filter === "assigned") {
    return crew.status === "Assigned";
  }

  if (filter === "gas") {
    return getCrewMapDomain(crew) === "gas";
  }

  if (filter === "power") {
    return getCrewMapDomain(crew) === "power";
  }

  if (filter === "highFit") {
    return crew.fit >= 90;
  }

  return crew.overtime !== "Low";
}

function workOrderPriorityColor(priority: WorkOrder["priority"]): string {
  if (priority === "Emergency") {
    return "#dc2626";
  }

  if (priority === "Critical") {
    return "#f97316";
  }

  return "#16a34a";
}

function workOrderMarkerStyle(order: WorkOrder, _isSelected: boolean): Pick<EsriMarkerConfig, "angle" | "color" | "outlineColor" | "shape" | "size"> {
  if (order.assignmentState === "assigned") {
    return {
      color: order.domain === "Gas" ? "#facc15" : "#2563eb",
      outlineColor: workOrderPriorityColor(order.priority),
      shape: "square",
      size: order.priority === "Emergency" ? 15 : 14
    };
  }

  if (order.priority === "Emergency") {
    return {
      angle: order.domain === "Electric" ? 180 : 0,
      color: workOrderPriorityColor(order.priority),
      outlineColor: "#ffffff",
      shape: "triangle",
      size: 14
    };
  }

  return {
    angle: order.domain === "Electric" ? 180 : 0,
    color: workOrderPriorityColor(order.priority),
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

function shouldUseBucketTruckSymbol(crew: CrewOption): boolean {
  return crew.crewType === "Gas Inspection"
    || crew.crewType === "Electric Trouble"
    || crew.crewType === "Line Patrol"
    || crew.crewType === "Vegetation";
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

function isCrewStatusEligibleForOrder(crew: CrewOption, order: WorkOrder): boolean {
  if (crew.status === "Off") {
    return false;
  }

  if (crew.status === "On Call") {
    return order.priority === "Emergency";
  }

  return true;
}

function getCrewAvailabilityRank(status: string): number {
  if (status === "Available") {
    return 0;
  }

  if (status === "On Call") {
    return 1;
  }

  if (status === "Assigned") {
    return 2;
  }

  return 3;
}

function getCrewAvailabilityScore(crew: CrewOption, settings: OperationsSettings): number {
  if (crew.status === "Available") {
    return 100;
  }

  if (crew.status === "On Call") {
    return Math.max(0, 100 - Math.round(settings.assignedCrewScorePenalty / 2));
  }

  return Math.max(0, 100 - settings.assignedCrewScorePenalty);
}

function getCandidateCrews(order: WorkOrder, crewPool: CrewOption[] = initialCrews): CrewOption[] {
  const requiredFamilies = getRequiredCrewFamilies(order);

  return crewPool
    .filter((crew) => (
      isCrewStatusEligibleForOrder(crew, order) &&
      requiredFamilies.some((family) => crew.crewType.includes(family) || crew.name.includes(family))
    ))
    .sort((a, b) => {
      const availabilityDifference = getCrewAvailabilityRank(a.status) - getCrewAvailabilityRank(b.status);
      if (availabilityDifference !== 0) {
        return availabilityDifference;
      }

      if (a.equipment !== "Limited" && b.equipment === "Limited") {
        return -1;
      }

      if (a.equipment === "Limited" && b.equipment !== "Limited") {
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

interface CrewScheduleAssignment {
  order: WorkOrder;
  dayKey: string;
  dayLabel: string;
  pickupStart: Date;
  materialPickupEnd: Date;
  travelStart: Date;
  jobStart: Date;
  jobEnd: Date;
  totalMinutes: number;
  materialSummary: string;
  overflow: boolean;
}

interface InventoryAssemblyItem {
  sku: string;
  name: string;
  category: "Electric Material" | "Gas Material" | "Civil Material";
  unit: string;
  quantity: number;
}

interface InventoryAssembly {
  id: string;
  name: string;
  domain: WorkOrder["domain"];
  match: (order: WorkOrder) => boolean;
  items: InventoryAssemblyItem[];
}

interface InventoryUsageRow {
  sku: string;
  name: string;
  category: InventoryAssemblyItem["category"];
  unit: string;
  quantity: number;
  assemblies: string[];
  orders: string[];
}

const inventoryAssemblies: InventoryAssembly[] = [
  {
    id: "gas-leak-repair",
    name: "Gas leak repair assembly",
    domain: "Gas",
    match: (order) => order.domain === "Gas" && order.type.includes("Leak"),
    items: [
      { sku: "G-PE-2IN", name: "2 in PE gas pipe", category: "Gas Material", unit: "ft", quantity: 40 },
      { sku: "G-CPL-2IN", name: "2 in electrofusion coupling", category: "Gas Material", unit: "ea", quantity: 4 },
      { sku: "G-VALVE-2IN", name: "2 in gas curb valve", category: "Gas Material", unit: "ea", quantity: 1 },
      { sku: "C-TRACER-12", name: "12 AWG tracer wire", category: "Civil Material", unit: "ft", quantity: 45 },
      { sku: "C-WARN-GAS", name: "Gas warning tape", category: "Civil Material", unit: "ft", quantity: 45 }
    ]
  },
  {
    id: "gas-service-install",
    name: "Gas service installation assembly",
    domain: "Gas",
    match: (order) => order.domain === "Gas" && order.type.includes("Service Installation"),
    items: [
      { sku: "G-PE-1IN", name: "1 in CTS PE service pipe", category: "Gas Material", unit: "ft", quantity: 75 },
      { sku: "G-RISER-1IN", name: "1 in anodeless riser", category: "Gas Material", unit: "ea", quantity: 1 },
      { sku: "G-METER-SET", name: "Residential meter set assembly", category: "Gas Material", unit: "ea", quantity: 1 },
      { sku: "G-REG-SVC", name: "Service pressure regulator", category: "Gas Material", unit: "ea", quantity: 1 },
      { sku: "C-TRACER-12", name: "12 AWG tracer wire", category: "Civil Material", unit: "ft", quantity: 80 }
    ]
  },
  {
    id: "gas-regulator-maintenance",
    name: "Gas regulator maintenance assembly",
    domain: "Gas",
    match: (order) => order.domain === "Gas" && order.type.includes("Regulator"),
    items: [
      { sku: "G-REG-DIST", name: "Distribution regulator kit", category: "Gas Material", unit: "ea", quantity: 1 },
      { sku: "G-VALVE-2IN", name: "2 in gas curb valve", category: "Gas Material", unit: "ea", quantity: 1 },
      { sku: "G-GASKET-KIT", name: "Gas flange gasket kit", category: "Gas Material", unit: "set", quantity: 1 }
    ]
  },
  {
    id: "gas-corrosion-repair",
    name: "Gas corrosion mitigation assembly",
    domain: "Gas",
    match: (order) => order.domain === "Gas" && order.type.includes("Corrosion"),
    items: [
      { sku: "G-ANODE-17LB", name: "17 lb magnesium anode", category: "Gas Material", unit: "ea", quantity: 2 },
      { sku: "G-TEST-STATION", name: "Cathodic protection test station", category: "Gas Material", unit: "ea", quantity: 1 },
      { sku: "G-COATING-KIT", name: "Pipe coating repair kit", category: "Gas Material", unit: "set", quantity: 1 }
    ]
  },
  {
    id: "electric-transformer-replacement",
    name: "Transformer replacement assembly",
    domain: "Electric",
    match: (order) => order.domain === "Electric" && order.type.includes("Transformer"),
    items: [
      { sku: "E-XFMR-50KVA", name: "50 kVA distribution transformer", category: "Electric Material", unit: "ea", quantity: 1 },
      { sku: "E-FUSE-CUTOUT", name: "15 kV fuse cutout", category: "Electric Material", unit: "ea", quantity: 1 },
      { sku: "E-ARRESTER-10KV", name: "10 kV lightning arrester", category: "Electric Material", unit: "ea", quantity: 1 },
      { sku: "E-WIRE-1/0AL", name: "1/0 AL triplex secondary wire", category: "Electric Material", unit: "ft", quantity: 120 }
    ]
  },
  {
    id: "electric-pole-replacement",
    name: "Pole replacement assembly",
    domain: "Electric",
    match: (order) => order.domain === "Electric" && order.type.includes("Pole"),
    items: [
      { sku: "E-POLE-45", name: "45 ft class 3 wood pole", category: "Electric Material", unit: "ea", quantity: 1 },
      { sku: "E-XARM-8FT", name: "8 ft fiberglass crossarm", category: "Electric Material", unit: "ea", quantity: 1 },
      { sku: "E-GUY-ANCHOR", name: "Down guy anchor assembly", category: "Electric Material", unit: "ea", quantity: 1 },
      { sku: "E-WIRE-336AAC", name: "336 AAC primary conductor", category: "Electric Material", unit: "ft", quantity: 300 }
    ]
  },
  {
    id: "electric-underground-cable",
    name: "Underground cable repair assembly",
    domain: "Electric",
    match: (order) => order.domain === "Electric" && order.type.includes("Underground"),
    items: [
      { sku: "E-CONDUIT-3IN", name: "3 in PVC conduit", category: "Civil Material", unit: "ft", quantity: 120 },
      { sku: "E-WIRE-500KCMIL", name: "500 kcmil primary cable", category: "Electric Material", unit: "ft", quantity: 360 },
      { sku: "E-SPLICE-15KV", name: "15 kV cable splice kit", category: "Electric Material", unit: "ea", quantity: 2 },
      { sku: "E-HANDHOLE-24", name: "24 in electric handhole", category: "Civil Material", unit: "ea", quantity: 1 }
    ]
  },
  {
    id: "electric-feeder-restoration",
    name: "Feeder restoration assembly",
    domain: "Electric",
    match: (order) => order.domain === "Electric" && (order.type.includes("Feeder") || order.type.includes("Outage") || order.type.includes("Trouble")),
    items: [
      { sku: "E-WIRE-336AAC", name: "336 AAC primary conductor", category: "Electric Material", unit: "ft", quantity: 600 },
      { sku: "E-FUSE-LINK", name: "Fuse link", category: "Electric Material", unit: "ea", quantity: 3 },
      { sku: "E-INSULATOR-PIN", name: "15 kV pin insulator", category: "Electric Material", unit: "ea", quantity: 6 }
    ]
  },
  {
    id: "electric-vegetation-release",
    name: "Vegetation line release assembly",
    domain: "Electric",
    match: (order) => order.domain === "Electric" && order.type.includes("Vegetation"),
    items: [
      { sku: "E-TREE-GUARD", name: "Tree wire guard", category: "Electric Material", unit: "ea", quantity: 4 },
      { sku: "E-WIRE-TIE", name: "Covered conductor tie", category: "Electric Material", unit: "ea", quantity: 12 }
    ]
  }
];

function formatClockTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatScheduleDay(date: Date): string {
  return date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

function formatDateInput(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function isSameReportDay(value: string | undefined, reportDate: string): boolean {
  if (!value) {
    return false;
  }

  return formatDateInput(new Date(value)) === reportDate;
}

function getReportWeekRange(reportDate: string): { start: Date; end: Date } {
  const start = new Date(`${reportDate}T00:00:00`);
  const day = start.getDay();
  start.setDate(start.getDate() - day);

  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  return { start, end };
}

function isWithinReportWeek(value: string | undefined, reportDate: string): boolean {
  if (!value) {
    return false;
  }

  const date = new Date(value);
  const { start, end } = getReportWeekRange(reportDate);

  return date >= start && date < end;
}

function getInventoryAssemblyForOrder(order: WorkOrder): InventoryAssembly {
  return inventoryAssemblies.find((assembly) => assembly.match(order))
    ?? inventoryAssemblies.find((assembly) => assembly.domain === order.domain)
    ?? inventoryAssemblies[0];
}

function getInventoryUsageRows(workOrders: WorkOrder[]): InventoryUsageRow[] {
  const usageRows = workOrders.reduce<Record<string, InventoryUsageRow>>((rows, order) => {
    const assembly = getInventoryAssemblyForOrder(order);

    assembly.items.forEach((item) => {
      const currentRow = rows[item.sku] ?? {
        sku: item.sku,
        name: item.name,
        category: item.category,
        unit: item.unit,
        quantity: 0,
        assemblies: [],
        orders: []
      };

      rows[item.sku] = {
        ...currentRow,
        quantity: currentRow.quantity + item.quantity,
        assemblies: currentRow.assemblies.includes(assembly.name) ? currentRow.assemblies : [...currentRow.assemblies, assembly.name],
        orders: currentRow.orders.includes(order.id) ? currentRow.orders : [...currentRow.orders, order.id]
      };
    });

    return rows;
  }, {});

  return Object.values(usageRows).sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }

    return b.quantity - a.quantity;
  });
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

function getScheduleWindowItems(order: WorkOrder, crew?: CrewOption, settings: OperationsSettings = defaultOperationsSettings): ScheduleWindowItem[] {
  const steps = getScheduleTemplate(order);

  if (order.assignmentState !== "assigned" || !crew) {
    return [
      { label: "Warehouse material pickup", meta: `${formatDuration(getMaterialPickupMinutes(order, settings))} estimate when assigned`, tone: "success" },
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
  const materialPickupMinutes = getMaterialPickupMinutes(order, settings);
  const travelMinutes = parseMinutes(crew.eta);
  const materialPickupEnd = addMinutes(assignedAt, materialPickupMinutes);
  const jobStart = addMinutes(materialPickupEnd, travelMinutes);
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
    { label: "Warehouse material pickup", meta: `${formatClockTime(assignedAt)} - ${formatClockTime(materialPickupEnd)} (${formatDuration(materialPickupMinutes)})`, tone: "success" },
    { label: "Travel to job", meta: `${formatClockTime(materialPickupEnd)} - ${formatClockTime(jobStart)} (${formatDuration(travelMinutes)})`, tone: "success" },
    { label: "Job starts", meta: formatClockTime(jobStart), tone: "success" },
    ...scheduledSteps,
    { label: "Complete", meta: formatClockTime(cursor), tone: "primary" }
  ];
}

function getWorkOrderFieldMinutes(order: WorkOrder): number {
  return getScheduleTemplate(order).reduce((total, step) => total + step.estimateMinutes, 0);
}

function getMaterialPickupMinutes(order: WorkOrder, settings: OperationsSettings = defaultOperationsSettings): number {
  const assembly = getInventoryAssemblyForOrder(order);

  return assembly.items.length ? settings.materialPickupMinutes : 0;
}

function getMaterialSummary(order: WorkOrder): string {
  const assembly = getInventoryAssemblyForOrder(order);

  return assembly.items.slice(0, 3).map((item) => `${item.quantity} ${item.unit} ${item.name}`).join(", ");
}

function getCrewScheduleAssignments(crew: CrewOption, workOrders: WorkOrder[], settings: OperationsSettings = defaultOperationsSettings): CrewScheduleAssignment[] {
  const dailyLimitMinutes = settings.dailyCrewLimitHours * 60;
  const now = new Date();
  const assignedOrders = workOrders
    .filter((order) => order.assignmentState === "assigned" && order.crew === crew.name)
    .sort((a, b) => {
      if (a.priority === "Emergency" && b.priority !== "Emergency") {
        return -1;
      }

      if (a.priority !== "Emergency" && b.priority === "Emergency") {
        return 1;
      }

      return new Date(a.assignedAt ?? 0).getTime() - new Date(b.assignedAt ?? 0).getTime();
    });

  let dayStart = new Date(now);
  dayStart.setHours(7, 0, 0, 0);

  if (now > dayStart) {
    dayStart = new Date(now);
  }

  let cursor = new Date(dayStart);
  let dayUsedMinutes = 0;

  return assignedOrders.map((order) => {
    const materialPickupMinutes = getMaterialPickupMinutes(order, settings);
    const travelMinutes = parseMinutes(crew.eta);
    const fieldMinutes = getWorkOrderFieldMinutes(order);
    const totalMinutes = materialPickupMinutes + travelMinutes + fieldMinutes;
    const assignedAt = order.assignedAt ? new Date(order.assignedAt) : now;
    const earliestStart = assignedAt > cursor ? assignedAt : cursor;
    const wouldExceedDailyLimit = dayUsedMinutes > 0 && dayUsedMinutes + totalMinutes > dailyLimitMinutes;
    const shouldRollToNextDay = wouldExceedDailyLimit && order.priority !== "Emergency";

    if (shouldRollToNextDay) {
      dayStart = new Date(dayStart);
      dayStart.setDate(dayStart.getDate() + 1);
      dayStart.setHours(7, 0, 0, 0);
      cursor = new Date(dayStart);
      dayUsedMinutes = 0;
    } else {
      cursor = earliestStart;
    }

    const pickupStart = new Date(cursor);
    const materialPickupEnd = addMinutes(pickupStart, materialPickupMinutes);
    const travelStart = new Date(materialPickupEnd);
    const jobStart = addMinutes(travelStart, travelMinutes);
    const jobEnd = addMinutes(jobStart, fieldMinutes);
    const assignment: CrewScheduleAssignment = {
      order,
      dayKey: dayStart.toDateString(),
      dayLabel: formatScheduleDay(dayStart),
      pickupStart,
      materialPickupEnd,
      travelStart,
      jobStart,
      jobEnd,
      totalMinutes,
      materialSummary: getMaterialSummary(order),
      overflow: dayUsedMinutes + totalMinutes > dailyLimitMinutes
    };

    cursor = jobEnd;
    dayUsedMinutes += totalMinutes;

    return assignment;
  });
}

interface RankedCrewOption extends CrewOption {
  decisionScore: number;
  decisionReasons: string[];
}

function getRankedCandidateCrews(order: WorkOrder, crewPool: CrewOption[] = initialCrews, settings: OperationsSettings = defaultOperationsSettings): RankedCrewOption[] {
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
      const availabilityScore = getCrewAvailabilityScore(crew, settings);
      const equipmentScore = crew.equipment === "Ready" ? 100 : crew.equipment === "Staged" ? 85 : Math.max(0, 100 - settings.limitedEquipmentScorePenalty);
      const weightTotal = Math.max(1, settings.evaluation.skillFitWeight + settings.evaluation.effectiveCostWeight + settings.evaluation.etaWeight + settings.evaluation.availabilityWeight + settings.evaluation.equipmentWeight);
      const decisionScore = Math.round((
        (crew.fit * settings.evaluation.skillFitWeight) +
        (costScore * settings.evaluation.effectiveCostWeight) +
        (etaScore * settings.evaluation.etaWeight) +
        (availabilityScore * settings.evaluation.availabilityWeight) +
        (equipmentScore * settings.evaluation.equipmentWeight)
      ) / weightTotal);
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
    size: shouldUseBucketTruckSymbol(crew)
      ? candidateCrewNames.has(crew.name) || crew.name === selectedOrder.crew ? 28 : 25
      : candidateCrewNames.has(crew.name) || crew.name === selectedOrder.crew ? 24 : 21,
    icon: crew.vehicleIcon,
    symbolPath: shouldUseBucketTruckSymbol(crew)
      ? "M1 18h2v2H1zm3 0h14v2H4zm15-5l1 2h3v3h-4zm-8-3l5-4h2l-5 4zm11-1h2v2h-2zm-3-3h3v2h-3zM5 20a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm14 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"
      : undefined,
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

function WorkOrderTable({
  selectedId,
  onDispatch,
  onSelect,
  onUnassign,
  workOrders
}: {
  selectedId: string;
  onDispatch: (id: string) => void;
  onSelect: (id: string) => void;
  onUnassign: (id: string) => void;
  workOrders: WorkOrder[];
}) {
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
          <TableCell align="right">Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {workOrders.map((order) => {
          const isAssigned = order.assignmentState === "assigned";

          return (
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
              <TableCell align="right">
                <Button
                  color={isAssigned ? "warning" : "primary"}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (isAssigned) {
                      onUnassign(order.id);
                      return;
                    }

                    onDispatch(order.id);
                  }}
                  size="small"
                  startIcon={isAssigned ? <PersonRemoveIcon /> : <LocalShippingIcon />}
                  variant={isAssigned ? "outlined" : "contained"}
                >
                  {isAssigned ? "Unassign" : "Dispatch"}
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
        {!workOrders.length && (
          <TableRow>
            <TableCell colSpan={8}>
              <Typography color="text.secondary" sx={{ py: 2, textAlign: "center" }} variant="body2">
                No work orders match the current find or filter settings.
              </Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function DashboardScreen({ selectedOrder, markers, crews, workOrders, settings }: { selectedOrder: WorkOrder; markers: EsriMarkerConfig[]; crews: CrewOption[]; workOrders: WorkOrder[]; settings: OperationsSettings }) {
  const today = new Date();
  const scheduleStartHour = 7;
  const scheduleEndHour = 17;
  const scheduleMinutes = (scheduleEndHour - scheduleStartHour) * 60;
  const timelineHours = Array.from({ length: scheduleEndHour - scheduleStartHour + 1 }, (_, index) => scheduleStartHour + index);
  const visibleCrews = crews.filter((crew) => crew.status !== "Off").slice(0, 10);
  const todayAssignments = visibleCrews.flatMap((crew) => (
    getCrewScheduleAssignments(crew, workOrders, settings)
      .filter((assignment) => assignment.pickupStart.toDateString() === today.toDateString())
      .map((assignment) => ({ crew, assignment }))
  ));
  const scheduledOrderIds = new Set(todayAssignments.map(({ assignment }) => assignment.order.id));
  const unallocatedOrders = workOrders
    .filter((order) => order.assignmentState !== "assigned" || !scheduledOrderIds.has(order.id))
    .sort((a, b) => parseSlaMinutes(a.sla) - parseSlaMinutes(b.sla))
    .slice(0, 12);
  const emergencyOrCriticalCount = workOrders.filter((order) => order.priority === "Emergency" || order.priority === "Critical").length;
  const availableCrewCount = crews.filter((crew) => crew.status === "Available").length;
  const onCallCrewCount = crews.filter((crew) => crew.status === "On Call").length;
  const assignedCrewCount = crews.filter((crew) => crew.status === "Assigned").length;
  const slaRiskCount = workOrders.filter((order) => getWorkOrderHealth(order, settings) !== "onTrack").length;

  const getTimelinePosition = (date: Date) => {
    const minutes = ((date.getHours() - scheduleStartHour) * 60) + date.getMinutes();

    return Math.min(100, Math.max(0, (minutes / scheduleMinutes) * 100));
  };

  const getPriorityFill = (priority: WorkOrder["priority"]) => {
    if (priority === "Emergency") {
      return "#dc2626";
    }

    if (priority === "Critical") {
      return "#f97316";
    }

    if (priority === "High") {
      return "#2563eb";
    }

    return "#16a34a";
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap">
          <Box>
            <Typography variant="h2">Dashboard</Typography>
            <Typography color="text.secondary">Daily schedule for today with crews, assigned work, SLA risk, and unallocated jobs.</Typography>
          </Box>
          <Stack direction="row" gap={1} flexWrap="wrap">
            <Chip icon={<WarningAmberIcon />} color="error" label={`${slaRiskCount} SLA risk`} />
            <Chip icon={<CheckCircleIcon />} color="success" label={`${availableCrewCount} available`} />
            <Chip label={`${onCallCrewCount} on call`} />
          </Stack>
        </Stack>
      </Grid>

      <Grid item md={3} xs={12}><MetricTile label="Active Work Orders" value={`${workOrders.length}`} detail={`${emergencyOrCriticalCount} emergency or critical`} tone="primary" /></Grid>
      <Grid item md={3} xs={12}><MetricTile label="Scheduled Today" value={`${todayAssignments.length}`} detail="Crew schedule blocks in view" tone="success" /></Grid>
      <Grid item md={3} xs={12}><MetricTile label="Crew Coverage" value={`${assignedCrewCount} assigned`} detail={`${availableCrewCount} available, ${onCallCrewCount} on call`} tone="warning" /></Grid>
      <Grid item md={3} xs={12}><MetricTile label="Map Signals" value={`${markers.length}`} detail="Work order and crew markers" tone="primary" /></Grid>

      <Grid item xs={12}>
        <Paper variant="outlined" sx={{ overflow: "hidden" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1, bgcolor: "grey.50", borderBottom: "1px solid", borderColor: "divider" }}>
            <Stack direction="row" alignItems="center" gap={1}>
              <AssessmentIcon color="primary" />
              <Typography fontWeight={900}>Today Schedule Matrix</Typography>
            </Stack>
            <Chip label={today.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} size="small" />
          </Stack>
          <Box sx={{ overflowX: "auto" }}>
            <Box sx={{ minWidth: 980 }}>
              <Box sx={{ display: "grid", gridTemplateColumns: "220px 1fr", borderBottom: "1px solid", borderColor: "divider" }}>
                <Box sx={{ px: 1.5, py: 1, bgcolor: "grey.100", borderRight: "1px solid", borderColor: "divider" }}>
                  <Typography color="text.secondary" fontWeight={900} variant="body2">Resource</Typography>
                </Box>
                <Box sx={{ display: "grid", gridTemplateColumns: `repeat(${timelineHours.length}, 1fr)`, bgcolor: "grey.100" }}>
                  {timelineHours.map((hour) => (
                    <Box key={hour} sx={{ px: 0.75, py: 1, borderLeft: "1px solid", borderColor: "divider" }}>
                      <Typography color="text.secondary" fontWeight={800} variant="caption">{hour > 12 ? hour - 12 : hour}:00</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {visibleCrews.map((crew) => {
                const crewAssignments = todayAssignments
                  .filter(({ crew: assignmentCrew }) => assignmentCrew.name === crew.name)
                  .map(({ assignment }) => assignment)
                  .sort((a, b) => a.pickupStart.getTime() - b.pickupStart.getTime());

                return (
                  <Box key={crew.name} sx={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: 70, borderBottom: "1px solid", borderColor: "divider" }}>
                    <Box sx={{ px: 1.5, py: 1, borderRight: "1px solid", borderColor: "divider", bgcolor: crew.status === "On Call" ? "#fff7ed" : "white" }}>
                      <Typography fontWeight={900} variant="body2">{crew.name}</Typography>
                      <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mt: 0.75 }}>
                        <Chip color={crew.status === "Available" ? "success" : crew.status === "On Call" ? "warning" : "default"} label={crew.status} size="small" />
                        <Chip label={crew.crewType} size="small" />
                      </Stack>
                    </Box>
                    <Box sx={{ position: "relative", minHeight: 70, backgroundImage: "linear-gradient(to right, rgba(148, 163, 184, 0.32) 1px, transparent 1px)", backgroundSize: `${100 / (timelineHours.length - 1)}% 100%` }}>
                      {crewAssignments.map((assignment) => {
                        const left = getTimelinePosition(assignment.pickupStart);
                        const right = getTimelinePosition(assignment.jobEnd);
                        const width = Math.max(7, right - left);

                        return (
                          <Box
                            key={assignment.order.id}
                            sx={{
                              position: "absolute",
                              left: `${left}%`,
                              top: 10,
                              width: `${width}%`,
                              minWidth: 92,
                              maxWidth: "calc(100% - 8px)",
                              height: 48,
                              px: 1,
                              py: 0.5,
                              bgcolor: getPriorityFill(assignment.order.priority),
                              borderLeft: "4px solid rgba(255, 255, 255, 0.85)",
                              borderRadius: 0.75,
                              boxShadow: "0 1px 4px rgba(15, 23, 42, 0.18)",
                              color: "white",
                              overflow: "hidden"
                            }}
                          >
                            <Typography fontWeight={900} noWrap variant="caption">{assignment.order.id}</Typography>
                            <Typography noWrap variant="caption" sx={{ display: "block", opacity: 0.92 }}>{formatClockTime(assignment.jobStart)}-{formatClockTime(assignment.jobEnd)}</Typography>
                          </Box>
                        );
                      })}
                      {!crewAssignments.length && (
                        <Typography color="text.secondary" sx={{ position: "absolute", top: 24, left: 12 }} variant="body2">Open capacity</Typography>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Paper>
      </Grid>

      <Grid item lg={8} xs={12}>
        <Paper variant="outlined" sx={{ overflow: "hidden" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1, bgcolor: "grey.50", borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography fontWeight={900}>Unallocated and At-Risk Work</Typography>
            <Chip label={`${unallocatedOrders.length} in planning queue`} size="small" />
          </Stack>
          <TableContainer sx={{ maxHeight: 330 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Work Order</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>SLA</TableCell>
                  <TableCell>District</TableCell>
                  <TableCell>State</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {unallocatedOrders.map((order) => (
                  <TableRow key={order.id} selected={order.id === selectedOrder.id}>
                    <TableCell sx={{ fontWeight: 900 }}>{order.id}</TableCell>
                    <TableCell>{order.type}</TableCell>
                    <TableCell><Chip color={priorityColor(order.priority)} label={order.priority} size="small" /></TableCell>
                    <TableCell>{order.sla}</TableCell>
                    <TableCell>{order.district}</TableCell>
                    <TableCell><Chip color={healthColor(getWorkOrderHealth(order, settings))} label={assignmentLabel(order.assignmentState)} size="small" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>

      <Grid item lg={4} xs={12}>
        <Stack spacing={2}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography fontWeight={900}>Selected Work Order</Typography>
            <Divider sx={{ my: 1.5 }} />
            <Typography fontWeight={900}>{selectedOrder.id} - {selectedOrder.type}</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.75 }}>{selectedOrder.impact}</Typography>
            <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 1.5 }}>
              <Chip color={priorityColor(selectedOrder.priority)} label={selectedOrder.priority} size="small" />
              <Chip color={healthColor(getWorkOrderHealth(selectedOrder, settings))} label={selectedOrder.sla} size="small" />
              <Chip label={selectedOrder.district} size="small" />
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography fontWeight={900}>Schedule Legend</Typography>
            <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 1.5 }}>
              <Chip sx={{ bgcolor: "#dc2626", color: "white" }} label="Emergency" size="small" />
              <Chip sx={{ bgcolor: "#f97316", color: "white" }} label="Critical" size="small" />
              <Chip sx={{ bgcolor: "#2563eb", color: "white" }} label="High" size="small" />
              <Chip sx={{ bgcolor: "#16a34a", color: "white" }} label="Routine" size="small" />
            </Stack>
          </Paper>
        </Stack>
      </Grid>
    </Grid>
  );
}

function PerformanceScreen({ selectedOrder, markers, crews, workOrders, settings }: { selectedOrder: WorkOrder; markers: EsriMarkerConfig[]; crews: CrewOption[]; workOrders: WorkOrder[]; settings: OperationsSettings }) {
  const statusCounts = workOrders.reduce<Record<string, number>>((counts, order) => ({
    ...counts,
    [order.status]: (counts[order.status] ?? 0) + 1
  }), {});
  const statusBreakdown = Object.entries(statusCounts);
  const maxStatusCount = Math.max(1, ...statusBreakdown.map(([, count]) => count));
  const emergencyOrCriticalCount = workOrders.filter((order) => order.priority === "Emergency" || order.priority === "Critical").length;
  const availableCrewCount = crews.filter((crew) => crew.status === "Available").length;
  const assignedCrewCount = crews.filter((crew) => crew.status === "Assigned").length;
  const slaRiskCount = workOrders.filter((order) => getWorkOrderHealth(order, settings) !== "onTrack").length;
  const districtEfficiency = Object.entries(
    workOrders.reduce<Record<string, { total: number; healthy: number }>>((counts, order) => {
      const districtCounts = counts[order.district] ?? { total: 0, healthy: 0 };
      const isHealthy = getWorkOrderHealth(order, settings) === "onTrack";

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
            <Typography variant="h2">Performance</Typography>
            <Typography color="text.secondary">NorthStar Utilities operating metrics for gas and electric field response.</Typography>
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

function WorkOrdersScreen({
  selectedOrder,
  onDispatchOrder,
  onSelectOrder,
  onUnassignOrder,
  settings,
  workOrders
}: {
  selectedOrder: WorkOrder;
  onDispatchOrder: (id: string) => void;
  onSelectOrder: (id: string) => void;
  onUnassignOrder: (id: string) => void;
  settings: OperationsSettings;
  workOrders: WorkOrder[];
}) {
  const [isFindOpen, setIsFindOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<WorkOrderFilterKey[]>([]);
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const workOrderFilters: { key: WorkOrderFilterKey; label: string }[] = [
    { key: "emergency", label: "Emergency priority" },
    { key: "critical", label: "Critical or high" },
    { key: "slaRisk", label: "SLA risk" },
    { key: "gas", label: "Gas work" },
    { key: "electric", label: "Power work" },
    { key: "assigned", label: "Assigned" },
    { key: "needsAssignment", label: "Needs assignment" }
  ];
  const filteredWorkOrders = workOrders.filter((order) => {
    const matchesSearch = !normalizedSearchQuery || workOrderSearchText(order).includes(normalizedSearchQuery);
    const matchesFilters = activeFilters.every((filter) => matchesWorkOrderFilter(order, filter, settings));

    return matchesSearch && matchesFilters;
  });
  const filterMenuOpen = Boolean(filterAnchor);

  function toggleFilter(filter: WorkOrderFilterKey) {
    setActiveFilters((currentFilters) => (
      currentFilters.includes(filter)
        ? currentFilters.filter((currentFilter) => currentFilter !== filter)
        : [...currentFilters, filter]
    ));
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap">
          <Box>
            <Typography variant="h2">Work Orders</Typography>
            <Typography color="text.secondary">Dispatch queue with priority, SLA, skills, equipment, customer impact, and assignment state.</Typography>
          </Box>
          <Stack direction="row" gap={1}>
            <Button color={isFindOpen ? "primary" : "inherit"} onClick={() => setIsFindOpen((currentValue) => !currentValue)} startIcon={<SearchIcon />} size="small" variant="outlined">Find</Button>
            <Button color={activeFilters.length ? "primary" : "inherit"} onClick={(event) => setFilterAnchor(event.currentTarget)} startIcon={<FilterListIcon />} size="small" variant="outlined">
              Filters{activeFilters.length ? ` (${activeFilters.length})` : ""}
            </Button>
            <Menu anchorEl={filterAnchor} onClose={() => setFilterAnchor(null)} open={filterMenuOpen}>
              {workOrderFilters.map((filter) => (
                <MenuItem key={filter.key} onClick={() => toggleFilter(filter.key)}>
                  <Checkbox checked={activeFilters.includes(filter.key)} size="small" />
                  {filter.label}
                </MenuItem>
              ))}
              <Divider />
              <MenuItem disabled={!activeFilters.length && !searchQuery} onClick={() => {
                setActiveFilters([]);
                setSearchQuery("");
                setFilterAnchor(null);
              }}>
                Clear all
              </MenuItem>
            </Menu>
          </Stack>
        </Stack>
        {isFindOpen && (
          <TextField
            autoFocus
            fullWidth
            label="Find work orders"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search ID, type, district, crew, skill, equipment, status"
            size="small"
            sx={{ mt: 1.5, maxWidth: 640 }}
            value={searchQuery}
          />
        )}
        {(activeFilters.length > 0 || searchQuery) && (
          <Stack direction="row" alignItems="center" gap={0.75} flexWrap="wrap" sx={{ mt: 1.5 }}>
            {searchQuery && <Chip label={`Find: ${searchQuery}`} onDelete={() => setSearchQuery("")} size="small" />}
            {activeFilters.map((filterKey) => (
              <Chip key={filterKey} label={workOrderFilters.find((filter) => filter.key === filterKey)?.label ?? filterKey} onDelete={() => toggleFilter(filterKey)} size="small" />
            ))}
          </Stack>
        )}
      </Grid>

      <Grid item lg={8} xs={12}>
        <Paper variant="outlined" sx={{ overflow: "hidden" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1, bgcolor: "grey.50", borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography fontWeight={900}>Planner Queue</Typography>
            <Chip label={`${filteredWorkOrders.length} of ${workOrders.length} records`} size="small" />
          </Stack>
          <Box sx={{ maxHeight: 394, overflow: "auto" }}>
            <WorkOrderTable selectedId={selectedOrder.id} onDispatch={onDispatchOrder} onSelect={onSelectOrder} onUnassign={onUnassignOrder} workOrders={filteredWorkOrders} />
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
          <Button
            color={selectedOrder.assignmentState === "assigned" ? "warning" : "primary"}
            fullWidth
            onClick={() => {
              if (selectedOrder.assignmentState === "assigned") {
                onUnassignOrder(selectedOrder.id);
                return;
              }

              onDispatchOrder(selectedOrder.id);
            }}
            startIcon={selectedOrder.assignmentState === "assigned" ? <PersonRemoveIcon /> : <LocalShippingIcon />}
            sx={{ mt: 1.5 }}
            variant={selectedOrder.assignmentState === "assigned" ? "outlined" : "contained"}
          >
            {selectedOrder.assignmentState === "assigned" ? "Unassign Crew" : "Dispatch Work Order"}
          </Button>
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
        {!crews.length && (
          <TableRow>
            <TableCell colSpan={6}>
              <Typography color="text.secondary" sx={{ py: 2, textAlign: "center" }} variant="body2">
                No crews match the current find or filter settings.
              </Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function WorkforceScreen({
  selectedCrewName,
  onSelectCrew,
  crews,
  workOrders,
  settings
}: {
  selectedCrewName: string;
  onSelectCrew: (name: string) => void;
  crews: CrewOption[];
  workOrders: WorkOrder[];
  settings: OperationsSettings;
}) {
  const [isFindOpen, setIsFindOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<WorkforceFilterKey[]>([]);
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
  const [detailMode, setDetailMode] = useState<"details" | "assignedWork">("details");
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const workforceFilters: { key: WorkforceFilterKey; label: string }[] = [
    { key: "available", label: "Available now" },
    { key: "assigned", label: "Assigned" },
    { key: "gas", label: "Gas crews" },
    { key: "power", label: "Power crews" },
    { key: "highFit", label: "Fit 90%+" },
    { key: "overtimeRisk", label: "Overtime risk" }
  ];
  const filteredCrews = crews.filter((crew) => {
    const matchesSearch = !normalizedSearchQuery || crewSearchText(crew).includes(normalizedSearchQuery);
    const matchesFilters = activeFilters.every((filter) => matchesWorkforceFilter(crew, filter));

    return matchesSearch && matchesFilters;
  });
  const selectedCrew = crews.find((crew) => crew.name === selectedCrewName) ?? crews[0];
  const scheduleAssignments = getCrewScheduleAssignments(selectedCrew, workOrders, settings);
  const scheduleAssignmentsByDay = scheduleAssignments.reduce<Record<string, CrewScheduleAssignment[]>>((groups, assignment) => ({
    ...groups,
    [assignment.dayKey]: [...(groups[assignment.dayKey] ?? []), assignment]
  }), {});
  const scheduleDayGroups = Object.entries(scheduleAssignmentsByDay);
  const averageVisibleRate = filteredCrews.length
    ? Math.round(filteredCrews.reduce((total, crew) => total + currencyNumber(crew.hourly), 0) / filteredCrews.length)
    : 0;
  const filterMenuOpen = Boolean(filterAnchor);

  function toggleFilter(filter: WorkforceFilterKey) {
    setActiveFilters((currentFilters) => (
      currentFilters.includes(filter)
        ? currentFilters.filter((currentFilter) => currentFilter !== filter)
        : [...currentFilters, filter]
    ));
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap">
          <Box>
            <Typography variant="h2">Workforce</Typography>
            <Typography color="text.secondary">Crew roster with vehicle type, certifications, assignment state, and dispatch readiness.</Typography>
          </Box>
          <Stack direction="row" gap={1}>
            <Button color={isFindOpen ? "primary" : "inherit"} onClick={() => setIsFindOpen((currentValue) => !currentValue)} startIcon={<SearchIcon />} size="small" variant="outlined">Find</Button>
            <Button color={activeFilters.length ? "primary" : "inherit"} onClick={(event) => setFilterAnchor(event.currentTarget)} startIcon={<FilterListIcon />} size="small" variant="outlined">
              Filters{activeFilters.length ? ` (${activeFilters.length})` : ""}
            </Button>
            <Menu anchorEl={filterAnchor} onClose={() => setFilterAnchor(null)} open={filterMenuOpen}>
              {workforceFilters.map((filter) => (
                <MenuItem key={filter.key} onClick={() => toggleFilter(filter.key)}>
                  <Checkbox checked={activeFilters.includes(filter.key)} size="small" />
                  {filter.label}
                </MenuItem>
              ))}
              <Divider />
              <MenuItem disabled={!activeFilters.length && !searchQuery} onClick={() => {
                setActiveFilters([]);
                setSearchQuery("");
                setFilterAnchor(null);
              }}>
                Clear all
              </MenuItem>
            </Menu>
          </Stack>
        </Stack>
        {isFindOpen && (
          <TextField
            autoFocus
            fullWidth
            label="Find crews"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search crew, type, district, vehicle, certification, equipment, assignment"
            size="small"
            sx={{ mt: 1.5, maxWidth: 640 }}
            value={searchQuery}
          />
        )}
        {(activeFilters.length > 0 || searchQuery) && (
          <Stack direction="row" alignItems="center" gap={0.75} flexWrap="wrap" sx={{ mt: 1.5 }}>
            {searchQuery && <Chip label={`Find: ${searchQuery}`} onDelete={() => setSearchQuery("")} size="small" />}
            {activeFilters.map((filterKey) => (
              <Chip key={filterKey} label={workforceFilters.find((filter) => filter.key === filterKey)?.label ?? filterKey} onDelete={() => toggleFilter(filterKey)} size="small" />
            ))}
          </Stack>
        )}
      </Grid>

      <Grid item lg={8} xs={12}>
        <Paper variant="outlined" sx={{ overflow: "hidden" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1, bgcolor: "grey.50", borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography fontWeight={900}>Crew List</Typography>
            <Stack direction="row" gap={1}>
              <Chip label={`${filteredCrews.length} of ${crews.length} crews`} size="small" />
              {filteredCrews.length > 0 && <Chip label={`Avg $${averageVisibleRate}/hr`} size="small" variant="outlined" />}
            </Stack>
          </Stack>
          <Box sx={{ maxHeight: 394, overflow: "auto" }}>
            <CrewTable selectedName={selectedCrew.name} onSelect={onSelectCrew} crews={filteredCrews} />
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
          <Stack direction="row" gap={1}>
            <Button onClick={() => setDetailMode("details")} size="small" variant={detailMode === "details" ? "contained" : "outlined"}>
              Details
            </Button>
            <Button onClick={() => setDetailMode("assignedWork")} size="small" variant={detailMode === "assignedWork" ? "contained" : "outlined"}>
              Assigned Work ({scheduleAssignments.length})
            </Button>
          </Stack>
          {detailMode === "details" ? (
            <>
              <Grid container spacing={1.25} sx={{ mt: 1.5 }}>
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
            </>
          ) : (
            <Stack spacing={1.5} sx={{ mt: 1.5 }}>
              <Stack direction="row" gap={1} flexWrap="wrap">
                <Chip color="primary" label="15 hr daily limit" size="small" />
                <Chip color="error" label="Emergency stays today" size="small" />
              </Stack>
              {!scheduleAssignments.length ? (
                <Box sx={{ border: "1px dashed", borderColor: "divider", borderRadius: 1, p: 2, textAlign: "center" }}>
                  <Typography fontWeight={900}>No assigned work orders</Typography>
                  <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="body2">Assign this crew from Dispatch to build the daily work plan.</Typography>
                </Box>
              ) : (
                scheduleDayGroups.map(([dayKey, assignments]) => {
                  const dayMinutes = assignments.reduce((total, assignment) => total + assignment.totalMinutes, 0);

                  return (
                    <Box key={dayKey} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, overflow: "hidden" }}>
                      <Stack direction="row" justifyContent="space-between" gap={1} sx={{ px: 1.25, py: 1, bgcolor: "grey.50" }}>
                        <Typography fontWeight={900}>{assignments[0].dayLabel}</Typography>
                        <Chip color={dayMinutes > 15 * 60 ? "warning" : "success"} label={`${formatDuration(dayMinutes)} planned`} size="small" />
                      </Stack>
                      <Stack spacing={1} sx={{ p: 1.25 }}>
                        {assignments.map((assignment) => (
                          <Box key={assignment.order.id} sx={{ borderLeft: "4px solid", borderColor: assignment.order.priority === "Emergency" ? "error.main" : assignment.overflow ? "warning.main" : "primary.main", pl: 1.25 }}>
                            <Stack direction="row" justifyContent="space-between" gap={1}>
                              <Typography fontWeight={900}>{assignment.order.id}</Typography>
                              <Chip color={priorityColor(assignment.order.priority)} label={assignment.order.priority} size="small" />
                            </Stack>
                            <Typography variant="body2">{assignment.order.type}</Typography>
                            <Typography color="text.secondary" variant="body2">
                              Materials {formatClockTime(assignment.pickupStart)} - {formatClockTime(assignment.materialPickupEnd)}; travel {formatClockTime(assignment.travelStart)} - {formatClockTime(assignment.jobStart)}; work {formatClockTime(assignment.jobStart)} - {formatClockTime(assignment.jobEnd)}
                            </Typography>
                            <Typography color="text.secondary" variant="body2">Stage: {assignment.materialSummary}</Typography>
                            {assignment.overflow && (
                              <Typography color="warning.main" fontWeight={800} variant="body2">
                                {assignment.order.priority === "Emergency" ? "Emergency exceeds the daily limit but remains today." : "Rolled after earlier assigned work."}
                              </Typography>
                            )}
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  );
                })
              )}
            </Stack>
          )}
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
  crews,
  settings
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
  settings: OperationsSettings;
}) {
  const [showCrewMarkers, setShowCrewMarkers] = useState(true);
  const [showMapLegend, setShowMapLegend] = useState(true);
  const [selectedDispatchCrewName, setSelectedDispatchCrewName] = useState<string | null>(null);
  const dispatchMarkers = getTaskMapMarkers(activeTask, selectedOrder, showCrewMarkers, workOrders, crews);
  const mappedCrewCount = crews.filter((crew) => Number.isFinite(crew.longitude) && Number.isFinite(crew.latitude)).length;
  const assignedCrew = crews.find((crew) => selectedOrder.assignmentState === "assigned" && crew.name === selectedOrder.crew);
  const rankedCrews = hasSelectedWorkOrder
    ? assignedCrew
      ? [toAssignedCrewRow(assignedCrew, selectedOrder)]
      : getRankedCandidateCrews(selectedOrder, crews, settings)
    : [];
  const selectedDispatchCrew = rankedCrews.find((crew) => crew.name === selectedDispatchCrewName) ?? rankedCrews[0];
  const recommendedCrew = selectedDispatchCrew;
  const scheduleCrew = assignedCrew ?? recommendedCrew;
  const scheduleItems = getScheduleWindowItems(selectedOrder, scheduleCrew, settings);
  const isSelectedOrderAssigned = selectedOrder.assignmentState === "assigned";

  useEffect(() => {
    setSelectedDispatchCrewName(null);
  }, [selectedOrder.id]);

  useEffect(() => {
    if (!selectedDispatchCrewName || rankedCrews.some((crew) => crew.name === selectedDispatchCrewName)) {
      return;
    }

    setSelectedDispatchCrewName(null);
  }, [rankedCrews, selectedDispatchCrewName]);

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
              {isSelectedOrderAssigned ? "This work order is assigned, so only the assigned crew is shown here." : "Select any crew row for special cases. Effective cost estimates total job cost after hourly rate, travel time, overtime risk, productivity, and equipment readiness."}
            </Typography>
          )}
          {!hasSelectedWorkOrder ? (
            <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 260, p: 3, textAlign: "center" }}>
              <Typography fontWeight={900}>Select a work order first</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">Click a work order marker on the map or choose one from the Work Orders queue before possible crews are shown.</Typography>
            </Stack>
          ) : (
          <TableContainer sx={{ maxHeight: 440, overflowX: "auto" }}>
          <Table size="small" stickyHeader sx={{ minWidth: 840 }}>
            <TableHead>
              <TableRow>
                <TableCell>Crew</TableCell>
                <TableCell>Status</TableCell>
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
                <TableRow
                  hover={!isSelectedOrderAssigned}
                  key={crew.name}
                  onClick={() => !isSelectedOrderAssigned && setSelectedDispatchCrewName(crew.name)}
                  selected={crew.name === recommendedCrew?.name}
                  sx={{ cursor: isSelectedOrderAssigned ? "default" : "pointer" }}
                >
                  <TableCell sx={{ fontWeight: 900 }}>{evaluated && !isSelectedOrderAssigned ? `${index + 1}. ` : ""}{crew.name}</TableCell>
                  <TableCell><Chip color={crew.status === "Available" ? "success" : "default"} label={crew.status} size="small" /></TableCell>
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
          <Typography fontWeight={900}>{isSelectedOrderAssigned && recommendedCrew ? `${recommendedCrew.name} is assigned` : evaluated && recommendedCrew ? `Why ${recommendedCrew.name} is selected` : "Evaluation readiness"}</Typography>
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
            {isSelectedOrderAssigned ? `Assigned to ${selectedOrder.crew}` : `Assign ${recommendedCrew?.name ?? "Selected Crew"}`}
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

function ReportsScreen({ crews, workOrders, settings }: { crews: CrewOption[]; workOrders: WorkOrder[]; settings: OperationsSettings }) {
  const [activeReport, setActiveReport] = useState<ReportKey>("dailyLog");
  const [reportDate, setReportDate] = useState(formatDateInput(new Date()));
  const [districtFilter, setDistrictFilter] = useState("All");
  const [domainFilter, setDomainFilter] = useState<"All" | WorkOrder["domain"]>("All");
  const reportOptions: { key: ReportKey; label: string }[] = [
    { key: "dailyLog", label: "Daily Log" },
    { key: "crewSchedules", label: "Crew Schedules" },
    { key: "weeklyInstalled", label: "Weekly Installed" },
    { key: "inventory", label: "Inventory" }
  ];
  const districts = ["All", ...Array.from(new Set(workOrders.map((order) => order.district))).sort()];
  const filteredOrders = workOrders.filter((order) => (
    (districtFilter === "All" || order.district === districtFilter)
    && (domainFilter === "All" || order.domain === domainFilter)
  ));
  const assignedOrders = filteredOrders.filter((order) => order.assignmentState === "assigned");
  const dailyOrders = filteredOrders.filter((order) => isSameReportDay(order.assignedAt, reportDate));
  const weeklyOrders = assignedOrders.filter((order) => isWithinReportWeek(order.assignedAt, reportDate));
  const assignedCrewNames = new Set(assignedOrders.map((order) => order.crew));
  const inventoryUsageRows = getInventoryUsageRows(weeklyOrders);
  const assemblyUsageRows = weeklyOrders.map((order) => ({
    order,
    assembly: getInventoryAssemblyForOrder(order)
  }));
  const weeklyFieldMinutes = weeklyOrders.reduce((total, order) => total + getWorkOrderFieldMinutes(order), 0);
  const reportTitle = reportOptions.find((report) => report.key === activeReport)?.label ?? "Report";

  function renderReportBody(): ReactElement {
    if (activeReport === "crewSchedules") {
      const scheduledCrews = crews.filter((crew) => assignedCrewNames.has(crew.name));

      return (
        <Grid container spacing={2}>
          {scheduledCrews.map((crew) => {
            const assignments = getCrewScheduleAssignments(crew, filteredOrders, settings);
            const plannedMinutes = assignments.reduce((total, assignment) => total + assignment.totalMinutes, 0);

            return (
              <Grid item md={6} xs={12} key={crew.name}>
                <Paper variant="outlined" sx={{ p: 1.5, height: "100%" }}>
                  <Stack direction="row" justifyContent="space-between" gap={1}>
                    <Box>
                      <Typography fontWeight={900}>{crew.name}</Typography>
                      <Typography color="text.secondary" variant="body2">{crew.crewType} - {crew.district}</Typography>
                    </Box>
                    <Chip label={formatDuration(plannedMinutes)} size="small" />
                  </Stack>
                  <Stack spacing={1} sx={{ mt: 1.5 }}>
                    {assignments.slice(0, 4).map((assignment) => (
                      <Box key={assignment.order.id} sx={{ borderLeft: "4px solid", borderColor: assignment.overflow ? "warning.main" : "primary.main", pl: 1 }}>
                        <Typography fontWeight={800}>{assignment.order.id} - {assignment.order.type}</Typography>
                        <Typography color="text.secondary" variant="body2">{assignment.dayLabel}: materials {formatClockTime(assignment.pickupStart)}, job {formatClockTime(assignment.jobStart)} - {formatClockTime(assignment.jobEnd)}</Typography>
                        <Typography color="text.secondary" variant="body2">Stage: {assignment.materialSummary}</Typography>
                      </Box>
                    ))}
                    {!assignments.length && <Typography color="text.secondary" variant="body2">No assigned work in this filter.</Typography>}
                  </Stack>
                </Paper>
              </Grid>
            );
          })}
          {!scheduledCrews.length && <Grid item xs={12}><Paper variant="outlined" sx={{ p: 2 }}><Typography color="text.secondary">No crews have assigned work for the current filters.</Typography></Paper></Grid>}
        </Grid>
      );
    }

    if (activeReport === "weeklyInstalled") {
      return (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Work Order</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Crew</TableCell>
                <TableCell>Field Hours</TableCell>
                <TableCell>Inventory Assembly</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {weeklyOrders.map((order) => {
                const assembly = getInventoryAssemblyForOrder(order);

                return (
                  <TableRow key={order.id}>
                    <TableCell sx={{ fontWeight: 900 }}>{order.id}</TableCell>
                    <TableCell>{order.type}</TableCell>
                    <TableCell>{order.domain}</TableCell>
                    <TableCell>{order.crew}</TableCell>
                    <TableCell>{formatDuration(getWorkOrderFieldMinutes(order))}</TableCell>
                    <TableCell>{assembly.name}</TableCell>
                  </TableRow>
                );
              })}
              {!weeklyOrders.length && <TableRow><TableCell colSpan={6}><Typography color="text.secondary" sx={{ py: 2, textAlign: "center" }}>No assigned work orders in this report week.</Typography></TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }

    if (activeReport === "inventory") {
      return (
        <Stack spacing={2}>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>SKU</TableCell>
                  <TableCell>Inventory Item</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Qty</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell>Assemblies</TableCell>
                  <TableCell>Work Orders</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventoryUsageRows.map((item) => (
                  <TableRow key={item.sku}>
                    <TableCell sx={{ fontWeight: 900 }}>{item.sku}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell><Chip label={item.category} size="small" /></TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{item.assemblies.join(", ")}</TableCell>
                    <TableCell>{item.orders.join(", ")}</TableCell>
                  </TableRow>
                ))}
                {!inventoryUsageRows.length && <TableRow><TableCell colSpan={7}><Typography color="text.secondary" sx={{ py: 2, textAlign: "center" }}>No inventory assemblies consumed in this report week.</Typography></TableCell></TableRow>}
              </TableBody>
            </Table>
          </TableContainer>
          <Paper variant="outlined" sx={{ p: 1.5 }}>
            <Typography fontWeight={900}>Assembly Usage</Typography>
            <Typography color="text.secondary" variant="body2">Material usage is generated from work-order assembly mappings, not crew vehicles or tools.</Typography>
            <Stack spacing={1} sx={{ mt: 1.5 }}>
              {assemblyUsageRows.map(({ order, assembly }) => (
                <Stack key={order.id} direction="row" alignItems="center" justifyContent="space-between" gap={1} sx={{ borderBottom: "1px solid", borderColor: "divider", pb: 1 }}>
                  <Box>
                    <Typography fontWeight={800}>{order.id} - {order.type}</Typography>
                    <Typography color="text.secondary" variant="body2">{assembly.name}</Typography>
                  </Box>
                  <Chip color={order.domain === "Gas" ? "warning" : "primary"} label={order.domain} size="small" />
                </Stack>
              ))}
              {!assemblyUsageRows.length && <Typography color="text.secondary" variant="body2">No assigned work orders matched the current report filters.</Typography>}
            </Stack>
          </Paper>
        </Stack>
      );
    }

    return (
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Work Order</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>District</TableCell>
              <TableCell>Crew</TableCell>
              <TableCell>ETA</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dailyOrders.map((order) => {
              const crew = crews.find((candidate) => candidate.name === order.crew);

              return (
                <TableRow key={order.id}>
                  <TableCell>{order.assignedAt ? formatClockTime(new Date(order.assignedAt)) : "-"}</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>{order.id}</TableCell>
                  <TableCell><Chip color={priorityColor(order.priority)} label={order.priority} size="small" /></TableCell>
                  <TableCell>{order.district}</TableCell>
                  <TableCell>{order.crew}</TableCell>
                  <TableCell>{crew?.eta ?? "-"}</TableCell>
                  <TableCell>{order.status}</TableCell>
                </TableRow>
              );
            })}
            {!dailyOrders.length && <TableRow><TableCell colSpan={7}><Typography color="text.secondary" sx={{ py: 2, textAlign: "center" }}>No dispatch log entries for this date and filter.</Typography></TableCell></TableRow>}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap">
          <Box>
            <Typography variant="h2">Report Center</Typography>
            <Typography color="text.secondary">Live operational reports for dispatch, workforce scheduling, installed work, and inventory.</Typography>
          </Box>
          <Stack direction="row" gap={1} flexWrap="wrap">
            {reportOptions.map((report) => (
              <Button key={report.key} onClick={() => setActiveReport(report.key)} size="small" variant={activeReport === report.key ? "contained" : "outlined"}>
                {report.label}
              </Button>
            ))}
          </Stack>
        </Stack>
      </Grid>
      <Grid item md={3} xs={12}><MetricTile label="Daily Log" value={`${dailyOrders.length}`} detail="Assigned today in current filters" tone="primary" /></Grid>
      <Grid item md={3} xs={12}><MetricTile label="Assigned Crews" value={`${assignedCrewNames.size}`} detail="Crews with active assigned work" tone="warning" /></Grid>
      <Grid item md={3} xs={12}><MetricTile label="Weekly Installed" value={`${weeklyOrders.length}`} detail={`${formatDuration(weeklyFieldMinutes)} field work`} tone="success" /></Grid>
      <Grid item md={3} xs={12}><MetricTile label="Inventory SKUs" value={`${inventoryUsageRows.length}`} detail={`${assemblyUsageRows.length} assemblies consumed`} tone="success" /></Grid>
      <Grid item xs={12}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap">
            <Typography fontWeight={900}>{reportTitle}</Typography>
            <Stack direction="row" gap={1} flexWrap="wrap">
              <TextField label="Report Date" onChange={(event) => setReportDate(event.target.value)} size="small" type="date" value={reportDate} InputLabelProps={{ shrink: true }} />
              <TextField label="District" onChange={(event) => setDistrictFilter(event.target.value)} select size="small" sx={{ minWidth: 140 }} value={districtFilter}>
                {districts.map((district) => <MenuItem key={district} value={district}>{district}</MenuItem>)}
              </TextField>
              <TextField label="Domain" onChange={(event) => setDomainFilter(event.target.value as "All" | WorkOrder["domain"])} select size="small" sx={{ minWidth: 130 }} value={domainFilter}>
                {["All", "Gas", "Electric"].map((domain) => <MenuItem key={domain} value={domain}>{domain}</MenuItem>)}
              </TextField>
            </Stack>
          </Stack>
          <Box sx={{ mt: 2 }}>
            {renderReportBody()}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

function SettingsScreen({ settings, onSave }: { settings: OperationsSettings; onSave: (settings: OperationsSettings) => void }) {
  const [draftSettings, setDraftSettings] = useState(settings);
  const scoreWeightTotal = draftSettings.evaluation.skillFitWeight
    + draftSettings.evaluation.effectiveCostWeight
    + draftSettings.evaluation.etaWeight
    + draftSettings.evaluation.availabilityWeight
    + draftSettings.evaluation.equipmentWeight;

  useEffect(() => {
    setDraftSettings(settings);
  }, [settings]);

  function updateSetting(key: keyof Omit<OperationsSettings, "evaluation">, value: number) {
    setDraftSettings((currentSettings) => ({
      ...currentSettings,
      [key]: value
    }));
  }

  function updateEvaluationSetting(key: keyof EvaluationSettings, value: number) {
    setDraftSettings((currentSettings) => ({
      ...currentSettings,
      evaluation: {
        ...currentSettings.evaluation,
        [key]: value
      }
    }));
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap">
          <Box>
            <Typography variant="h2">Settings</Typography>
            <Typography color="text.secondary">Tune SLA risk, scheduling, material pickup, and crew evaluation without changing mock data.</Typography>
          </Box>
          <Button onClick={() => onSave(normalizeOperationsSettings(draftSettings))} startIcon={<SaveIcon />} variant="contained">
            Save Settings
          </Button>
        </Stack>
      </Grid>

      <Grid item md={4} xs={12}>
        <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
          <Typography fontWeight={900}>SLA Risk Thresholds</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="body2">Used by dashboard risk and health calculations.</Typography>
          <Stack spacing={1.5} sx={{ mt: 2 }}>
            <TextField label="Emergency SLA minutes" onChange={(event) => updateSetting("emergencySlaMinutes", Number(event.target.value))} size="small" type="number" value={draftSettings.emergencySlaMinutes} />
            <TextField label="Critical SLA minutes" onChange={(event) => updateSetting("criticalSlaMinutes", Number(event.target.value))} size="small" type="number" value={draftSettings.criticalSlaMinutes} />
            <TextField label="High priority SLA minutes" onChange={(event) => updateSetting("highPrioritySlaMinutes", Number(event.target.value))} size="small" type="number" value={draftSettings.highPrioritySlaMinutes} />
          </Stack>
        </Paper>
      </Grid>

      <Grid item md={4} xs={12}>
        <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
          <Typography fontWeight={900}>Scheduling</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="body2">Controls crew day rollover and warehouse material pickup.</Typography>
          <Stack spacing={1.5} sx={{ mt: 2 }}>
            <TextField label="Daily crew limit hours" onChange={(event) => updateSetting("dailyCrewLimitHours", Number(event.target.value))} size="small" type="number" value={draftSettings.dailyCrewLimitHours} />
            <TextField label="Warehouse material pickup minutes" onChange={(event) => updateSetting("materialPickupMinutes", Number(event.target.value))} size="small" type="number" value={draftSettings.materialPickupMinutes} />
            <TextField label="Assigned crew score penalty" onChange={(event) => updateSetting("assignedCrewScorePenalty", Number(event.target.value))} size="small" type="number" value={draftSettings.assignedCrewScorePenalty} />
            <TextField label="Limited equipment score penalty" onChange={(event) => updateSetting("limitedEquipmentScorePenalty", Number(event.target.value))} size="small" type="number" value={draftSettings.limitedEquipmentScorePenalty} />
          </Stack>
        </Paper>
      </Grid>

      <Grid item md={4} xs={12}>
        <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
          <Stack direction="row" justifyContent="space-between" gap={1}>
            <Box>
              <Typography fontWeight={900}>Evaluation Weights</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="body2">Weights are normalized automatically.</Typography>
            </Box>
            <Chip color={scoreWeightTotal === 100 ? "success" : "warning"} label={`${scoreWeightTotal} total`} size="small" />
          </Stack>
          <Stack spacing={1.5} sx={{ mt: 2 }}>
            <TextField label="Skill fit weight" onChange={(event) => updateEvaluationSetting("skillFitWeight", Number(event.target.value))} size="small" type="number" value={draftSettings.evaluation.skillFitWeight} />
            <TextField label="Effective cost weight" onChange={(event) => updateEvaluationSetting("effectiveCostWeight", Number(event.target.value))} size="small" type="number" value={draftSettings.evaluation.effectiveCostWeight} />
            <TextField label="ETA weight" onChange={(event) => updateEvaluationSetting("etaWeight", Number(event.target.value))} size="small" type="number" value={draftSettings.evaluation.etaWeight} />
            <TextField label="Availability weight" onChange={(event) => updateEvaluationSetting("availabilityWeight", Number(event.target.value))} size="small" type="number" value={draftSettings.evaluation.availabilityWeight} />
            <TextField label="Equipment readiness weight" onChange={(event) => updateEvaluationSetting("equipmentWeight", Number(event.target.value))} size="small" type="number" value={draftSettings.evaluation.equipmentWeight} />
          </Stack>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography fontWeight={900}>What These Settings Affect</Typography>
          <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
            {[
              "SLA thresholds change dashboard risk and district efficiency scoring.",
              "Daily crew limit controls when non-emergency scheduled work rolls to the next day.",
              "Material pickup minutes adds warehouse time before travel and appears in Workforce and Reports.",
              "Evaluation weights change possible crew ranking without hiding qualified assigned crews."
            ].map((note) => (
              <Grid item md={6} xs={12} key={note}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography>{note}</Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

export function OperationsConsolePage() {
  const persistedWorkflowState = useMemo(() => loadPersistedWorkflowState(), []);
  const persistedOperationsSettings = useMemo(() => loadPersistedOperationsSettings(), []);
  const [activeHub, setActiveHub] = useState<HubKey>("dashboard");
  const [activeTask, setActiveTask] = useState<TaskKey>("emergency");
  const [evaluated, setEvaluated] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(persistedWorkflowState.workOrders);
  const [crews, setCrews] = useState<CrewOption[]>(persistedWorkflowState.crews);
  const [selectedOrderId, setSelectedOrderId] = useState(defaultWorkOrderId);
  const [selectedCrewName, setSelectedCrewName] = useState(defaultCrewName);
  const [settings, setSettings] = useState<OperationsSettings>(persistedOperationsSettings);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(true);
  const isMenuOpen = Boolean(menuAnchor);
  const selectedOrder = workOrders.find((order) => order.id === selectedOrderId) ?? workOrders[0];
  const [hasSelectedWorkOrder, setHasSelectedWorkOrder] = useState(false);
  const markers = useMemo(() => getTaskMapMarkers(activeTask, selectedOrder, hasSelectedWorkOrder, workOrders, crews), [activeTask, crews, hasSelectedWorkOrder, selectedOrder, workOrders]);

  useEffect(() => {
    window.localStorage.setItem(workflowStorageKey, JSON.stringify({ workOrders, crews }));
  }, [crews, workOrders]);

  function saveSettings(nextSettings: OperationsSettings) {
    const normalizedSettings = normalizeOperationsSettings(nextSettings);

    setSettings(normalizedSettings);
    window.localStorage.setItem(settingsStorageKey, JSON.stringify(normalizedSettings));
  }

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

  function dispatchWorkOrder(orderId: string) {
    setSelectedOrderId(orderId);
    setHasSelectedWorkOrder(true);
    setEvaluated(false);
    setEvaluating(false);
    setActiveTask("crews");
    setActiveHub("dispatch");
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

  function unassignWorkOrder(orderId: string) {
    const orderToUnassign = workOrders.find((order) => order.id === orderId);

    if (!orderToUnassign || orderToUnassign.assignmentState !== "assigned") {
      return;
    }

    const assignedCrewName = orderToUnassign.crew;

    setWorkOrders((currentWorkOrders) => currentWorkOrders.map((order) => (
      order.id === orderId
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
    setSelectedOrderId(orderId);
    setHasSelectedWorkOrder(true);
    setEvaluated(false);
    setActiveTask("crews");
  }

  function unassignSelectedCrew() {
    unassignWorkOrder(selectedOrder.id);
  }

  function renderActiveHub(): ReactElement {
    if (activeHub === "workOrders") {
      return <WorkOrdersScreen selectedOrder={selectedOrder} onDispatchOrder={dispatchWorkOrder} onSelectOrder={selectWorkOrder} onUnassignOrder={unassignWorkOrder} settings={settings} workOrders={workOrders} />;
    }

    if (activeHub === "workforce") {
      return <WorkforceScreen selectedCrewName={selectedCrewName} onSelectCrew={setSelectedCrewName} crews={crews} workOrders={workOrders} settings={settings} />;
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
          settings={settings}
        />
      );
    }

    if (activeHub === "reports") {
      return <ReportsScreen crews={crews} workOrders={workOrders} settings={settings} />;
    }

    if (activeHub === "performance") {
      return <PerformanceScreen selectedOrder={selectedOrder} markers={markers} crews={crews} workOrders={workOrders} settings={settings} />;
    }

    if (activeHub === "settings") {
      return <SettingsScreen settings={settings} onSave={saveSettings} />;
    }

    return <DashboardScreen selectedOrder={selectedOrder} markers={markers} crews={crews} workOrders={workOrders} settings={settings} />;
  }

  return (
    <Box sx={{ bgcolor: "#f3f4f6", mx: { xs: -2, md: -3 }, my: { xs: -2, md: -3 }, minHeight: "calc(100vh - 96px)" }}>
      <Stack direction="row" sx={{ minHeight: "calc(100vh - 96px)" }}>
        <Stack sx={{ width: 44, bgcolor: "#111827", color: "white", py: 1, display: { xs: "none", md: "flex" } }} alignItems="center" spacing={1}>
          {[DashboardIcon, WorkIcon, PeopleIcon, MapIcon, EngineeringIcon, AssessmentIcon, SummarizeIcon, SettingsIcon].map((Icon, index) => (
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
