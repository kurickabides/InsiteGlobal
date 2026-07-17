import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "..");
const publicDataDir = resolve(projectRoot, "public", "mock-data");
const srcDataFile = resolve(projectRoot, "src", "data", "generatedOperationsData.ts");

const gasWorkTypes = [
  { id: 1, name: "Gas Leak Investigation", hours: 4.5, symbol: "gas-leak", skills: ["Gas emergency", "Atmospheric testing", "Vacuum excavation"], equipment: ["Leak detector", "Vac truck", "Traffic kit"] },
  { id: 2, name: "Gas Service Installation", hours: 6, symbol: "gas-service", skills: ["Gas service", "Excavation", "Customer relight"], equipment: ["Service truck", "Fusion kit", "Traffic kit"] },
  { id: 3, name: "Regulator Maintenance", hours: 5, symbol: "regulator", skills: ["Pressure regulation", "Compliance photos"], equipment: ["Pressure kit", "Service truck"] },
  { id: 4, name: "Corrosion Inspection", hours: 3, symbol: "corrosion", skills: ["Corrosion inspection", "Compliance photos"], equipment: ["Inspection van", "Survey kit"] }
];

const electricWorkTypes = [
  { id: 5, name: "Feeder Branch Outage", hours: 5, symbol: "outage", skills: ["Switching", "Outage restoration", "Bucket truck"], equipment: ["Bucket truck", "Switching kit"] },
  { id: 6, name: "Transformer Outage", hours: 6.5, symbol: "transformer", skills: ["Transformer replacement", "Switching", "Outage restoration"], equipment: ["Bucket truck", "Transformer kit"] },
  { id: 7, name: "Electric Pole Replacement", hours: 8, symbol: "pole", skills: ["Line construction", "Traffic control", "Bucket truck"], equipment: ["Bucket truck", "Pole trailer"] },
  { id: 8, name: "Underground Cable Fault", hours: 7.5, symbol: "underground", skills: ["Cable fault locating", "Underground electric", "Switching"], equipment: ["Fault locator", "Cable repair trailer"] },
  { id: 9, name: "Vegetation Clearance", hours: 4, symbol: "vegetation", skills: ["Vegetation clearance", "Line patrol"], equipment: ["Forestry truck", "Chipper"] }
];

const operatorNames = [
  "Andre Lewis",
  "Maya Thompson",
  "Luis Rivera",
  "Priya Shah",
  "Ethan Brooks",
  "Grace Morgan",
  "Jordan Kim",
  "Sofia Martinez",
  "Noah Patel",
  "Harper Nguyen",
  "Camila Reed",
  "Marcus Johnson",
  "Olivia Chen",
  "Darius Walker",
  "Nina Patel",
  "Avery Coleman",
  "Elena Garcia",
  "Damon Wright",
  "Isabella Ross",
  "Mateo Clark",
  "Riley Adams",
  "Kai Bennett",
  "Tessa Hall",
  "Owen Foster",
  "Leah Simmons",
  "Caleb Price",
  "Zara Mitchell",
  "Miles Turner",
  "Amara Scott",
  "Jules Carter",
  "Rafael Ortiz",
  "Mina Park",
  "Theo Russell",
  "Layla Hughes",
  "Grant Bailey",
  "Iris Cooper",
  "Cole Jenkins",
  "Nora Flores",
  "Simon Ward",
  "Vivian Kelly",
  "Micah Bell",
  "Ari Brooks",
  "June Parker",
  "Reid Murphy",
  "Naomi Sanders"
];

const crewSpecialties = [
  { baseName: "Gas Emergency Response", crewType: "Gas Emergency", domain: "Gas", domainId: 1, vehicleIcon: "truck" },
  { baseName: "Gas Construction", crewType: "Gas Construction", domain: "Gas", domainId: 1, vehicleIcon: "truck" },
  { baseName: "Gas Regulator Maintenance", crewType: "Gas Maintenance", domain: "Gas", domainId: 1, vehicleIcon: "van" },
  { baseName: "Gas Inspection", crewType: "Gas Inspection", domain: "Gas", domainId: 1, vehicleIcon: "van" },
  { baseName: "Electric Trouble", crewType: "Electric Trouble", domain: "Electric", domainId: 2, vehicleIcon: "bucket" },
  { baseName: "Underground Electric", crewType: "Underground Electric", domain: "Electric", domainId: 2, vehicleIcon: "truck" },
  { baseName: "Line Construction", crewType: "Line Patrol", domain: "Electric", domainId: 2, vehicleIcon: "bucket" },
  { baseName: "Vegetation Line Clearance", crewType: "Vegetation", domain: "Electric", domainId: 2, vehicleIcon: "patrol" },
  { baseName: "Damage Assessment", crewType: "Inspection", domain: "Shared", domainId: 3, vehicleIcon: "patrol" }
];

