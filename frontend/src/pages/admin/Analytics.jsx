import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/ui/StatCard";
import { DonutChart, DonutLegend, BarChart, ProgressBar } from "../../components/ui/Charts";
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
const priorities = ["High", "Medium", "Low"];

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

const priorityColors = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#64748b",
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
  const pendingIssues = stats?.pendingIssues ?? 0;
  const inProgressIssues = stats?.inProgressIssues ?? 0;
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

  const priorityCounts = priorities.map((priority) => ({
    name: priority,
    count: issues.filter((issue) => issue.priority === priority).length,
  }));

  const maxCategoryCount = Math.max(1, ...categoryCounts.map((item) => item.count));
  const maxPriorityCount = Math.max(1, ...priorityCounts.map((item) => item.count));

  const statusDonutData = statusCounts.map((item) => ({
    label: item.name,
    value: item.count,
    color: statusColors[item.name],
  }));

  const categoryDonutData = categoryCounts.map((item) => ({
    label: item.name,
    value: item.count,
    color: categoryColors[item.name],
  }));

  const overviewCards = [
    { title: "Total Complaints", value: stats?.totalIssues, icon: <FaClipboardList />, color: "blue", supportingText: "All reported issues" },
    { title: "Pending", value: stats?.pendingIssues, icon: <FaClock />, color: "yellow", supportingText: "Awaiting action" },
    { title: "In Progress", value: stats?.inProgressIssues, icon: <FaSpinner />, color: "indigo", supportingText: "Being addressed" },
    { title: "Resolved", value: stats?.resolvedIssues, icon: <FaCheckCircle />, color: "green", supportingText: "Successfully closed" },
    { title: "Resolution Rate", value: `${resolutionRate}%`, icon: <FaCheckCircle />, color: "green", supportingText: "Of total complaints" },
    { title: "Total Workers", value: stats?.totalWorkers, icon: <FaUserTie />, color: "red", supportingText: `${availableWorkers} available now` },
    { title: "Total Citizens", value: stats?.totalCitizens, icon: <FaUserFriends />, color: "blue", supportingText: "Registered citizens" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">Operational insights and complaint intelligence.</p>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-50 px-4 py-5 text-center text-sm text-red-600">{error}</p>
      ) : isLoading ? (
        <p className="py-10 text-center text-slate-500">Loading analytics...</p>
      ) : (
        <>
          {/* KPI Row */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {overviewCards.map((card) => (
              <StatCard
                key={card.title}
                title={card.title}
                value={card.value ?? 0}
                icon={card.icon}
                color={card.color}
                supportingText={card.supportingText}
              />
            ))}
          </section>

          {/* Charts grid */}
          <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Status Donut */}
            <div className="card p-5 sm:p-6">
              <h2 className="text-base font-semibold text-slate-900">Complaint Status</h2>
              <p className="mt-0.5 text-sm text-slate-500">Current status distribution</p>
              <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">
                <DonutChart data={statusDonutData} size={180} thickness={22} />
                <div className="w-full flex-1">
                  <DonutLegend data={statusDonutData} />
                </div>
              </div>
            </div>

            {/* Category Donut */}
            <div className="card p-5 sm:p-6">
              <h2 className="text-base font-semibold text-slate-900">Complaint Categories</h2>
              <p className="mt-0.5 text-sm text-slate-500">Distribution across categories</p>
              <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">
                <DonutChart data={categoryDonutData} size={180} thickness={22} />
                <div className="w-full flex-1">
                  <DonutLegend data={categoryDonutData} />
                </div>
              </div>
            </div>

            {/* Priority */}
            <div className="card p-5 sm:p-6">
              <h2 className="text-base font-semibold text-slate-900">Complaints by Priority</h2>
              <p className="mt-0.5 text-sm text-slate-500">Priority level distribution</p>
              <div className="mt-6 space-y-5">
                {priorityCounts.map((item) => (
                  <ProgressBar
                    key={item.name}
                    label={item.name}
                    value={item.count}
                    color={priorityColors[item.name]}
                    max={maxPriorityCount}
                  />
                ))}
              </div>
            </div>

            {/* Worker Availability */}
            <div className="card p-5 sm:p-6">
              <h2 className="text-base font-semibold text-slate-900">Worker Availability</h2>
              <p className="mt-0.5 text-sm text-slate-500">Current workforce availability</p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-center">
                  <FaUsers className="mx-auto mb-2 text-xl text-slate-400" />
                  <p className="text-2xl font-bold text-slate-900">{workers.length}</p>
                  <p className="mt-1 text-sm text-slate-500">Total Workers</p>
                </div>
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-center">
                  <FaUserTie className="mx-auto mb-2 text-xl text-emerald-500" />
                  <p className="text-2xl font-bold text-emerald-700">{availableWorkers}</p>
                  <p className="mt-1 text-sm text-emerald-600">Available</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-center">
                  <FaUserTie className="mx-auto mb-2 text-xl text-slate-400" />
                  <p className="text-2xl font-bold text-slate-700">{unavailableWorkers}</p>
                  <p className="mt-1 text-sm text-slate-500">Unavailable</p>
                </div>
              </div>
            </div>
          </section>

          {/* Category bar chart */}
          <section className="card mt-6 p-5 sm:p-6">
            <h2 className="text-base font-semibold text-slate-900">Complaint Categories</h2>
            <p className="mt-0.5 text-sm text-slate-500">Count of complaints by category</p>
            <div className="mt-6">
              <BarChart
                data={categoryCounts.map((item) => ({
                  label: item.name,
                  value: item.count,
                  color: categoryColors[item.name],
                }))}
                height={220}
              />
            </div>
          </section>
        </>
      )}
    </DashboardLayout>
  );
}

export default Analytics;