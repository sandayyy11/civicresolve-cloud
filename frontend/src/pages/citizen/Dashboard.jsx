import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/ui/StatCard";
import IssueCard from "../../components/ui/IssueCard";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

import {
  FaClipboardList,
  FaClock,
  FaSpinner,
  FaCheckCircle,
} from "react-icons/fa";

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

  const pending = issues.filter(
    (issue) => issue.status === "Pending"
  ).length;

  const progress = issues.filter(
    (issue) => issue.status === "In Progress"
  ).length;

  const resolved = issues.filter(
    (issue) => issue.status === "Resolved"
  ).length;

  return (
    <DashboardLayout>
      {loading ? (
        <p className="text-center mt-10 text-lg">Loading...</p>
      ) : (
        <>
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">

  <div>
    <h2 className="text-3xl font-bold">
      Dashboard Overview
    </h2>

    <p className="text-gray-500 mt-2">
      Here's a summary of your complaints.
    </p>
  </div>

  <Link
    to="/report"
    className="mt-5 md:mt-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-md transition"
  >
    <FaPlus />
    Report New Issue
  </Link>

</div>

          {/* Statistics Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <StatCard
              title="Total Issues"
              value={issues.length}
              icon={<FaClipboardList />}
              color="blue"
            />

            <StatCard
              title="Pending"
              value={pending}
              icon={<FaClock />}
              color="yellow"
            />

            <StatCard
              title="In Progress"
              value={progress}
              icon={<FaSpinner />}
              color="blue"
            />

            <StatCard
              title="Resolved"
              value={resolved}
              icon={<FaCheckCircle />}
              color="green"
            />
          </div>

          {/* Recent Issues */}
          <h2 className="text-2xl font-bold mt-10 mb-5">
            Recent Issues
          </h2>

          <div className="space-y-5">
            {issues.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-8 text-center text-gray-500">
                No issues reported yet.
              </div>
            ) : (
              issues.map((issue) => (
                <IssueCard
    key={issue._id}
    issue={issue}
  />
              ))
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default Dashboard;