const priorityCycle = ["Emergency", "Critical", "High", "Routine"];
const statusCycle = ["Needs assignment", "Queued", "Scheduled", "Assigned", "Ready to bundle"];
const districts = [
  { id: 101, domainId: 2, name: "North", lat: 45.583, lon: -122.684 },
  { id: 102, domainId: 2, name: "Central", lat: 45.531, lon: -122.684 },
  { id: 103, domainId: 2, name: "West", lat: 45.516, lon: -122.781 },
  { id: 201, domainId: 1, name: "North", lat: 45.583, lon: -122.655 },
  { id: 202, domainId: 1, name: "Central", lat: 45.522, lon: -122.661 },
  { id: 203, domainId: 1, name: "South", lat: 45.489, lon: -122.666 }
];

function offset(index, spread) {
  return (((index * 37) % 100) / 100 - 0.5) * spread;
}

function dueDate(index, priority) {
  const base = new Date("2026-07-17T15:00:00Z");
  const hours = priority === "Emergency" ? 2 + index % 3 : priority === "Critical" ? 6 + index % 6 : priority === "High" ? 24 + index % 12 : 48 + index % 72;
  base.setUTCHours(base.getUTCHours() + hours);
  return base.toISOString();
}

function assignmentState(status, index) {
  if (status === "Assigned" || index % 7 === 0) {
    return "assigned";
  }

  if (index % 3 === 0) {
    return "evaluated";
  }

  return "unevaluated";
}

function buildWorkOrders(domain, count, startId, prefix, workTypes, domainId) {
  const serviceAreas = districts.filter((district) => district.domainId === domainId);
  return Array.from({ length: count }, (_, index) => {
    const workType = workTypes[index % workTypes.length];
    const district = serviceAreas[index % serviceAreas.length];
    const priority = index % 11 === 0 ? "Emergency" : priorityCycle[(index + domainId) % priorityCycle.length];
    const status = statusCycle[index % statusCycle.length];
    const state = assignmentState(status, index);
    const affectedCustomers = domain === "Electric" ? 35 + (index * 47) % 1600 : index % 5 === 0 ? 120 + (index * 31) % 900 : null;
    const workOrderId = startId + index;
    const workOrderNumber = `${prefix}-${String(startId + index).padStart(4, "0")}`;

    return {
      workOrderId,
      workOrderNumber,
      id: workOrderNumber,
      type: workType.name,
      workTypeId: workType.id,
      utilityDomainId: domainId,
      domain,
      serviceAreaId: district.id,
      district: district.name,
      latitude: Number((district.lat + offset(index, 0.045)).toFixed(6)),
      longitude: Number((district.lon + offset(index + 11, 0.055)).toFixed(6)),
      priority,
      status,
      assignmentState: state,
      sla: priority === "Emergency" ? `${35 + index % 50} min remaining` : priority === "Critical" ? `${1 + index % 4} hr ${10 + index % 45} min` : priority === "High" ? `${6 + index % 12} hr` : `${1 + index % 5} days`,
      crew: state === "assigned" ? `${domain} assigned crew` : state === "evaluated" ? `${domain} crew recommended` : "Pending review",
      estimatedHours: workType.hours + (index % 4) * 0.5,
      dueDate: dueDate(index, priority),
      mapSymbol: workType.symbol,
      storyId: domain === "Gas" ? "gas-operations-queue" : "electric-operations-queue",
      affectedCustomers,
      impact: affectedCustomers ? `${affectedCustomers.toLocaleString()} customers affected` : `${domain} field operation in ${district.name} district`,
      skills: workType.skills,
      equipment: workType.equipment,
      relatedGeoJsonFiles: [
        domain === "Gas" ? "/mock-data/gas-network.geojson" : "/mock-data/electric-network.geojson",
        "/mock-data/crew-locations.geojson"
      ],
      customerGeoJsonFile: affectedCustomers ? "/mock-data/customers.geojson" : null,
      customerGeoJsonFilter: affectedCustomers ? { affectedByWorkOrderNumber: workOrderNumber } : null
    };
  });
}

