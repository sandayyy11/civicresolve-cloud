function StatusBadge({ status }) {
  let styles = "bg-gray-100 text-gray-700";

  if (status === "Pending") {
    styles = "bg-yellow-100 text-yellow-800";
  } else if (status === "In Progress") {
    styles = "bg-blue-100 text-blue-800";
  } else if (status === "Resolved") {
    styles = "bg-green-100 text-green-800";
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${styles}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;