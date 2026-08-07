import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../services/api";
import {
  FaClipboardList,
  FaClock,
  FaSpinner,
  FaCheckCircle,
  FaStar,
} from "react-icons/fa";

function WorkerDashboard() {
  const [issues, setIssues] = useState([]);

  const fetchAssignedIssues = async () => {
    try {
      const response = await api.get("/issues/assigned");
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
    await api.patch(`/issues/${issueId}/status`, {
      status,
    });

    // Refresh the dashboard automatically
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

    await api.patch(`/issues/${issueId}/resolve`, {
      resolutionNote,
    });

    await fetchAssignedIssues();

  } catch (error) {

    console.error(error);

    alert("Failed to resolve issue.");

  }
};

  const pending = issues.filter(
    (issue) => issue.status === "Pending"
  ).length;

  const inProgress = issues.filter(
    (issue) => issue.status === "In Progress"
  ).length;

  const resolved = issues.filter(
    (issue) => issue.status === "Resolved"
  ).length;

  const feedbackItems = issues.filter((issue) => issue.feedback?.rating);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome Back 👷
          </h1>

          <p className="text-gray-500 mt-2 text-lg">
            Manage your assigned civic complaints efficiently.
          </p>
        </div>

        {/* Statistics */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          {/* Assigned */}

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg p-6">

            <div className="flex justify-between items-center">
              <p className="text-sm opacity-90">
                Assigned Issues
              </p>

              <FaClipboardList size={28} />
            </div>

            <h2 className="text-5xl font-bold mt-5">
              {issues.length}
            </h2>

          </div>

          {/* Pending */}

          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl shadow-lg p-6">

            <div className="flex justify-between items-center">
              <p className="text-sm">
                Pending
              </p>

              <FaClock size={28} />
            </div>

            <h2 className="text-5xl font-bold mt-5">
              {pending}
            </h2>

          </div>

          {/* In Progress */}

          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl shadow-lg p-6">

            <div className="flex justify-between items-center">
              <p className="text-sm">
                In Progress
              </p>

              <FaSpinner size={28} />
            </div>

            <h2 className="text-5xl font-bold mt-5">
              {inProgress}
            </h2>

          </div>

          {/* Resolved */}

          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-lg p-6">

            <div className="flex justify-between items-center">
              <p className="text-sm">
                Resolved
              </p>

              <FaCheckCircle size={28} />
            </div>

            <h2 className="text-5xl font-bold mt-5">
              {resolved}
            </h2>

          </div>

        </div>

        {/* Recent Citizen Feedback */}

        <div className="bg-white rounded-3xl shadow-lg p-8 mb-10">

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Recent Citizen Feedback
            </h2>

            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              {feedbackItems.length} feedback items
            </span>
          </div>

          {feedbackItems.length === 0 ? (
            <div className="text-center py-10">
              <FaStar className="mx-auto text-gray-300" size={50} />
              <p className="mt-4 text-lg text-gray-500">
                No feedback yet for your assigned complaints.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedbackItems.slice(0, 5).map((issue) => (
                <div
                  key={issue._id}
                  className="border border-gray-200 rounded-2xl p-5 bg-gray-50"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {issue.title}
                    </h3>

                    <span className="text-amber-500 font-semibold">
                      {"★".repeat(issue.feedback.rating)}
                      {"☆".repeat(5 - issue.feedback.rating)}
                    </span>
                  </div>

                  <p className="mt-3 text-gray-600">
                    {issue.feedback.comment || "No additional comment provided."}
                  </p>

                  <p className="mt-3 text-sm text-gray-500">
                    Resolution date: {new Date(issue.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Recent Complaints */}

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Recent Assigned Complaints
          </h2>

          {issues.length === 0 ? (

            <div className="text-center py-16">

              <FaClipboardList
                className="mx-auto text-gray-300"
                size={70}
              />

              <p className="mt-5 text-lg text-gray-500">
                No complaints assigned yet.
              </p>

            </div>

          ) : (

            <div className="space-y-6">

              {issues.slice(0, 5).map((issue) => (

                <div
                  key={issue._id}
                  className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition duration-300"
                >

                  <h3 className="text-xl font-bold text-gray-800">
                    {issue.title}
                  </h3>

                  <p className="text-gray-600 mt-3 leading-relaxed">
                    {issue.summary}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-5">

                    {/* Category */}

                    <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium">
                      {issue.category}
                    </span>

                    {/* Status */}

                    <span
                      className={`px-4 py-1 rounded-full text-sm font-medium ${
                        issue.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : issue.status === "In Progress"
                          ? "bg-cyan-100 text-cyan-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {issue.status}
                    </span>

                    {/* Priority */}

                    <span
                      className={`px-4 py-1 rounded-full text-sm font-medium ${
                        issue.priority === "High"
                          ? "bg-red-100 text-red-700"
                          : issue.priority === "Medium"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {issue.priority}
                    </span>

                  </div>

                  {issue.imageUrl && (

                    <img
                      src={issue.imageUrl}
                      alt={issue.title}
                      className="mt-6 w-full h-56 object-cover rounded-2xl shadow"
                    />

                  )}

                  <div className="flex gap-4 mt-6">

  {issue.status === "Pending" && (
    <button
      onClick={() =>
        updateStatus(issue._id, "In Progress")
      }
      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition"
    >
      ▶️ Start Work
    </button>
  )}

  {issue.status === "In Progress" && (
    <button
      onClick={() => resolveIssue(issue._id)}
      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl transition"
    >
      ✅ Mark Resolved
    </button>
  )}

</div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>
    </DashboardLayout>
  );
}

export default WorkerDashboard;