function buildCrews() {
  const templates = crewSpecialties.flatMap((specialty) =>
    Array.from({ length: 5 }, (_, index) => ({
      ...specialty,
      operatorName: operatorNames[(crewSpecialties.indexOf(specialty) * 5 + index) % operatorNames.length],
      sequence: index + 1
    }))
  );

  return templates.map(({ baseName, crewType, domain, operatorName, vehicleIcon }, index) => {
    const district = districts[index % districts.length];
    const crewId = index + 1;
    const status = index % 6 === 5 ? "Assigned" : index % 9 === 8 ? "Off" : "Available";
    const fit = Math.max(61, 97 - (index * 5) % 34);
    const hourly = domain === "Gas" ? 138 + index * 3 : domain === "Electric" ? 146 + index * 4 : 122 + index * 2;

    return {
      crewId,
      crewName: `${baseName} - ${operatorName}`,
      name: `${baseName} - ${operatorName}`,
      crewType,
      domain,
      homeServiceAreaId: district.id,
      supervisorUserId: 100 + crewId,
      availabilityStatus: status,
      status,
      isActive: true,
      fit,
      eta: `${14 + index * 4} min`,
      district: district.name,
      equipment: index % 4 === 0 ? "Ready" : index % 4 === 1 ? "Staged" : index % 4 === 2 ? "Transfer required" : "Limited",
      overtime: index % 3 === 0 ? "Low" : index % 3 === 1 ? "Medium" : "High",
      hourly: `$${hourly}/hr`,
      effectiveCost: `$${(1450 + index * 185).toLocaleString()}`,
      longitude: Number((district.lon + offset(index + 21, 0.05)).toFixed(6)),
      latitude: Number((district.lat + offset(index + 31, 0.04)).toFixed(6)),
      vehicleIcon,
      currentAssignment: status === "Assigned" ? `Active ${domain.toLowerCase()} field order` : status === "Off" ? "Off shift" : `Available in ${district.name} district`,
      certifications: domain === "Gas"
        ? ["Gas emergency", "Atmospheric testing", "Pressure regulation", "Traffic control"]
        : domain === "Electric"
          ? ["Switching", "Outage restoration", "Bucket truck", "Line patrol"]
          : ["Damage assessment", "Field inspection", "Customer restoration", "Traffic control"],
      strengths: ["Qualified craft lead", `${district.name} district coverage`, "Current equipment profile available"],
      penalties: status === "Available" ? [] : [`Crew status is ${status}`]
    };
  });
}

const workOrders = [
  ...buildWorkOrders("Gas", 50, 1001, "WO-GAS", gasWorkTypes, 1),
  ...buildWorkOrders("Electric", 50, 2001, "WO-ELEC", electricWorkTypes, 2)
];

const crews = buildCrews();

const crewLocations = {
  type: "FeatureCollection",
  features: crews.map((crew) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [crew.longitude, crew.latitude]
    },
    properties: {
      crewId: crew.crewId,
      crewName: crew.crewName,
      crewType: crew.crewType,
      domain: crew.domain,
      homeServiceAreaId: crew.homeServiceAreaId,
      availabilityStatus: crew.availabilityStatus,
      currentMapStatus: crew.currentAssignment,
      vehicleIcon: crew.vehicleIcon,
      displayColor: crew.domain === "Gas" ? "#dc2626" : crew.domain === "Electric" ? "#f59e0b" : "#0f766e"
    }
  }))
};

