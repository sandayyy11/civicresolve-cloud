import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";

function IssueCard({ issue,
  rating,
  setRating,
  comment,
  setComment,
  submitFeedback, }) {
  const selectedRating = rating?.[issue?._id] ?? "";
  const selectedComment = comment?.[issue?._id] ?? "";

  const handleRatingChange = (e) => {
    if (!setRating) return;

    setRating({
      ...(rating || {}),
      [issue._id]: Number(e.target.value),
    });
  };

  const handleCommentChange = (e) => {
    if (!setComment) return;

    setComment({
      ...(comment || {}),
      [issue._id]: e.target.value,
    });
  };

  const handleSubmitFeedback = () => {
    if (submitFeedback && issue?._id) {
      submitFeedback(issue._id);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6">

      <div className="flex justify-between items-start">

        <div>
          <h3 className="text-xl font-bold">
            {issue.title}
          </h3>

          <p className="text-gray-600 mt-2">
            {issue.description}
          </p>
          {issue.imageUrl && (
  <img
    src={issue.imageUrl}
    alt={issue.title}
    className="mt-4 w-full h-52 object-cover rounded-xl"
  />
)}
        </div>

        <PriorityBadge priority={issue.priority} />
      </div>

      <div className="flex flex-wrap gap-3 mt-5">

        <StatusBadge status={issue.status} />

        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
          {issue.category}
        </span>

      </div>

      <div className="flex flex-wrap gap-6 mt-5 text-gray-500 text-sm">
        {issue.status === "Resolved" && (
  <div className="mt-6 border-t pt-5">

    <h4 className="font-semibold text-gray-800 mb-2">
      Resolution Note
    </h4>

    <p className="text-gray-600 bg-green-50 border border-green-200 rounded-xl p-3">
      {issue.resolutionNote || "No resolution note provided."}
    </p>

    {!issue.feedback?.rating && (
      <>
        {setRating && setComment && submitFeedback && (
          <>
            <h4 className="font-semibold mt-5 mb-2">
              Rate the Service
            </h4>

            <select
              className="w-full border rounded-xl p-3"
              value={selectedRating}
              onChange={handleRatingChange}
            >
          <option value="">Select Rating</option>
          <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
          <option value="4">⭐⭐⭐⭐ Good</option>
          <option value="3">⭐⭐⭐ Average</option>
          <option value="2">⭐⭐ Poor</option>
          <option value="1">⭐ Very Poor</option>
        </select>

            <textarea
              placeholder="Write your feedback..."
              className="w-full border rounded-xl p-3 mt-4"
              rows={4}
              value={selectedComment}
              onChange={handleCommentChange}
            />

            <button
              onClick={handleSubmitFeedback}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
            >
              Submit Feedback
            </button>
          </>
        )}
      </>
    )}

    {issue.feedback?.rating && (
      <div className="mt-5 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="font-semibold">
          Your Rating: ⭐ {issue.feedback.rating}/5
        </p>

        {issue.feedback.comment && (
          <p className="mt-2 text-gray-600">
            "{issue.feedback.comment}"
          </p>
        )}
      </div>
    )}

  </div>
)}

        {issue.location && (
          <span className="flex items-center gap-2">
            <FaMapMarkerAlt />
            {issue.location.latitude}, {issue.location.longitude}
          </span>
        )}

        <span className="flex items-center gap-2">
          <FaCalendarAlt />
          {new Date(issue.createdAt).toLocaleDateString()}
        </span>

      </div>
    </div>
  );
}

export default IssueCard;