import React from "react";

const colorStyles = {
  blue: {
    icon: "text-primary-600",
    iconBg: "bg-primary-50",
    accent: "bg-primary-600",
  },
  yellow: {
    icon: "text-amber-500",
    iconBg: "bg-amber-50",
    accent: "bg-amber-500",
  },
  green: {
    icon: "text-emerald-500",
    iconBg: "bg-emerald-50",
    accent: "bg-emerald-500",
  },
  red: {
    icon: "text-red-500",
    iconBg: "bg-red-50",
    accent: "bg-red-500",
  },
  indigo: {
    icon: "text-indigo-500",
    iconBg: "bg-indigo-50",
    accent: "bg-indigo-500",
  },
};

function StatCard({ title, value, icon, color = "blue", supportingText }) {
  const styles = colorStyles[color] || colorStyles.blue;

  return (
    <div className="card relative overflow-hidden p-5">
      <div className={`absolute inset-x-0 top-0 h-0.5 ${styles.accent}`} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          {supportingText && (
            <p className="mt-1 text-xs text-slate-400">{supportingText}</p>
          )}
        </div>

        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${styles.iconBg}`}>
          <span className={`text-lg ${styles.icon}`}>{icon}</span>
        </div>
      </div>
    </div>
  );
}

export default StatCard;