import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import IssueCard from "../../components/ui/IssueCard";
import api from "../../services/api";

function MyIssues() {
  const [issues, setIssues] = useState([]);
  const [feedbackDrafts, setFeedbackDrafts] = useState({});
  const [submittingId, setSubmittingId] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");

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

  const updateFeedbackDraft = (issueId, field, value) => {
    setFeedbackDrafts((prev) => ({
      ...prev,
      [issueId]: {
        ...(prev[issueId] || {}),
        [field]: value,
      },
    }));
  };

  const submitFeedback = async (issueId) => {
    const draft = feedbackDrafts[issueId] || {};

    if (!draft.rating) {
      setFeedbackMessage("Please select a star rating before submitting feedback.");
      return;
    }

    try {
      setSubmittingId(issueId);
      setFeedbackMessage("");

      await api.patch(`/issues/${issueId}/feedback`, {
        rating: Number(draft.rating),
        comment: draft.comment || "",
      });

      setFeedbackDrafts((prev) => ({
        ...prev,
        [issueId]: { rating: "", comment: "" },
      }));

      await fetchIssues();
      setFeedbackMessage("Thank you for your feedback!");
    } catch (error) {
      console.error(error);
      setFeedbackMessage("Failed to submit feedback. Please try again.");
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="page-title">My Issues</h1>
          <p className="page-subtitle">
            Review your complaints and share feedback for resolved cases.
          </p>
        </div>
      </div>

      {feedbackMessage && (
        <div className="mb-5 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {feedbackMessage}
        </div>
      )}

      <div className="space-y-4">
        {issues.map((issue) => {
          const hasFeedback = Boolean(issue.feedback?.rating);
          const isResolved = issue.status === "Resolved";
          const draft = feedbackDrafts[issue._id] || {};

          return (
            <div key={issue._id} className="space-y-4">
              <IssueCard issue={issue} />

              <div className="card border-slate-200 bg-slate-50 p-5">
                {isResolved ? (
                  hasFeedback ? (
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-800">Your Feedback</h3>
                        <span className="text-amber-500">
                          {"★".repeat(issue.feedback.rating)}
                          {"☆".repeat(5 - issue.feedback.rating)}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-slate-600">
                        {issue.feedback.comment || "No comment provided."}
                      </p>
                      <p className="mt-3 text-xs text-slate-400">
                        Submitted {new Date(issue.feedback.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-semibold text-slate-800">Share your experience</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Rate the resolution and add an optional comment.
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => updateFeedbackDraft(issue._id, "rating", star)}
                            className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                              draft.rating === star
                                ? "border-amber-400 bg-amber-100 text-amber-700"
                                : "border-slate-300 bg-white text-slate-600 hover:border-amber-300 hover:text-amber-600"
                            }`}
                          >
                            {"★".repeat(star)}
                          </button>
                        ))}
                      </div>

                      <textarea
                        value={draft.comment || ""}
                        onChange={(e) => updateFeedbackDraft(issue._id, "comment", e.target.value)}
                        placeholder="Leave an optional comment"
                        rows={4}
                        className="textarea mt-4"
                      />

                      <div className="mt-4 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => submitFeedback(issue._id)}
                          disabled={submittingId === issue._id}
                          className="btn-success"
                        >
                          {submittingId === issue._id ? "Submitting..." : "Submit Feedback"}
                        </button>
                        <span className="text-sm text-slate-500">
                          {draft.rating ? `${draft.rating} star${draft.rating > 1 ? "s" : ""}` : "1–5 stars"}
                        </span>
                      </div>
                    </div>
                  )
                ) : (
                  <p className="text-sm text-slate-500">
                    Feedback will be available once this issue is marked as resolved.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}

export default MyIssues;