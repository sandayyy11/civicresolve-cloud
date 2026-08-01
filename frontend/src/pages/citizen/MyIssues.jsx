import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import IssueCard from "../../components/ui/IssueCard";
import api from "../../services/api";

function MyIssues() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await api.get("/issues/my");
      setIssues(response.data.issues);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">
        My Issues
      </h1>

      <div className="space-y-5">
        {issues.map((issue) => (
          <IssueCard
            key={issue._id}
            issue={issue}
          />
        ))}
      </div>
    </DashboardLayout>
  );
}

export default MyIssues;