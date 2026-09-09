import DashboardLayout from "../../components/layout/DashboardLayout";
import ComplaintMap from "../../components/map/ComplaintMap";

function Map() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="page-title">Complaint Map</h1>
          <p className="page-subtitle">
            View complaints reported across your area.
          </p>
        </div>

        <ComplaintMap />
      </div>
    </DashboardLayout>
  );
}

export default Map;