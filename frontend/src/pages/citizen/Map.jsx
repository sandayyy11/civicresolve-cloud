import DashboardLayout from "../../components/layout/DashboardLayout";
import ComplaintMap from "../../components/map/ComplaintMap";

function Map() {
  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div>

          <h1 className="text-3xl font-bold">
            Complaint Map
          </h1>

          <p className="text-gray-500 mt-2">
            View complaints reported across your area.
          </p>

        </div>

        <ComplaintMap />

      </div>
    </DashboardLayout>
  );
}

export default Map;