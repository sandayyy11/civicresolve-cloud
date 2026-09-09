import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/ui/StatCard";
import StatusBadge from "../../components/ui/StatusBadge";
import PriorityBadge from "../../components/ui/PriorityBadge";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import {
  FaClipboardList,
  FaClock,
  FaSpinner,
  FaCheckCircle,
} from "react-icons/fa";

function WorkerDashboard() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);

  const fetchAssignedIssues = async () => {
    try {
      const response = await api.get("/worker/dashboard");
      setIssues(response.data.issues);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAssignedIssues();
  }, []);

  const updateStatus = async (issueId, status) => {
    try {
      await api.patch(`/worker/update-status/${issueId}`, { status });
      await fetchAssignedIssues();
    } catch (error) {
      console.error(error);
      alert("Failed to update status.");
    }
  };

  const resolveIssue = async (issueId) => {
    const resolutionNote = prompt("Enter a short resolution note:");
    if (!resolutionNote) return;

    try {
      await api.patch(`/worker/resolve/${issueId}`, { resolutionNote });
      await fetchAssignedIssues();
    } catch (error) {
      console.error(error);
      alert("Failed to resolve issue.");
    }
  };

  const pending = issues.filter((issue) => issue.status === "Pending").length;
  const inProgress = issues.filter((issue) => issue.status === "In Progress").length;
  const resolved = issues.filter((issue) => issue.status === "Resolved").length;

  const activeAssignments = issues.filter((issue) => issue.status !== "Resolved");
  const recentCompleted = issues.filter((issue) => issue.status === "Resolved");

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="page-title">Welcome back, {user?.name || "Worker"}!</h1>
        <p className="page-subtitle">
          Here's your task list for today.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned"
          value={issues.length}
          icon={<FaClipboardList />}
          color="blue"
          supportingText="Total assigned complaints"
        />
        <StatCard
          title="Pending"
          value={pending}
          icon={<FaClock />}
          color="yellow"
          supportingText="Awaiting action"
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          icon={<FaSpinner />}
          color="indigo"
          supportingText="Currently working"
        />
        <StatCard
          title="Completed"
          value={resolved}
          icon={<FaCheckCircle />}
          color="green"
          supportingText="Successfully resolved"
        />
      </div>

      {/* Active Assignments */}
      <div className="card mt-6 p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-slate-900">Active Assignments</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Complaints that need your attention.
          </p>
        </div>

        {activeAssignments.length === 0 ? (
          <div className="py-14 text-center">
            <FaClipboardList className="mx-auto text-slate-300" size={48} />
            <p className="mt-4 text-slate-500">No active assignments right now.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeAssignments.slice(0, 5).map((issue) => (
              <div key={issue._id} className="rounded-lg border border-slate-200 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900">{issue.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                      {issue.summary}
                    </p>
                  </div>
                  <PriorityBadge priority={issue.priority} />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="badge-neutral">{issue.category}</span>
                  <StatusBadge status={issue.status} />
                </div>

                {issue.location && (
                  <p className="mt-3 text-sm text-slate-500">
                    Location: {issue.location.latitude.toFixed(4)}, {issue.location.longitude.toFixed(4)}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {issue.status === "Pending" && (
                    <button
                      onClick={() => updateStatus(issue._id, "In Progress")}
                      className="btn-primary"
                    >
                      Start Work
                    </button>
                  )}

                  {issue.status === "In Progress" && (
                    <button
                      onClick={() => resolveIssue(issue._id)}
                      className="btn-success"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Completed */}
      <div className="card mt-6 p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-slate-900">Recent Completed Work</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Complaints you have successfully resolved.
          </p>
        </div>

        {recentCompleted.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            No resolved complaints yet.
          </p>
        ) : (
          <div className="space-y-3">
            {recentCompleted.slice(0, 5).map((issue) => (
              <div key={issue._id} className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-slate-900">{issue.title}</h3>
                  <StatusBadge status={issue.status} />
                </div>
                {issue.resolutionNote && (
                  <p className="mt-2 text-sm text-slate-600">{issue.resolutionNote}</p>
                )}
                <p className="mt-2 text-xs text-slate-400">
                  Resolved on {new Date(issue.updatedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default WorkerDashboard;
