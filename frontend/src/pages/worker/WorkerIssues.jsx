import { useEffect, useState } from "react";
import api from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";

function WorkerIssues() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    fetchAssignedIssues();
  }, []);

  const fetchAssignedIssues = async () => {
    try {
      const response = await api.get("/issues/assigned");
      setIssues(response.data.issues);
      console.log(issues);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          My Assigned Complaints
        </h1>

        {issues.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow text-center">
            No complaints assigned yet.
          </div>
        ) : (
          <div className="space-y-6">

            {issues.map((issue) => (
              <div
                key={issue._id}
                className="bg-white rounded-2xl shadow p-6"
              >
                <h2 className="text-xl font-bold">
                  {issue.title}
                </h2>

                <p className="text-gray-600 mt-2">
                  {issue.summary}
                </p>

                <div className="flex gap-3 mt-4">

                  <span className="bg-blue-100 px-3 py-1 rounded-full">
                    {issue.category}
                  </span>

                  <span className="bg-yellow-100 px-3 py-1 rounded-full">
                    {issue.status}
                  </span>

                  <span className="bg-red-100 px-3 py-1 rounded-full">
                    {issue.priority}
                  </span>

                </div>

                {issue.imageUrl && (
                  <img
                    src={issue.imageUrl}
                    alt={issue.title}
                    className="mt-5 rounded-xl w-full max-w-md"
                  />
                )}
              </div>
            ))}

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

export default WorkerIssues;