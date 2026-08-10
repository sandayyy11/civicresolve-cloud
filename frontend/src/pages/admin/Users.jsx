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
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Users</h1>
          <p className="mt-2 text-gray-500">
            Overview of CivicResolve citizens and workers.
          </p>
        </div>

        {statsError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {statsError}
          </div>
        )}

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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

        <section className="mt-10 rounded-2xl bg-white p-5 shadow-md sm:p-7">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Workers</h2>
            <p className="mt-1 text-sm text-gray-500">
              Current workforce availability and specialization.
            </p>
          </div>

          {workersError ? (
            <p className="rounded-xl bg-red-50 px-4 py-5 text-center text-sm text-red-600">{workersError}</p>
          ) : isWorkersLoading ? (
            <p className="py-10 text-center text-gray-500">Loading workers...</p>
          ) : workers.length === 0 ? (
            <p className="py-10 text-center text-gray-500">No workers have been created yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-3 py-3 font-semibold">Worker</th>
                    <th className="px-3 py-3 font-semibold">Email</th>
                    <th className="px-3 py-3 font-semibold">Specialization</th>
                    <th className="px-3 py-3 font-semibold">Availability</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((worker) => (
                    <tr key={worker._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="px-3 py-4 font-medium text-gray-800">{worker.name}</td>
                      <td className="px-3 py-4 text-gray-600">{worker.email}</td>
                      <td className="px-3 py-4 text-gray-600">{worker.specialization || "Other"}</td>
                      <td className="px-3 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${worker.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
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

        <section className="mt-10 rounded-2xl bg-white p-5 shadow-md sm:p-7">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Citizens</h2>
            <p className="mt-1 text-sm text-gray-500">
              Registered citizens on CivicResolve.
            </p>
          </div>

          {citizensError ? (
            <p className="rounded-xl bg-red-50 px-4 py-5 text-center text-sm text-red-600">{citizensError}</p>
          ) : isCitizensLoading ? (
            <p className="py-10 text-center text-gray-500">Loading citizens...</p>
          ) : citizens.length === 0 ? (
            <p className="py-10 text-center text-gray-500">No citizens have registered yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-3 py-3 font-semibold">Citizen</th>
                    <th className="px-3 py-3 font-semibold">Email</th>
                    <th className="px-3 py-3 font-semibold">Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {citizens.map((citizen) => (
                    <tr key={citizen._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="px-3 py-4 font-medium text-gray-800">{citizen.name}</td>
                      <td className="px-3 py-4 text-gray-600">{citizen.email}</td>
                      <td className="px-3 py-4 whitespace-nowrap text-gray-600">{formatDate(citizen.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

export default Users;