const assignments = workOrders
  .filter((order, index) => order.assignmentState !== "unevaluated" || index % 5 === 0)
  .map((order, index) => {
    const domainCrews = crews.filter((crew) => crew.domain === order.domain || crew.domain === "Shared");
    const crew = domainCrews[index % domainCrews.length];
    return {
      assignmentId: 5001 + index,
      workOrderId: order.workOrderId,
      crewId: crew.crewId,
      userId: null,
      assignmentStatus: order.assignmentState === "assigned" ? "Assigned" : "Recommended",
      estimatedLaborCost: 1200 + index * 45,
      estimatedEquipmentCost: 120 + index * 8,
      performanceAdjustedCost: 1280 + index * 39,
      assignedDate: order.assignmentState === "assigned" ? "2026-07-17T14:15:00Z" : null,
      completedDate: null
    };
  });

const recommendations = workOrders.flatMap((order, orderIndex) => {
  const domainCrews = crews.filter((crew) => crew.domain === order.domain || crew.domain === "Shared").slice(0, 4);
  return domainCrews.map((crew, crewIndex) => ({
    recommendationId: orderIndex * 4 + crewIndex + 1,
    workOrderId: order.workOrderId,
    crewId: crew.crewId,
    qualifiedFlag: crew.domain === order.domain || crewIndex < 2,
    skillMatchScore: Math.max(58, crew.fit - crewIndex * 5),
    equipmentMatchScore: Math.max(55, 96 - crewIndex * 8),
    performanceScore: Math.max(60, crew.fit - crewIndex * 4),
    estimatedLaborCost: 1400 + crewIndex * 260 + orderIndex * 12,
    estimatedEquipmentCost: 160 + crewIndex * 55,
    productivityBenefit: 340 - crewIndex * 70,
    riskPenalty: crewIndex * 115,
    performanceAdjustedCost: 1380 + crewIndex * 280 + orderIndex * 10,
    recommendationRank: crewIndex + 1,
    explanationText: `${crew.crewName} is ranked ${crewIndex + 1} for ${order.workOrderNumber} based on certification fit, equipment readiness, service-area proximity, overtime exposure, and adjusted cost.`
  }));
});

const consoleWorkOrders = workOrders.map((order) => ({
  id: order.workOrderNumber,
  type: order.type,
  domain: order.domain,
  priority: order.priority,
  status: order.status,
  district: order.district,
  sla: order.sla,
  impact: order.impact,
  crew: order.crew,
  assignmentState: order.assignmentState,
  skills: order.skills,
  equipment: order.equipment,
  longitude: order.longitude,
  latitude: order.latitude
}));

const consoleCrews = crews.map((crew) => ({
  name: crew.name,
  fit: crew.fit,
  eta: crew.eta,
  district: crew.district,
  status: crew.status,
  crewType: crew.crewType,
  vehicleIcon: crew.vehicleIcon,
  currentAssignment: crew.currentAssignment,
  certifications: crew.certifications,
  equipment: crew.equipment,
  overtime: crew.overtime,
  hourly: crew.hourly,
  effectiveCost: crew.effectiveCost,
  longitude: crew.longitude,
  latitude: crew.latitude,
  strengths: crew.strengths,
  penalties: crew.penalties
}));

await mkdir(publicDataDir, { recursive: true });
await writeFile(resolve(publicDataDir, "work-orders.json"), `${JSON.stringify(workOrders, null, 2)}\n`);
await writeFile(resolve(publicDataDir, "crews.json"), `${JSON.stringify(crews, null, 2)}\n`);
await writeFile(resolve(publicDataDir, "crew-locations.geojson"), `${JSON.stringify(crewLocations, null, 2)}\n`);
await writeFile(resolve(publicDataDir, "work-assignments.json"), `${JSON.stringify(assignments, null, 2)}\n`);
await writeFile(resolve(publicDataDir, "crew-recommendations.json"), `${JSON.stringify(recommendations, null, 2)}\n`);
await writeFile(srcDataFile, `// Generated by scripts/generateNorthstarMockData.mjs.\n// Do not edit by hand; update the generator and rerun it.\n\nexport const generatedWorkOrders = ${JSON.stringify(consoleWorkOrders, null, 2)} as const;\n\nexport const generatedCrews = ${JSON.stringify(consoleCrews, null, 2)} as const;\n`);

console.log(`Generated ${workOrders.length} work orders, ${crews.length} crews, ${assignments.length} assignments, and ${recommendations.length} recommendations.`);
