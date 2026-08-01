import React from "react";

const colorStyles = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-600",
  },
  yellow: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-600",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-600",
  },
  red: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-600",
  },
};

function StatCard({ title, value, icon, color = "blue" }) {
  const styles = colorStyles[color];

  return (
    <div
      className={`${styles.bg} ${styles.border} border rounded-2xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition duration-300`}
    >
      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-500 font-medium">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-3">
            {value}
          </h2>

        </div>

        <div className={`${styles.text} text-5xl`}>
          {icon}
        </div>

      </div>
    </div>
  );
}

export default StatCard;