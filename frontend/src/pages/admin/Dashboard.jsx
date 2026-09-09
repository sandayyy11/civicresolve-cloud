import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/ui/StatCard";
import StatusBadge from "../../components/ui/StatusBadge";
import PriorityBadge from "../../components/ui/PriorityBadge";
import { DonutChart, DonutLegend, BarChart, ProgressBar, CategoryIcon } from "../../components/ui/Charts";
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

const categoryColors = {
  Road: "#2563eb",
  Garbage: "#10b981",
  Water: "#06b6d4",
  Electricity: "#f59e0b",
  Other: "#64748b",
};

const statusColors = {
  Pending: "#f59e0b",
  "In Progress": "#6366f1",
  Resolved: "#10b981",
};

function formatDate(dateString) {
  if (!dateString) return "Not available";

  return new Date(dateString).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(dateString) {
  if (!dateString) return "Not available";

  return new Date(dateString).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
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

  const totalIssues = stats?.totalIssues ?? 0;
  const pendingIssues = stats?.pendingIssues ?? 0;
  const inProgressIssues = stats?.inProgressIssues ?? 0;
  const resolvedIssues = stats?.resolvedIssues ?? 0;

  const statisticCards = [
    {
      title: "Total Complaints",
      value: stats?.totalIssues,
      icon: <FaClipboardList />,
      color: "blue",
      supportingText: "All reported civic issues",
    },
    { title: "Pending", value: stats?.pendingIssues, icon: <FaClock />, color: "yellow", supportingText: "Awaiting action" },
    { title: "In Progress", value: stats?.inProgressIssues, icon: <FaSpinner />, color: "indigo", supportingText: "Being addressed" },
    { title: "Resolved", value: stats?.resolvedIssues, icon: <FaCheckCircle />, color: "green", supportingText: "Successfully closed" },
    { title: "Total Workers", value: stats?.totalWorkers, icon: <FaUsers />, color: "red", supportingText: "Municipal workforce" },
    { title: "Total Citizens", value: stats?.totalCitizens, icon: <FaUserFriends />, color: "blue", supportingText: "Registered citizens" },
  ];

  // Chart data
  const statusChartData = [
    { label: "Pending", value: pendingIssues, color: statusColors.Pending },
    { label: "In Progress", value: inProgressIssues, color: statusColors["In Progress"] },
    { label: "Resolved", value: resolvedIssues, color: statusColors.Resolved },
  ];

  const categoryChartData = categories.map((category) => ({
    label: category,
    value: issues.filter((issue) => issue.category === category).length,
    color: categoryColors[category],
  }));

  const priorityCounts = ["High", "Medium", "Low"].map((priority) => ({
    label: priority,
    value: issues.filter((issue) => issue.priority === priority).length,
  }));
  const maxPriority = Math.max(1, ...priorityCounts.map((p) => p.value));

  const priorityColors = {
    High: "#ef4444",
    Medium: "#f59e0b",
    Low: "#64748b",
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Welcome back, Admin!
        </h1>
        <p className="page-subtitle">
          Here's what's happening in CivicResolve today.
        </p>
      </div>

      {statsError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {statsError}
        </div>
      )}

      {/* KPI Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statisticCards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={isStatsLoading ? "—" : card.value ?? 0}
            icon={card.icon}
            color={card.color}
            supportingText={card.supportingText}
          />
        ))}
      </section>

      {/* Dashboard Grid */}
      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Complaints Overview */}
        <div className="card p-5 sm:p-6 lg:col-span-1">
          <h2 className="text-base font-semibold text-slate-900">Complaints Overview</h2>
          <p className="mt-0.5 text-sm text-slate-500">Current complaint status distribution</p>

          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row lg:flex-col xl:flex-row">
            <DonutChart data={statusChartData} size={160} thickness={20} />
            <div className="w-full flex-1">
              <DonutLegend data={statusChartData} />
            </div>
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="card p-5 sm:p-6 lg:col-span-2">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Recent Complaints</h2>
              <p className="mt-0.5 text-sm text-slate-500">Latest reported civic issues</p>
            </div>

            <form onSubmit={applyFilters} className="flex flex-wrap items-center gap-2">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by title"
                className="input w-40 sm:w-48"
              />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="input w-32 sm:w-36"
              >
                <option value="">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="input w-32 sm:w-36"
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <button type="submit" className="btn-primary">
                <FaSearch size={14} /> Search
              </button>
              <button type="button" onClick={clearFilters} className="btn-secondary">
                Clear
              </button>
            </form>
          </div>

          {issuesError ? (
            <p className="rounded-lg bg-red-50 px-4 py-5 text-center text-sm text-red-600">{issuesError}</p>
          ) : isIssuesLoading ? (
            <p className="py-10 text-center text-slate-500">Loading complaints...</p>
          ) : issues.length === 0 ? (
            <p className="py-10 text-center text-slate-500">No complaints match the current filters.</p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Complaint</th>
                    <th>Category</th>
                    <th>Reported By</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue) => (
                    <tr key={issue._id}>
                      <td>
                        <p className="font-medium text-slate-900">{issue.title}</p>
                        <p className="text-xs text-slate-400">
                          {issue.location
                            ? `${issue.location.latitude.toFixed(4)}, ${issue.location.longitude.toFixed(4)}`
                            : "No location"}
                        </p>
                      </td>
                      <td>
                        <span className="flex items-center gap-1.5 text-slate-600">
                          <CategoryIcon category={issue.category} className="text-sm" />
                          {issue.category || "N/A"}
                        </span>
                      </td>
                      <td className="text-slate-600">
                        {issue.reportedBy?.name || "Unknown citizen"}
                      </td>
                      <td className="whitespace-nowrap text-slate-500">
                        {formatDateTime(issue.createdAt)}
                      </td>
                      <td><StatusBadge status={issue.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Second grid: Categories + Workers + Priority */}
      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Complaints by Category */}
        <div className="card p-5 sm:p-6 lg:col-span-1">
          <h2 className="text-base font-semibold text-slate-900">Complaints by Category</h2>
          <p className="mt-0.5 text-sm text-slate-500">Distribution across complaint categories</p>
          <div className="mt-6">
            <BarChart data={categoryChartData} height={220} />
          </div>
        </div>

        {/* Worker Overview */}
        <div className="card p-5 sm:p-6 lg:col-span-2">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-900">Worker Overview</h2>
            <p className="mt-0.5 text-sm text-slate-500">Current workforce availability and specialization</p>
          </div>

          {workersError ? (
            <p className="rounded-lg bg-red-50 px-4 py-5 text-center text-sm text-red-600">{workersError}</p>
          ) : isWorkersLoading ? (
            <p className="py-10 text-center text-slate-500">Loading workers...</p>
          ) : workers.length === 0 ? (
            <p className="py-10 text-center text-slate-500">No workers have been created yet.</p>
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
                      <td className="font-medium text-slate-900">{worker.name}</td>
                      <td>{worker.email}</td>
                      <td className="text-slate-600">{worker.specialization || "Other"}</td>
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
        </div>
      </section>

      {/* Priority section */}
      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card p-5 sm:p-6">
          <h2 className="text-base font-semibold text-slate-900">Complaints by Priority</h2>
          <p className="mt-0.5 text-sm text-slate-500">Based on recent complaints</p>

          <div className="mt-6 space-y-5">
            {priorityCounts.map((item) => (
              <ProgressBar
                key={item.label}
                label={item.label}
                value={item.value}
                color={priorityColors[item.label]}
                max={maxPriority}
              />
            ))}
          </div>
        </div>

        {/* Resolution rate summary */}
        <div className="card p-5 sm:p-6 lg:col-span-2">
          <h2 className="text-base font-semibold text-slate-900">Resolution Summary</h2>
          <p className="mt-0.5 text-sm text-slate-500">Overall complaint resolution status</p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-center">
              <FaCheckCircle className="mx-auto mb-2 text-xl text-emerald-500" />
              <p className="text-2xl font-bold text-emerald-700">{resolvedIssues}</p>
              <p className="mt-1 text-sm text-emerald-600">Resolved</p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-center">
              <FaClock className="mx-auto mb-2 text-xl text-amber-500" />
              <p className="text-2xl font-bold text-amber-700">{pendingIssues + inProgressIssues}</p>
              <p className="mt-1 text-sm text-amber-600">In Progress / Pending</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-center">
              <FaClipboardList className="mx-auto mb-2 text-xl text-slate-400" />
              <p className="text-2xl font-bold text-slate-700">{totalIssues}</p>
              <p className="mt-1 text-sm text-slate-500">Total</p>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default Dashboard;