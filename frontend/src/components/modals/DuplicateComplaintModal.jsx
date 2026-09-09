import { FaHeart, FaExclamationTriangle, FaMapMarkerAlt } from "react-icons/fa";

function formatDistance(meters) {
  if (!meters && meters !== 0) return "";

  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }

  return `${(meters / 1000).toFixed(1)}km`;
}

function DuplicateComplaintModal({
  isOpen,
  duplicates,
  onClose,
  onSupport,
  onReportAnyway,
}) {
  if (!isOpen) return null;

  const hasHighConfidence = duplicates.some(
    (d) => d.confidence === "high"
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
      <div className="w-full max-w-xl rounded-lg bg-white shadow-xl">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-600">
              <FaExclamationTriangle size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Possible Duplicate Complaint
              </h2>
              <p className="mt-0.5 text-sm text-gray-500">
                {hasHighConfidence
                  ? "We found a very similar complaint near your location."
                  : "We found a similar complaint near your location. You can still report yours if it is a different issue."}
              </p>
            </div>
          </div>
        </div>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto px-6 py-5">
          {duplicates.map((issue) => (
            <div
              key={issue._id}
              className="rounded-md border border-gray-200 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900">
                  {issue.title}
                </h3>

                {issue.confidence === "high" ? (
                  <span className="badge-pending shrink-0">
                    High match
                  </span>
                ) : (
                  <span className="badge-neutral shrink-0">
                    Possible match
                  </span>
                )}
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                <span className="badge-neutral">{issue.category}</span>
                <span className="badge-pending">{issue.status}</span>

                {issue.distanceMeters !== undefined && (
                  <span className="badge-neutral flex items-center gap-1">
                    <FaMapMarkerAlt size={12} />
                    {formatDistance(issue.distanceMeters)} away
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm text-gray-600">
                {issue.summary}
              </p>

              <div className="mt-3 flex gap-5 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <FaHeart className="text-red-500" size={14} />
                  {issue.supportCount} supporters
                </span>
              </div>

              {issue.imageUrl && (
                <img
                  src={issue.imageUrl}
                  alt={issue.title}
                  className="mt-3 w-full rounded-md border border-gray-200 object-cover"
                />
              )}

              <button
                onClick={() => onSupport(issue._id)}
                className="btn-primary mt-4 w-full"
              >
                <FaHeart />
                Support Existing Complaint
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 px-6 py-4">
          <button
            onClick={onReportAnyway}
            className="btn-primary w-full"
          >
            Report Anyway
          </button>

          <button
            onClick={onClose}
            className="btn-secondary mt-2 w-full"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DuplicateComplaintModal;