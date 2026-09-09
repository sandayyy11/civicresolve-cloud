import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";

function IssueCard({ issue, rating, setRating, comment, setComment, submitFeedback }) {
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
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-slate-900">
            {issue.title}
          </h3>

          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
            {issue.description}
          </p>

          {issue.imageUrl && (
            <div className="relative mt-4 w-full aspect-video overflow-hidden rounded-xl border border-border">
              <img
                src={issue.imageUrl}
                alt={issue.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          )}
        </div>

        <PriorityBadge priority={issue.priority} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <StatusBadge status={issue.status} />
        <span className="badge-neutral">{issue.category}</span>
      </div>

      {(issue.priorityReason || issue.locationContext?.nearbyPlaces?.length) && (
        <div className="mt-4 rounded-lg border border-primary-100 bg-primary-50 p-3 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Why this priority?</p>
          {issue.priorityReason && <p className="mt-1">{issue.priorityReason}</p>}
          {issue.locationContext?.nearbyPlaces?.length > 0 && (
            <ul className="mt-2 list-inside list-disc text-slate-600">
              {issue.locationContext.nearbyPlaces.slice(0, 3).map((place) => (
                <li key={`${place.type}-${place.name}-${place.distanceMeters}`}>
                  {place.name} — {place.distanceMeters < 1000 ? `${place.distanceMeters}m` : `${(place.distanceMeters / 1000).toFixed(1)}km`}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
        {issue.location && (
          <span className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-slate-400" size={14} />
            {issue.location.latitude}, {issue.location.longitude}
          </span>
        )}

        <span className="flex items-center gap-2">
          <FaCalendarAlt className="text-slate-400" size={14} />
          {new Date(issue.createdAt).toLocaleDateString()}
        </span>
      </div>

      {issue.status === "Resolved" && (
        <div className="mt-5 border-t border-slate-100 pt-5">
          <h4 className="text-sm font-semibold text-slate-800">
            Resolution Note
          </h4>

          <p className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-slate-700">
            {issue.resolutionNote || "No resolution note provided."}
          </p>

          {!issue.feedback?.rating && setRating && setComment && submitFeedback && (
            <>
              <h4 className="mt-5 text-sm font-semibold text-slate-800">
                Rate the Service
              </h4>

              <select
                className="input mt-2"
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
                className="textarea mt-3"
                rows={4}
                value={selectedComment}
                onChange={handleCommentChange}
              />

              <button onClick={handleSubmitFeedback} className="btn-success mt-4">
                Submit Feedback
              </button>
            </>
          )}

          {issue.feedback?.rating && (
            <div className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
              <p className="text-sm font-semibold text-slate-800">
                Your Rating: ⭐ {issue.feedback.rating}/5
              </p>

              {issue.feedback.comment && (
                <p className="mt-2 text-sm text-slate-600">
                  "{issue.feedback.comment}"
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default IssueCard;
