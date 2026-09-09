function StatusBadge({ status }) {
  let styles = "badge-neutral";

  if (status === "Pending") {
    styles = "badge-pending";
  } else if (status === "In Progress") {
    styles = "badge-progress";
  } else if (status === "Resolved") {
    styles = "badge-resolved";
  }

  return (
    <span className={styles}>
      {status}
    </span>
  );
}

export default StatusBadge;