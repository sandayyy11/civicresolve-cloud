import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/ui/StatCard";
import api from "../../services/api";
import { FaUserFriends, FaUserTie } from "react-icons/fa";

function formatDate(dateString) {
  if (!dateString) return "Not available";

  return new Date(dateString).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Users() {
  const [stats, setStats] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [citizens, setCitizens] = useState([]);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [isWorkersLoading, setIsWorkersLoading] = useState(true);
  const [isCitizensLoading, setIsCitizensLoading] = useState(true);
  const [statsError, setStatsError] = useState("");
  const [workersError, setWorkersError] = useState("");
  const [citizensError, setCitizensError] = useState("");

  const fetchData = async () => {
    try {
      setIsStatsLoading(true);
      setIsWorkersLoading(true);
      setIsCitizensLoading(true);
      setStatsError("");
      setWorkersError("");
      setCitizensError("");

      const [statsResponse, workersResponse, citizensResponse] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/workers"),
        api.get("/admin/citizens"),
      ]);

      setStats(statsResponse.data.stats);
      setWorkers(workersResponse.data.workers || []);
      setCitizens(citizensResponse.data.citizens || []);
    } catch (error) {
      if (!error.response || error.response.config.url.includes("/dashboard")) {
        setStatsError("Unable to load user statistics.");
      }

      if (!error.response || error.response.config.url.includes("/workers")) {
        setWorkersError("Unable to load workers.");
      }

      if (!error.response || error.response.config.url.includes("/citizens")) {
        setCitizensError("Unable to load citizens.");
      }
    } finally {
      setIsStatsLoading(false);
      setIsWorkersLoading(false);
      setIsCitizensLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const summaryCards = [
    { title: "Total Citizens", value: stats?.totalCitizens, icon: <FaUserFriends />, color: "blue" },
    { title: "Total Workers", value: stats?.totalWorkers, icon: <FaUserTie />, color: "green" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="page-title">Users</h1>
        <p className="page-subtitle">Overview of CivicResolve citizens and workers.</p>
      </div>

      {statsError && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {statsError}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {summaryCards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={isStatsLoading ? "—" : card.value ?? 0}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </section>

      <section className="card mt-6 p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Workers</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            Current workforce availability and specialization.
          </p>
        </div>

        {workersError ? (
          <p className="rounded-md bg-red-50 px-4 py-5 text-center text-sm text-red-600">{workersError}</p>
        ) : isWorkersLoading ? (
          <p className="py-10 text-center text-gray-500">Loading workers...</p>
        ) : workers.length === 0 ? (
          <p className="py-10 text-center text-gray-500">No workers have been created yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Worker</th>
                  <th>Email</th>
                  <th>Specialization</th>
                  <th>Availability</th>
                </tr>
              </thead>
              <tbody>
                {workers.map((worker) => (
                  <tr key={worker._id}>
                    <td className="font-medium text-gray-900">{worker.name}</td>
                    <td>{worker.email}</td>
                    <td>{worker.specialization || "Other"}</td>
                    <td>
                      <span className={worker.isAvailable ? "badge-resolved" : "badge-neutral"}>
                        {worker.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="card mt-6 p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Citizens</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            Registered citizens on CivicResolve.
          </p>
        </div>

        {citizensError ? (
          <p className="rounded-md bg-red-50 px-4 py-5 text-center text-sm text-red-600">{citizensError}</p>
        ) : isCitizensLoading ? (
          <p className="py-10 text-center text-gray-500">Loading citizens...</p>
        ) : citizens.length === 0 ? (
          <p className="py-10 text-center text-gray-500">No citizens have registered yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Citizen</th>
                  <th>Email</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {citizens.map((citizen) => (
                  <tr key={citizen._id}>
                    <td className="font-medium text-gray-900">{citizen.name}</td>
                    <td>{citizen.email}</td>
                    <td className="whitespace-nowrap">{formatDate(citizen.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}

export default Users;