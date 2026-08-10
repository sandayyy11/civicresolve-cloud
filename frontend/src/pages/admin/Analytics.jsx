import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/ui/StatCard";
import api from "../../services/api";
import {
  FaCheckCircle,
  FaClipboardList,
  FaClock,
  FaSpinner,
  FaUserFriends,
  FaUserTie,
  FaUsers,
} from "react-icons/fa";

const categories = ["Road", "Garbage", "Water", "Electricity", "Other"];
const statuses = ["Pending", "In Progress", "Resolved"];

const categoryColors = {
  Road: "bg-blue-500",
  Garbage: "bg-green-500",
  Water: "bg-cyan-500",
  Electricity: "bg-yellow-500",
  Other: "bg-gray-500",
};

const statusColors = {
  Pending: "bg-yellow-500",
  "In Progress": "bg-blue-500",
  Resolved: "bg-green-500",
};

function Analytics() {
  const [stats, setStats] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError("");

      const [statsResponse, workersResponse, issuesResponse] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/workers"),
        api.get("/issues", { params: { limit: 1000 } }),
      ]);

      setStats(statsResponse.data.stats);
      setWorkers(workersResponse.data.workers || []);
      setIssues(issuesResponse.data.issues || []);
    } catch (err) {
      setError("Unable to load analytics data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalIssues = stats?.totalIssues ?? 0;
  const resolvedIssues = stats?.resolvedIssues ?? 0;
  const resolutionRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0;

  const availableWorkers = workers.filter((worker) => worker.isAvailable).length;
  const unavailableWorkers = workers.length - availableWorkers;

  const categoryCounts = categories.map((category) => ({
    name: category,
    count: issues.filter((issue) => issue.category === category).length,
  }));

  const statusCounts = statuses.map((status) => ({
    name: status,
    count: issues.filter((issue) => issue.status === status).length,
  }));

  const maxCategoryCount = Math.max(1, ...categoryCounts.map((item) => item.count));
  const maxStatusCount = Math.max(1, ...statusCounts.map((item) => item.count));

  const overviewCards = [
    { title: "Total Complaints", value: stats?.totalIssues, icon: <FaClipboardList />, color: "blue" },
    { title: "Pending", value: stats?.pendingIssues, icon: <FaClock />, color: "yellow" },
    { title: "In Progress", value: stats?.inProgressIssues, icon: <FaSpinner />, color: "blue" },
    { title: "Resolved", value: stats?.resolvedIssues, icon: <FaCheckCircle />, color: "green" },
    { title: "Resolution Rate", value: `${resolutionRate}%`, icon: <FaCheckCircle />, color: "green" },
    { title: "Total Workers", value: stats?.totalWorkers, icon: <FaUserTie />, color: "red" },
    { title: "Total Citizens", value: stats?.totalCitizens, icon: <FaUserFriends />, color: "blue" },
  ];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
          <p className="mt-2 text-gray-500">
            Overview of CivicResolve complaints, categories, and workforce.
          </p>
        </div>

        {error ? (
          <p className="rounded-xl bg-red-50 px-4 py-5 text-center text-sm text-red-600">{error}</p>
        ) : isLoading ? (
          <p className="py-10 text-center text-gray-500">Loading analytics...</p>
        ) : (
          <>
            <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {overviewCards.map((card) => (
                <StatCard
                  key={card.title}
                  title={card.title}
                  value={card.value ?? 0}
                  icon={card.icon}
                  color={card.color}
                />
              ))}
            </section>

            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <section className="rounded-2xl bg-white p-5 shadow-md sm:p-7">
                <h2 className="text-2xl font-bold text-gray-800">Complaints by Category</h2>
                <p className="mt-1 text-sm text-gray-500">Distribution across complaint categories.</p>

                <div className="mt-6 space-y-4">
                  {categoryCounts.map((item) => (
                    <div key={item.name}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">{item.name}</span>
                        <span className="text-gray-500">{item.count}</span>
                      </div>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${categoryColors[item.name]}`}
                          style={{ width: `${(item.count / maxCategoryCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl bg-white p-5 shadow-md sm:p-7">
                <h2 className="text-2xl font-bold text-gray-800">Complaints by Status</h2>
                <p className="mt-1 text-sm text-gray-500">Current status of all complaints.</p>

                <div className="mt-6 space-y-4">
                  {statusCounts.map((item) => (
                    <div key={item.name}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">{item.name}</span>
                        <span className="text-gray-500">{item.count}</span>
                      </div>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${statusColors[item.name]}`}
                          style={{ width: `${(item.count / maxStatusCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <section className="mt-6 rounded-2xl bg-white p-5 shadow-md sm:p-7">
              <h2 className="text-2xl font-bold text-gray-800">Worker Availability</h2>
              <p className="mt-1 text-sm text-gray-500">Current workforce availability.</p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-200 p-5 text-center">
                  <FaUsers className="mx-auto mb-2 text-2xl text-gray-400" />
                  <p className="text-3xl font-bold text-gray-800">{workers.length}</p>
                  <p className="mt-1 text-sm text-gray-500">Total Workers</p>
                </div>
                <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-center">
                  <FaUserTie className="mx-auto mb-2 text-2xl text-green-500" />
                  <p className="text-3xl font-bold text-green-700">{availableWorkers}</p>
                  <p className="mt-1 text-sm text-green-600">Available</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center">
                  <FaUserTie className="mx-auto mb-2 text-2xl text-gray-400" />
                  <p className="text-3xl font-bold text-gray-700">{unavailableWorkers}</p>
                  <p className="mt-1 text-sm text-gray-500">Unavailable</p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Analytics;