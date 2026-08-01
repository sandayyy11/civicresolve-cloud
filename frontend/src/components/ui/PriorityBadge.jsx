function PriorityBadge({ priority }) {
  let styles = "bg-gray-100 text-gray-700";

  if (priority === "High") {
    styles = "bg-red-100 text-red-700";
  } else if (priority === "Medium") {
    styles = "bg-yellow-100 text-yellow-700";
  } else if (priority === "Low") {
    styles = "bg-green-100 text-green-700";
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${styles}`}
    >
      {priority || "N/A"}
    </span>
  );
}

export default PriorityBadge;