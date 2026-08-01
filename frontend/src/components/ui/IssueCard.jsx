import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";

function IssueCard({ issue }) {
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