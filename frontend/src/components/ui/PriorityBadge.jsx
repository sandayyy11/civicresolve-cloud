function PriorityBadge({ priority }) {
  let styles = "badge-neutral";

  if (priority === "High") {
    styles = "badge-high";
  } else if (priority === "Medium") {
    styles = "badge-medium";
  } else if (priority === "Low") {
    styles = "badge-low";
  }

  return (
    <span className={styles}>
      {priority || "N/A"}
    </span>
  );
}

export default PriorityBadge;