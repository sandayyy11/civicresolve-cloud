import { useEffect, useState } from "react";
import api from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/ui/StatusBadge";
import PriorityBadge from "../../components/ui/PriorityBadge";
import { Briefcase, MapPin, Calendar } from "lucide-react";

function formatDate(dateString) {
  if (!dateString) return "Not available";

  return new Date(dateString).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function WorkerIssues() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    fetchAssignedIssues();
  }, []);

  const fetchAssignedIssues = async () => {
    try {
      const response = await api.get("/worker/dashboard");
      setIssues(response.data.issues);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (issueId, status) => {
    try {
      await api.patch(`/worker/update-status/${issueId}`, {
        status,
      });

      await fetchAssignedIssues();
    } catch (error) {
      console.error(error);
      alert("Failed to update status.");
    }
  };

  const resolveIssue = async (issueId) => {
    const resolutionNote = prompt(
      "Enter a short resolution note:"
    );

    if (!resolutionNote) return;

    try {
      await api.patch(`/worker/resolve/${issueId}`, {
        resolutionNote,
      });

      await fetchAssignedIssues();
    } catch (error) {
      console.error(error);
      alert("Failed to resolve issue.");
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="page-title">Assigned Issues</h1>
        <p className="page-subtitle">
          Complaints assigned to you by the municipal administration.
        </p>
      </div>

      {issues.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          No complaints assigned yet.
        </div>
      ) : (
        <div className="space-y-4">
          {issues.map((issue) => (
            <div key={issue._id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} className="shrink-0 text-slate-400" />
                    <h2 className="text-base font-semibold text-slate-900">
                      {issue.title}
                    </h2>
                  </div>
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

              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                {issue.location && (
                  <span className="flex items-center gap-2">
                    <MapPin size={14} className="text-slate-400" />
                    {issue.location.latitude.toFixed(4)}, {issue.location.longitude.toFixed(4)}
                  </span>
                )}

                <span className="flex items-center gap-2">
                  <Calendar size={14} className="text-slate-400" />
                  {formatDate(issue.createdAt)}
                </span>
              </div>

              {issue.imageUrl && (
                <img
                  src={issue.imageUrl}
                  alt={issue.title}
                  className="mt-4 w-full rounded-lg border border-border object-cover"
                />
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
    </DashboardLayout>
  );
}

export default WorkerIssues;
