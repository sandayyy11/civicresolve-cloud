const LOCATION_LABELS = {
  school: "School", college: "College", university: "University", hospital: "Hospital",
  police_station: "Police station", fire_station: "Fire station",
  government_office: "Government office", major_road: "Major road", public_transport: "Public transport",
};

const SENSITIVE_FACILITIES = ["school", "college", "university", "hospital", "police_station", "fire_station", "government_office"];
const RELEVANT_TYPES = {
  Road: ["major_road", "school", "college", "university", "hospital", "public_transport", "fire_station", "police_station"],
  Water: ["major_road", "school", "college", "university", "hospital", "public_transport", "fire_station", "police_station"],
  Electricity: ["hospital", "school", "college", "university", "police_station", "fire_station", "major_road", "public_transport", "government_office"],
  Garbage: ["school", "college", "university", "hospital", "government_office", "public_transport"],
  Other: Object.keys(LOCATION_LABELS),
};

function getSeverity(description = "") {
  const text = description.toLowerCase();
  const minor = /\b(minor|small|slight|cosmetic|tiny)\b/.test(text);
  const fireOrImmediateDanger = /\b(fire|emergency|immediate danger|life[- ]?threatening|critical)\b/.test(text);
  const electricalHazard = /\b(exposed|live|fallen|sparking|damaged)\b.{0,30}\b(wire|cable|electric|power line)|\b(wire|cable|electric|power line)\b.{0,30}\b(exposed|live|fallen|sparking|damaged)/.test(text);
  const majorFlooding = /\b(major|severe|heavy|serious)\s+flood(ing)?\b|\bflood(ing)?\b.{0,30}\b(road|street|access|traffic|block)/.test(text);
  const sanitationHazard = /\b(sewage|sewer|drainage)\b.{0,35}\b(overflow|leak|spill|backflow)|\b(overflowing|overflow)\b.{0,35}\b(sewage|sewer|drainage|waste)/.test(text);
  const openManhole = /\b(open|uncovered|missing)\b.{0,20}\b(manhole|drain cover)|\b(manhole|drain cover)\b.{0,20}\b(open|uncovered|missing)/.test(text);
  const collapsedInfrastructure = /\b(collapsed|collapse|sinkhole|caving|fallen tree|fallen pole|unsafe structure)\b/.test(text);
  const roadBlocked = /\b(road|street|lane|entrance|access|traffic)\b.{0,25}\b(completely blocked|fully blocked|blocked|impassable|cannot pass)|\b(completely blocked|fully blocked|blocked|impassable|cannot pass)\b.{0,25}\b(road|street|lane|entrance|access|traffic)\b/.test(text);
  const emergencyAccessBlocked = /\b(ambulance|fire engine|emergency vehicle|emergency access)\b.{0,30}\b(blocked|cannot pass|no access)|\b(blocked|cannot pass|no access)\b.{0,30}\b(ambulance|fire engine|emergency vehicle|emergency access)\b/.test(text);
  const streetlightOnly = /\b(street ?light|streetlamp)\b.{0,30}\b(not working|not work|broken|off)|\b(not working|not work|broken|off)\b.{0,30}\b(street ?light|streetlamp)\b/.test(text);
  const seriousScale = /\b(large|deep|dangerous|hazard|severe|serious|major|overflowing)\b/.test(text);
  const directHighRisk = fireOrImmediateDanger || electricalHazard || majorFlooding || openManhole || collapsedInfrastructure || roadBlocked || emergencyAccessBlocked || sanitationHazard && /\b(overflow|spill|backflow|sewage)\b/.test(text);
  return { minor, electricalHazard, majorFlooding, sanitationHazard, openManhole, collapsedInfrastructure, roadBlocked, emergencyAccessBlocked, streetlightOnly, serious: directHighRisk || sanitationHazard || seriousScale, directHighRisk };
}

function relevantLocationFactors(category, nearbyPlaces = []) {
  const types = RELEVANT_TYPES[category] || RELEVANT_TYPES.Other;
  return nearbyPlaces
    .map((place) => (typeof place?.toObject === "function" ? place.toObject() : place))
    .filter((place) => types.includes(place.type) && Number(place.distanceMeters) <= 1000)
    .map((place) => ({
      type: place.type,
      name: place.name,
      distanceMeters: Number(place.distanceMeters),
      label: LOCATION_LABELS[place.type] || place.type,
    }));
}

function calculatePriority({ category, description, locationContext, supportCount = 1, aiAssessment = {} }) {
  const severity = getSeverity(description);
  const factors = relevantLocationFactors(category, locationContext?.nearbyPlaces);
  const closeSensitive = factors.find((place) => SENSITIVE_FACILITIES.includes(place.type) && place.distanceMeters < 200);
  const closeRoad = factors.find((place) => place.type === "major_road" && place.distanceMeters < 200);
  const nearbySensitive = factors.find((place) => SENSITIVE_FACILITIES.includes(place.type) && place.distanceMeters < 500);
  const manySupporters = Number(supportCount) >= 5;
  const substantialSupport = Number(supportCount) >= 10;

  let priority = "Medium";
  if (severity.minor) priority = closeSensitive || manySupporters ? "Medium" : "Low";
  if (severity.streetlightOnly && !severity.electricalHazard) priority = "Medium";
  if (severity.directHighRisk) priority = "High";

  // Location can only elevate an independently meaningful sanitation, safety,
  // accessibility, or serious-infrastructure signal; never a routine report.
  if (!severity.minor && priority !== "High" && severity.sanitationHazard && (closeSensitive || closeRoad)) priority = "High";
  if (!severity.minor && priority !== "High" && severity.serious && closeSensitive) priority = "High";
  if (!severity.minor && priority !== "High" && substantialSupport && (severity.serious || nearbySensitive)) priority = "High";
  // AI can only support an existing deterministic high-risk context.
  if (!severity.minor && priority !== "High" && aiAssessment.priority === "High" && severity.serious && (closeSensitive || closeRoad)) priority = "High";

  const reasons = [];
  if (severity.electricalHazard) reasons.push("Electrical hazard reported");
  else if (severity.majorFlooding) reasons.push("Flooding affecting public access reported");
  else if (severity.sanitationHazard) reasons.push("Drainage or sanitation hazard reported");
  else if (severity.openManhole) reasons.push("Open manhole or missing drain cover reported");
  else if (severity.collapsedInfrastructure) reasons.push("Dangerous or collapsed infrastructure reported");
  else if (severity.roadBlocked || severity.emergencyAccessBlocked) reasons.push("Road or emergency access obstruction reported");
  else if (severity.streetlightOnly) reasons.push("Streetlight service issue reported");
  else if (severity.minor) reasons.push("Complaint describes a minor issue");
  else reasons.push("Reported civic issue requires standard attention");
  factors
    .filter((place, index, all) => all.findIndex((candidate) => candidate.type === place.type) === index)
    .slice(0, 3)
    .forEach((place) => reasons.push(`${place.label} ${place.distanceMeters < 200 ? "within 200m" : place.distanceMeters < 500 ? "nearby" : "within 1km"}`));
  if (manySupporters) reasons.push(`${supportCount} citizens support this report`);

  return { priority, priorityReason: reasons.join("; "), priorityReasons: reasons, confidence: aiAssessment.confidence || "deterministic", relevantLocationFactors: factors, usedAi: aiAssessment.aiUnavailable !== true, locationImpact: closeSensitive || closeRoad ? "very_close" : nearbySensitive ? "nearby" : factors.length ? "further" : "none" };
}

module.exports = { calculatePriority, getSeverity, relevantLocationFactors };
