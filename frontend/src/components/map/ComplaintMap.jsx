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

function FitBounds({ issues }) {
  const map = useMap();

  useEffect(() => {
    const validIssues = issues.filter(
      (issue) =>
        issue.location &&
        typeof issue.location.latitude === "number" &&
        typeof issue.location.longitude === "number"
    );

    if (validIssues.length === 0) return;

    const bounds = validIssues.map((issue) => [
      issue.location.latitude,
      issue.location.longitude,
    ]);

    map.fitBounds(bounds, {
      padding: [50, 50],
    });
  }, [issues, map]);

  return null;
}

function ComplaintMap() {
  const [issues, setIssues] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const nearbyIssues = userLocation
  ? issues.filter((issue) => {
      if (!issue.location) return false;

      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        issue.location.latitude,
        issue.location.longitude
      );

      return distance <= 10000;
    })
  : [];

  useEffect(() => {
    fetchIssues();
    detectUserLocation();
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await api.get("/issues");

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
      radius={100}
      pathOptions={{
        color: "#2563eb",
        fillColor: "#60a5fa",
        fillOpacity: 0.25,
      }}
    />
  </>
)}

        {issues
  .filter(
    (issue) =>
      issue.location &&
      typeof issue.location.latitude === "number" &&
      typeof issue.location.longitude === "number"
  )
  .map((issue) => {
    const distance = userLocation
      ? calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          issue.location.latitude,
          issue.location.longitude
        )
      : null;

    return (
      <Marker
        key={issue._id}
        position={[
          issue.location.latitude,
          issue.location.longitude,
        ]}
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
                  <strong>Distance:</strong> {distance} m
                </p>
              )}
            </div>

            {issue.imageUrl && (
              <img
                src={issue.imageUrl}
                alt={issue.title}
                className="rounded-lg mt-4 w-full"
              />
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
      <div className="bg-white rounded-2xl shadow-md mt-8 p-6">
  <h2 className="text-2xl font-bold mb-5">
    Nearby Complaints
  </h2>

  {nearbyIssues.length === 0 ? (
    <p className="text-gray-500">
      No nearby complaints found.
    </p>
  ) : (
    <div className="space-y-4">
      {nearbyIssues.map((issue) => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          issue.location.latitude,
          issue.location.longitude
        );

        return (
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

            <div className="flex gap-5 mt-3 text-sm">
              <span>
                📍 {distance} m away
              </span>

              <span>
                {issue.category}
              </span>

              <span>
                {issue.status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  )}
</div>
    </div>
  );
}

export default ComplaintMap;