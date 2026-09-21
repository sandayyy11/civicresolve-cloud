import { useEffect, useState } from "react";
import api from "../../services/api";
import { markerIcons } from "../../utils/markerIcons";
import { calculateDistance } from "../../utils/distance";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
} from "react-leaflet";

const NEARBY_RADIUS_METERS = 10000; // 10 km

// Safely parse coordinate values from either numbers or numeric strings
function parseCoord(value) {
  if (value === null || value === undefined || value === "") return null;

  const num = Number(value);
  if (!Number.isFinite(num)) return null;

  return num;
}

// Returns a valid [latitude, longitude] pair or null
function getLatLng(issue) {
  if (!issue?.location) return null;

  const latitude = parseCoord(issue.location.latitude);
  const longitude = parseCoord(issue.location.longitude);

  if (
    latitude === null ||
    longitude === null ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  return { latitude, longitude };
}

function formatDistance(meters) {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km away`;
  }
  return `${Math.round(meters)} m away`;
}

function FitBounds({ issues }) {
  const map = useMap();

  useEffect(() => {
    const validPoints = issues
      .map((issue) => {
        const coords = getLatLng(issue);
        return coords ? [coords.latitude, coords.longitude] : null;
      })
      .filter(Boolean);

    if (validPoints.length === 0) return;

    map.fitBounds(validPoints, {
      padding: [50, 50],
    });
  }, [issues, map]);

  return null;
}

function ComplaintMap() {
  const [issues, setIssues] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  // Compute nearby complaints with distance, sorted nearest first
  const nearbyIssues = userLocation
    ? issues
        .map((issue) => {
          const coords = getLatLng(issue);
          if (!coords) return null;

          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            coords.latitude,
            coords.longitude
          );

          return { issue, distance };
        })
        .filter((item) => item !== null && item.distance <= NEARBY_RADIUS_METERS)
        .sort((a, b) => a.distance - b.distance)
    : [];

  useEffect(() => {
    fetchIssues();
    detectUserLocation();
  }, []);

  const fetchIssues = async () => {
    try {
      // Fetch enough issues to accurately determine nearby complaints
      const response = await api.get("/issues", {
        params: { limit: 100 },
      });

      console.log("Fetched Issues:", response.data.issues);

      setIssues(response.data.issues);
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  const detectUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error(error);
        alert("Unable to get your location.");
      }
    );
  };

  const supportComplaint = async (issueId) => {
    try {
      const response = await api.patch(`/issues/${issueId}/support`);

      alert(response.data.message);

      fetchIssues();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to support complaint."
      );
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg">
      <MapContainer
        center={[17.5449, 78.5718]}
        zoom={14}
        style={{
          height: "650px",
          width: "100%",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds issues={issues} />

        {userLocation && (
          <>
            <Marker
              position={[
                userLocation.latitude,
                userLocation.longitude,
              ]}
            >
              <Popup>
                📍 You are here
              </Popup>
            </Marker>

            <Circle
              center={[
                userLocation.latitude,
                userLocation.longitude,
              ]}
              radius={NEARBY_RADIUS_METERS}
              pathOptions={{
                color: "#2563eb",
                fillColor: "#60a5fa",
                fillOpacity: 0.1,
              }}
            />
          </>
        )}

        {issues
          .map((issue) => {
            const coords = getLatLng(issue);
            return coords ? { issue, coords } : null;
          })
          .filter(Boolean)
          .map(({ issue, coords }) => {
            const distance = userLocation
              ? calculateDistance(
                  userLocation.latitude,
                  userLocation.longitude,
                  coords.latitude,
                  coords.longitude
                )
              : null;

            return (
              <Marker
                key={issue._id}
                position={[coords.latitude, coords.longitude]}
                icon={markerIcons[issue.category] || markerIcons.Other}
              >
                <Popup>
                  <div className="w-64">
                    <h3 className="text-lg font-bold">
                      {issue.title}
                    </h3>

                    <p className="text-sm text-gray-600 mt-2">
                      {issue.summary || issue.description}
                    </p>

                    <div className="mt-3 space-y-1">
                      <p>
                        <strong>Category:</strong> {issue.category}
                      </p>

                      <p>
                        <strong>Status:</strong> {issue.status}
                      </p>

                      <p>
                        <strong>Priority:</strong> {issue.priority}
                      </p>
                      <p>
                        <strong>❤️ Supported By:</strong> {issue.supportCount} citizens
                      </p>

                      {distance !== null && (
                        <p>
                          <strong>Distance:</strong> {formatDistance(distance)}
                        </p>
                      )}
                    </div>

                    {issue.imageUrl && (
                      <div className="relative mt-4 w-full aspect-video overflow-hidden rounded-xl">
                        <img
                          src={issue.imageUrl}
                          alt={issue.title}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <button
                      onClick={() => supportComplaint(issue._id)}
                      className="mt-4 w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg transition"
                    >
                      ❤️ Support Complaint
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>

      {/* Nearby Complaints */}
      <div className="bg-white rounded-2xl shadow-md mt-8 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Nearby Complaints
          </h2>

          {userLocation && nearbyIssues.length > 0 && (
            <span className="text-sm text-gray-500">
              {nearbyIssues.length} within {NEARBY_RADIUS_METERS / 1000} km
            </span>
          )}
        </div>

        {!userLocation ? (
          <p className="text-gray-500">
            Enable location access to see complaints near you.
          </p>
        ) : nearbyIssues.length === 0 ? (
          <p className="text-gray-500">
            No nearby complaints found within {NEARBY_RADIUS_METERS / 1000} km.
          </p>
        ) : (
          <div className="space-y-4">
            {nearbyIssues.map(({ issue, distance }) => (
              <div
                key={issue._id}
                className="border rounded-xl p-4"
              >
                <h3 className="font-bold text-lg">
                  {issue.title}
                </h3>

                <p className="text-gray-600 mt-2">
                  {issue.summary || issue.description}
                </p>

                <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-sm">
                  <span className="font-medium text-primary-600">
                    📍 {formatDistance(distance)}
                  </span>

                  <span>
                    {issue.category}
                  </span>

                  <span>
                    {issue.priority}
                  </span>

                  <span className={issue.status === "Resolved" ? "text-green-600" : issue.status === "In Progress" ? "text-indigo-600" : "text-amber-600"}>
                    {issue.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ComplaintMap;
