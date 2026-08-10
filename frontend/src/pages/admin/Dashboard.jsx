import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/ui/StatCard";
import StatusBadge from "../../components/ui/StatusBadge";
import PriorityBadge from "../../components/ui/PriorityBadge";
import api from "../../services/api";
import {
  FaCheckCircle,
  FaClipboardList,
  FaClock,
  FaSearch,
  FaSpinner,
  FaUserFriends,
  FaUsers,
} from "react-icons/fa";

const categories = ["Road", "Garbage", "Water", "Electricity", "Other"];

function formatDate(dateString) {
  if (!dateString) return "Not available";

  return new Date(dateString).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [issues, setIssues] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [isIssuesLoading, setIsIssuesLoading] = useState(true);
  const [isWorkersLoading, setIsWorkersLoading] = useState(true);
  const [statsError, setStatsError] = useState("");
  const [issuesError, setIssuesError] = useState("");
  const [workersError, setWorkersError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [search, setSearch] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    status: "",
    category: "",
    search: "",
  });

  const fetchDashboardData = async () => {
    try {
      setIsStatsLoading(true);
      setIsWorkersLoading(true);
      setStatsError("");
      setWorkersError("");

      const [statsResponse, workersResponse] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/workers"),
      ]);

      setStats(statsResponse.data.stats);
      setWorkers(workersResponse.data.workers || []);
    } catch (error) {
      if (!error.response || error.response.config.url.includes("/dashboard")) {
        setStatsError("Unable to load dashboard statistics.");
      }

      if (!error.response || error.response.config.url.includes("/workers")) {
        setWorkersError("Unable to load workers.");
      }
    } finally {
      setIsStatsLoading(false);
      setIsWorkersLoading(false);
    }
  };

  const fetchIssues = async () => {
    try {
      setIsIssuesLoading(true);
      setIssuesError("");

      const params = { limit: 10 };
      if (appliedFilters.status) params.status = appliedFilters.status;
      if (appliedFilters.category) params.category = appliedFilters.category;
      if (appliedFilters.search) params.search = appliedFilters.search;

      const response = await api.get("/issues", { params });
      setIssues(response.data.issues || []);
    } catch (error) {
      setIssuesError("Unable to load complaints.");
    } finally {
      setIsIssuesLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [appliedFilters]);

  const applyFilters = (event) => {
    event.preventDefault();
    setAppliedFilters({
      status: statusFilter,
      category: categoryFilter,
      search: search.trim(),
    });
  };

  const clearFilters = () => {
    setStatusFilter("");
    setCategoryFilter("");
    setSearch("");
    setAppliedFilters({ status: "", category: "", search: "" });
  };

  const statisticCards = [
    { title: "Total Complaints", value: stats?.totalIssues, icon: <FaClipboardList />, color: "blue" },
    { title: "Pending", value: stats?.pendingIssues, icon: <FaClock />, color: "yellow" },
    { title: "In Progress", value: stats?.inProgressIssues, icon: <FaSpinner />, color: "blue" },
    { title: "Resolved", value: stats?.resolvedIssues, icon: <FaCheckCircle />, color: "green" },
    { title: "Total Workers", value: stats?.totalWorkers, icon: <FaUsers />, color: "red" },
    { title: "Total Citizens", value: stats?.totalCitizens, icon: <FaUserFriends />, color: "blue" },
  ];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="mt-2 text-gray-500">
            Monitor CivicResolve complaints, workers, and service progress.
          </p>
        </div>

        {statsError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {statsError}
          </div>
        )}

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {statisticCards.map((card) => (
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
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Recent Complaints</h2>
              <p className="mt-1 text-sm text-gray-500">Review the latest reported civic issues.</p>
            </div>
          </div>

          <form onSubmit={applyFilters} className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-4">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title"
              className="rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                type="submit"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700"
              >
                <FaSearch /> Search
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl border border-gray-300 px-4 py-2.5 font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Clear
              </button>
            </div>
          </form>

          {issuesError ? (
            <p className="rounded-xl bg-red-50 px-4 py-5 text-center text-sm text-red-600">{issuesError}</p>
          ) : isIssuesLoading ? (
            <p className="py-10 text-center text-gray-500">Loading complaints...</p>
          ) : issues.length === 0 ? (
            <p className="py-10 text-center text-gray-500">No complaints match the current filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-3 py-3 font-semibold">Complaint</th>
                    <th className="px-3 py-3 font-semibold">Category</th>
                    <th className="px-3 py-3 font-semibold">Priority</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-3 py-3 font-semibold">Reported by</th>
                    <th className="px-3 py-3 font-semibold">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue) => (
                    <tr key={issue._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="px-3 py-4 font-medium text-gray-800">{issue.title}</td>
                      <td className="px-3 py-4 text-gray-600">{issue.category || "N/A"}</td>
                      <td className="px-3 py-4"><PriorityBadge priority={issue.priority} /></td>
                      <td className="px-3 py-4"><StatusBadge status={issue.status} /></td>
                      <td className="px-3 py-4 text-gray-600">
                        <p>{issue.reportedBy?.name || "Unknown citizen"}</p>
                        {issue.reportedBy?.email && <p className="text-xs text-gray-400">{issue.reportedBy.email}</p>}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-gray-600">{formatDate(issue.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-10 rounded-2xl bg-white p-5 shadow-md sm:p-7">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Worker Overview</h2>
            <p className="mt-1 text-sm text-gray-500">Current workforce availability and performance.</p>
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
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
