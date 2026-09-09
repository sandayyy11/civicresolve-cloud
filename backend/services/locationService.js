const EARTH_RADIUS_METERS = 6371000;
const SEARCH_RADIUS_METERS = 1000;
const REQUEST_TIMEOUT_MS = 20000;
const DEFAULT_OVERPASS_ENDPOINTS = ["https://overpass-api.de/api/interpreter"];

function hasValidCoordinates(latitude, longitude) {
  const lat = Number(latitude);
  const lon = Number(longitude);
  return Number.isFinite(lat) && Number.isFinite(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

function distanceInMeters(latitudeA, longitudeA, latitudeB, longitudeB) {
  const toRadians = (value) => (value * Math.PI) / 180;
  const deltaLatitude = toRadians(latitudeB - latitudeA);
  const deltaLongitude = toRadians(longitudeB - longitudeA);
  const a = Math.sin(deltaLatitude / 2) ** 2
    + Math.cos(toRadians(latitudeA)) * Math.cos(toRadians(latitudeB)) * Math.sin(deltaLongitude / 2) ** 2;
  return Math.round(EARTH_RADIUS_METERS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function placeType(tags = {}) {
  if (tags.amenity === "school") return "school";
  if (tags.amenity === "college") return "college";
  if (tags.amenity === "university") return "university";
  if (tags.amenity === "hospital") return "hospital";
  if (tags.amenity === "police") return "police_station";
  if (tags.amenity === "fire_station") return "fire_station";
  if (tags.amenity === "townhall" || tags.office === "government") return "government_office";
  if (tags.highway && /^(motorway|trunk|primary|secondary)$/.test(tags.highway)) return "major_road";
  if (tags.amenity === "bus_station" || tags.railway === "station" || tags.public_transport) return "public_transport";
  return null;
}

function defaultName(type, tags = {}) {
  if (tags.name) return tags.name;
  const names = {
    school: "School", college: "College", university: "University", hospital: "Hospital", police_station: "Police station",
    fire_station: "Fire station", government_office: "Government office",
    major_road: "Major road", public_transport: "Public transport",
  };
  return names[type] || "Public location";
}

function coordinateForElement(element) {
  if (Number.isFinite(element.lat) && Number.isFinite(element.lon)) return element;
  if (element.center && Number.isFinite(element.center.lat) && Number.isFinite(element.center.lon)) return element.center;
  return null;
}

/**
 * Looks up civic POIs from OpenStreetMap's public Overpass API. The provider is
 * intentionally best-effort: a failed or rate-limited lookup returns no context.
 */
async function findNearbyPlaces(latitude, longitude) {
  if (!hasValidCoordinates(latitude, longitude)) return [];

  const lat = Number(latitude);
  const lon = Number(longitude);
  const query = `[out:json][timeout:15];(
    nwr["amenity"~"^(school|college|university|hospital|police|fire_station|townhall|bus_station)$"](around:${SEARCH_RADIUS_METERS},${lat},${lon});
    nwr["office"="government"](around:${SEARCH_RADIUS_METERS},${lat},${lon});
    nwr["public_transport"~"^(station|platform)$"](around:${SEARCH_RADIUS_METERS},${lat},${lon});
    nwr["railway"="station"](around:${SEARCH_RADIUS_METERS},${lat},${lon});
    way["highway"~"^(motorway|trunk|primary|secondary)$"](around:${SEARCH_RADIUS_METERS},${lat},${lon});
  );out center tags;`;

  const endpoints = process.env.OVERPASS_API_URL
    ? [process.env.OVERPASS_API_URL]
    : DEFAULT_OVERPASS_ENDPOINTS;
  try {
    let payload;
    let lastError;
    for (const endpoint of endpoints) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            // Public Overpass instances may reject anonymous automated traffic.
            "User-Agent": "CivicResolve/1.0 (location intelligence)",
          },
          body: new URLSearchParams({ data: query }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Overpass returned ${response.status}`);
        payload = await response.json();
        break;
      } catch (error) {
        lastError = error;
      } finally {
        clearTimeout(timer);
      }
    }
    if (!payload) throw lastError || new Error("No Overpass response");
    const seen = new Set();
    const places = (payload.elements || [])
      .map((element) => {
        const type = placeType(element.tags);
        const point = coordinateForElement(element);
        if (!type || !point) return null;
        const distanceMeters = distanceInMeters(lat, lon, point.lat, point.lon);
        if (distanceMeters > SEARCH_RADIUS_METERS) return null;
        const name = defaultName(type, element.tags);
        // Roads are often split into many OpenStreetMap way segments. Present
        // one nearby entry per named location instead of repeated segments.
        const key = `${type}:${name}`;
        if (seen.has(key)) return null;
        seen.add(key);
        return { type, name, distanceMeters };
      })
      .filter(Boolean)
      .sort((a, b) => a.distanceMeters - b.distanceMeters);

    // Dense road networks should not crowd schools, hospitals, and other
    // categories out of the concise citizen-facing context.
    const countByType = {};
    return places.filter((place) => {
      countByType[place.type] = (countByType[place.type] || 0) + 1;
      return countByType[place.type] <= 3;
    }).slice(0, 10);
  } catch (error) {
    console.warn("Location lookup unavailable; continuing without POI context:", error.message);
    return [];
  }
}

async function getLocationContext(latitude, longitude) {
  if (!hasValidCoordinates(latitude, longitude)) return { nearbyPlaces: [] };
  return { nearbyPlaces: await findNearbyPlaces(latitude, longitude) };
}

module.exports = { SEARCH_RADIUS_METERS, hasValidCoordinates, distanceInMeters, findNearbyPlaces, getLocationContext };
