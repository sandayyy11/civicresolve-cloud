import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/ui/StatCard";
import IssueCard from "../../components/ui/IssueCard";
import { Link } from "react-router-dom";
import { FaPlus, FaClipboardList, FaClock, FaSpinner, FaCheckCircle } from "react-icons/fa";

function Dashboard() {
  const { user } = useAuth();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyIssues();
  }, []);

  const fetchMyIssues = async () => {
    try {
      const response = await api.get("/issues/my");
      setIssues(response.data.issues);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const pending = issues.filter((issue) => issue.status === "Pending").length;
  const progress = issues.filter((issue) => issue.status === "In Progress").length;
  const resolved = issues.filter((issue) => issue.status === "Resolved").length;

  return (
    <DashboardLayout>
      {loading ? (
        <p className="text-center mt-10 text-lg">Loading...</p>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="page-title">Welcome back, {user?.name || "Citizen"}!</h1>
              <p className="page-subtitle">
                Here's what's happening with your complaints.
              </p>
            </div>

            <Link to="/report" className="btn-primary mt-4 md:mt-0 shadow-md shadow-primary-600/25">
              <FaPlus size={14} />
              Report an Issue
            </Link>
          </div>

          {/* KPI cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <StatCard
              title="My Complaints"
              value={issues.length}
              icon={<FaClipboardList />}
              color="blue"
              supportingText="Total reported issues"
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
              value={progress}
              icon={<FaSpinner />}
              color="indigo"
              supportingText="Being addressed"
            />
            <StatCard
              title="Resolved"
              value={resolved}
              icon={<FaCheckCircle />}
              color="green"
              supportingText="Successfully closed"
            />
          </div>

          {/* Recent Issues */}
          <h2 className="mt-8 mb-4 text-base font-semibold text-slate-900">
            Recent Complaints
          </h2>

          <div className="space-y-4">
            {issues.length === 0 ? (
              <div className="card p-8 text-center text-slate-500">
                No issues reported yet.
              </div>
            ) : (
              issues.map((issue) => (
                <IssueCard key={issue._id} issue={issue} />
              ))
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default Dashboard;