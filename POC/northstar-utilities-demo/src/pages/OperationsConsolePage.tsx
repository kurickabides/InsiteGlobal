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
import { MouseEvent, ReactElement, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { EsriMapViewer } from "../components/esri/EsriMapViewer";
import { EsriLayerConfig, EsriMarkerConfig } from "../components/esri/types";
import { generatedCrews, generatedWorkOrders } from "../data/generatedOperationsData";

type HubKey = "dashboard" | "workOrders" | "workforce" | "dispatch" | "reports";
type TaskKey = "emergency" | "crews" | "assignment" | "impact";

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

const workOrders = generatedWorkOrders.map((order) => ({ ...order })) as unknown as WorkOrder[];

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

const crews = generatedCrews.map((crew) => ({ ...crew })) as unknown as CrewOption[];
const defaultWorkOrderId = workOrders.find((order) => order.priority === "Emergency" && order.assignmentState !== "assigned")?.id ?? workOrders[0].id;
const defaultCrewName = crews.find((crew) => crew.status === "Available")?.name ?? crews[0].name;

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

function workOrderMarkerStyle(order: WorkOrder, isSelected: boolean): Pick<EsriMarkerConfig, "color" | "outlineColor" | "shape" | "size"> {
  if (order.assignmentState === "assigned") {
    return {
      color: "#16a34a",
      outlineColor: isSelected ? "#111827" : "#ffffff",
      shape: "square",
      size: isSelected ? 16 : 12
    };
  }

  if (order.assignmentState === "evaluated") {
    return {
      color: "#2563eb",
      outlineColor: isSelected ? "#111827" : "#ffffff",
      shape: "diamond",
      size: isSelected ? 17 : 13
    };
  }

  return {
    color: "#dc2626",
    outlineColor: isSelected ? "#111827" : "#ffffff",
    shape: "triangle",
    size: isSelected ? 17 : 13
  };
}

function getCandidateCrews(order: WorkOrder): CrewOption[] {
  const domainMatches = crews.filter((crew) => {
    if (order.domain === "Gas") {
      return crew.certifications.some((certification) => certification.includes("Gas") || certification.includes("Pressure"));
    }

    return crew.certifications.some((certification) => certification.includes("Switching") || certification.includes("Line") || certification.includes("Meter"));
  });

  return [...domainMatches].sort((a, b) => b.fit - a.fit);
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

function getTaskMapMarkers(activeTask: TaskKey, selectedOrder: WorkOrder): EsriMarkerConfig[] {
  const candidateCrewNames = new Set(getCandidateCrews(selectedOrder).map((crew) => crew.name));
  const workOrderMarkers = workOrders.map((order) => ({
    id: order.id,
    label: `${order.id} - ${assignmentLabel(order.assignmentState)}`,
    longitude: order.longitude,
    latitude: order.latitude,
    ...workOrderMarkerStyle(order, order.id === selectedOrder.id),
    popupContent: `${order.type}<br/>${order.priority} priority<br/>${assignmentLabel(order.assignmentState)}<br/>${order.crew}`
  }));

  const crewMarkers = crews.map((crew) => ({
    id: `crew-${crew.name}`,
    label: `${crew.name} - ${crew.crewType}`,
    longitude: crew.longitude,
    latitude: crew.latitude,
    color: candidateCrewNames.has(crew.name) ? "#16a34a" : "#475569",
    outlineColor: candidateCrewNames.has(crew.name) ? "#dcfce7" : "#ffffff",
    size: candidateCrewNames.has(crew.name) ? 22 : 18,
    icon: crew.vehicleIcon,
    popupContent: `${crew.crewType}<br/>${crew.status}<br/>${crew.currentAssignment}<br/>ETA to selected order: ${crew.eta}`
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

function WorkOrderTable({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
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

function DashboardScreen({ selectedOrder, markers }: { selectedOrder: WorkOrder; markers: EsriMarkerConfig[] }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap">
          <div>
            <Typography variant="h2">Executive Dashboard</Typography>
            <Typography color="text.secondary">NorthStar Utilities operating picture for gas and electric field response.</Typography>
          </div>
          <Stack direction="row" gap={1} flexWrap="wrap">
            <Chip icon={<WarningAmberIcon />} color="error" label="Emergency active" />
            <Chip icon={<CheckCircleIcon />} color="success" label="Qualified crews available" />
          </Stack>
        </Stack>
      </Grid>

      <Grid item md={3} xs={12}><MetricTile label="Active Work Orders" value="128" detail="31% emergency or critical" tone="primary" /></Grid>
      <Grid item md={3} xs={12}><MetricTile label="SLA Risk" value="23" detail="Jobs inside 2-hour window" tone="error" /></Grid>
      <Grid item md={3} xs={12}><MetricTile label="Crew Utilization" value="82%" detail="Central district constrained" tone="warning" /></Grid>
      <Grid item md={3} xs={12}><MetricTile label="Modeled Savings" value="$1.8M" detail="Annualized dispatch value" tone="success" /></Grid>

      <Grid item lg={8} xs={12}>
        <Paper variant="outlined" sx={{ overflow: "hidden" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1, bgcolor: "grey.50", borderBottom: "1px solid", borderColor: "divider" }}>
            <Stack direction="row" alignItems="center" gap={1}>
              <MapIcon color="primary" />
              <Typography fontWeight={900}>Service Territory Operations Map</Typography>
            </Stack>
            <Chip label="Gas + electric layers" size="small" />
          </Stack>
          <EsriMapViewer
            center={[selectedOrder.longitude, selectedOrder.latitude]}
            height={420}
            layers={mapLayers}
            markers={markers}
            title=""
            zoom={13}
          />
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
            <Typography fontWeight={900}>Crew Readiness</Typography>
            <Stack spacing={1.25} sx={{ mt: 1.5 }}>
              {crews.map((crew) => (
                <div key={crew.name}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontWeight={800}>{crew.name}</Typography>
                    <Typography color="text.secondary" variant="body2">{crew.fit}%</Typography>
                  </Stack>
                  <LinearProgress color={crew.fit >= 90 ? "success" : "primary"} value={crew.fit} variant="determinate" />
                </div>
              ))}
            </Stack>
          </Paper>
        </Stack>
      </Grid>
    </Grid>
  );
}

function WorkOrdersScreen({ selectedOrder, onSelectOrder }: { selectedOrder: WorkOrder; onSelectOrder: (id: string) => void }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap">
          <div>
            <Typography variant="h2">Work Orders</Typography>
            <Typography color="text.secondary">Dispatch queue with priority, SLA, skills, equipment, customer impact, and assignment state.</Typography>
          </div>
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
            <WorkOrderTable selectedId={selectedOrder.id} onSelect={onSelectOrder} />
          </Box>
        </Paper>
      </Grid>

      <Grid item lg={4} xs={12}>
        <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
          <Stack direction="row" justifyContent="space-between" gap={1}>
            <div>
              <Typography color="text.secondary" variant="body2">Selected work order</Typography>
              <Typography fontWeight={900} fontSize={22}>{selectedOrder.id}</Typography>
            </div>
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

function CrewTable({ selectedName, onSelect }: { selectedName: string; onSelect: (name: string) => void }) {
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

function WorkforceScreen({ selectedCrewName, onSelectCrew }: { selectedCrewName: string; onSelectCrew: (name: string) => void }) {
  const selectedCrew = crews.find((crew) => crew.name === selectedCrewName) ?? crews[0];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap">
          <div>
            <Typography variant="h2">Workforce</Typography>
            <Typography color="text.secondary">Crew roster with vehicle type, certifications, assignment state, and dispatch readiness.</Typography>
          </div>
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
            <CrewTable selectedName={selectedCrew.name} onSelect={onSelectCrew} />
          </Box>
        </Paper>
      </Grid>

      <Grid item lg={4} xs={12}>
        <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
          <Stack direction="row" justifyContent="space-between" gap={1}>
            <div>
              <Typography color="text.secondary" variant="body2">Selected crew</Typography>
              <Typography fontWeight={900} fontSize={22}>{selectedCrew.name}</Typography>
            </div>
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
  selectedOrder
}: {
  activeTask: TaskKey;
  evaluated: boolean;
  evaluating: boolean;
  onEvaluate: () => void;
  onSelectOrder: (id: string) => void;
  selectedOrder: WorkOrder;
}) {
  const dispatchMarkers = getTaskMapMarkers(activeTask, selectedOrder);
  const rankedCrews = getCandidateCrews(selectedOrder);
  const recommendedCrew = rankedCrews[0] ?? crews[0];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between" gap={2} flexWrap="wrap">
          <div>
            <Typography variant="h2">Dispatch</Typography>
            <Typography color="text.secondary">Crew allocation, route readiness, and schedule impact for {selectedOrder.id}.</Typography>
          </div>
          <Button disabled={evaluating} onClick={onEvaluate} variant="contained">
            {evaluated ? "Re-evaluate Crews" : "Evaluate Crews"}
          </Button>
        </Stack>
      </Grid>
      <Grid item lg={7} xs={12}>
        <Paper variant="outlined" sx={{ overflow: "hidden" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} sx={{ px: 2, py: 1, bgcolor: "grey.50", borderBottom: "1px solid", borderColor: "divider" }}>
            <Stack direction="row" alignItems="center" gap={1}>
              <MapIcon color="primary" />
              <Typography fontWeight={900}>{getTaskMapTitle(activeTask, selectedOrder)}</Typography>
            </Stack>
            <Chip label={activeTask === "crews" ? "Crew layer" : "Task context"} size="small" />
          </Stack>
          <EsriMapViewer
            center={[selectedOrder.longitude, selectedOrder.latitude]}
            height={330}
            layers={mapLayers}
            markers={dispatchMarkers}
            onMarkerClick={(marker) => {
              if (workOrders.some((order) => order.id === marker.id)) {
                onSelectOrder(marker.id);
              }
            }}
            title=""
            zoom={13}
          />
          <Stack direction="row" gap={1} flexWrap="wrap" sx={{ px: 2, py: 1, bgcolor: "white", borderTop: "1px solid", borderColor: "divider" }}>
            <Chip label="Green square: assigned" size="small" />
            <Chip label="Blue diamond: evaluated" size="small" />
            <Chip label="Red triangle: not evaluated" size="small" />
            <Chip label="Vehicle icons: crews" size="small" />
          </Stack>
        </Paper>
      </Grid>
      <Grid item lg={5} xs={12}>
        <Paper variant="outlined" sx={{ overflow: "hidden", height: "100%" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} sx={{ px: 2, py: 1, bgcolor: "grey.50", borderBottom: "1px solid", borderColor: "divider" }}>
            <Stack direction="row" alignItems="center" gap={1}>
            <PeopleIcon color="primary" />
            <Typography fontWeight={900}>Possible Crews</Typography>
            </Stack>
            <Chip color={evaluated ? "success" : "default"} label={evaluated ? "Ranked" : "Not evaluated"} size="small" />
          </Stack>
          {evaluating && <LinearProgress />}
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Crew</TableCell>
                <TableCell>Fit</TableCell>
                <TableCell>ETA</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Effective</TableCell>
                <TableCell>Equipment</TableCell>
                <TableCell>Overtime</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rankedCrews.map((crew) => (
                <TableRow key={crew.name} selected={evaluated && crew.name === recommendedCrew.name}>
                  <TableCell sx={{ fontWeight: 900 }}>{crew.name}</TableCell>
                  <TableCell>{evaluated ? `${crew.fit}%` : "-"}</TableCell>
                  <TableCell>{crew.eta}</TableCell>
                  <TableCell>{crew.hourly}</TableCell>
                  <TableCell>{evaluated ? crew.effectiveCost : "-"}</TableCell>
                  <TableCell>{crew.equipment}</TableCell>
                  <TableCell>{crew.overtime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
      <Grid item lg={7} xs={12}>
        <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
          <Typography fontWeight={900}>{evaluated ? `Why ${recommendedCrew.name} is recommended` : "Evaluation readiness"}</Typography>
          {evaluated ? (
            <Grid container spacing={1.25} sx={{ mt: 1 }}>
              {crews[0].strengths.map((strength) => (
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
              Click a work order on the map to change this list, then evaluate crews to score certifications, equipment readiness, travel, SLA fit, productivity, overtime risk, and effective cost.
            </Typography>
          )}
        </Paper>
      </Grid>
      <Grid item lg={5} xs={12}>
        <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
          <Typography fontWeight={900}>{recommendedCrew.name} Schedule Window</Typography>
          <Stack spacing={1.2} sx={{ mt: 2 }}>
            {["07:30 Travel", "07:48 Arrive on site", "08:05 Safety assessment", "08:30 Leak isolation", "09:15 Repair support"].map((item, index) => (
              <Stack key={item} direction="row" alignItems="center" gap={1}>
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: index < 2 ? "success.main" : "primary.main" }} />
                <Typography>{item}</Typography>
              </Stack>
            ))}
          </Stack>
          <Button startIcon={<LocalShippingIcon />} fullWidth sx={{ mt: 2 }} variant="contained">
            Assign {recommendedCrew.name}
          </Button>
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
  const [activeHub, setActiveHub] = useState<HubKey>("dashboard");
  const [activeTask, setActiveTask] = useState<TaskKey>("emergency");
  const [evaluated, setEvaluated] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(defaultWorkOrderId);
  const [selectedCrewName, setSelectedCrewName] = useState(defaultCrewName);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const isMenuOpen = Boolean(menuAnchor);
  const selectedOrder = workOrders.find((order) => order.id === selectedOrderId) ?? workOrders[0];
  const markers = useMemo(() => getTaskMapMarkers(activeTask, selectedOrder), [activeTask, selectedOrder]);

  function openMenu(event: MouseEvent<HTMLButtonElement>) {
    setMenuAnchor(event.currentTarget);
  }

  function closeMenu() {
    setMenuAnchor(null);
  }

  function selectTask(task: typeof currentTasks[number]) {
    setActiveTask(task.key);
    setActiveHub(task.hub);
    if (task.key === "emergency") {
      setSelectedOrderId(defaultWorkOrderId);
    }
  }

  function evaluateCrews() {
    setActiveTask("crews");
    setEvaluating(true);
    window.setTimeout(() => {
      setEvaluated(true);
      setEvaluating(false);
    }, 650);
  }

  function renderActiveHub(): ReactElement {
    if (activeHub === "workOrders") {
      return <WorkOrdersScreen selectedOrder={selectedOrder} onSelectOrder={setSelectedOrderId} />;
    }

    if (activeHub === "workforce") {
      return <WorkforceScreen selectedCrewName={selectedCrewName} onSelectCrew={setSelectedCrewName} />;
    }

    if (activeHub === "dispatch") {
      return (
        <DispatchScreen
          activeTask={activeTask}
          evaluated={evaluated}
          evaluating={evaluating}
          onEvaluate={evaluateCrews}
          onSelectOrder={setSelectedOrderId}
          selectedOrder={selectedOrder}
        />
      );
    }

    if (activeHub === "reports") {
      return <ReportsScreen />;
    }

    return <DashboardScreen selectedOrder={selectedOrder} markers={markers} />;
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
              <MenuItem component={RouterLink} onClick={closeMenu} to="/operations-console"><ReplayIcon fontSize="small" sx={{ mr: 1 }} /> Restart Demo</MenuItem>
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

            <Paper square variant="outlined" sx={{ width: 330, display: { xs: "none", lg: "block" }, borderTop: 0, borderRight: 0, borderBottom: 0, p: 2, bgcolor: "white" }}>
              <Typography variant="h2">Current Task</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.75 }} variant="body2">Work the live demo from an operational task list.</Typography>
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
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
