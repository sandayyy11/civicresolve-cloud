import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

function ComplaintMap() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    fetchIssues();
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

        {issues
          .filter(
            (issue) =>
              issue.location &&
              typeof issue.location.latitude === "number" &&
              typeof issue.location.longitude === "number"
          )
          .map((issue) => (
            <Marker
              key={issue._id}
              position={[
                issue.location.latitude,
                issue.location.longitude,
              ]}
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
                  </div>

                  {issue.imageUrl && (
                    <img
                      src={issue.imageUrl}
                      alt={issue.title}
                      className="rounded-lg mt-4 w-full"
                    />
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}

export default ComplaintMap;