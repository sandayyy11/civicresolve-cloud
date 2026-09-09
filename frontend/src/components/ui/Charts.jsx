// Lightweight SVG chart components - no external chart library needed

export function DonutChart({ data, size = 180, thickness = 22 }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  if (total === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <p className="text-sm text-slate-400">No data</p>
      </div>
    );
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={thickness}
        />
        {data.map((item, index) => {
          const fraction = item.value / total;
          const dash = fraction * circumference;
          const element = (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={thickness}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += dash;
          return element;
        })}
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-slate-900">{total}</span>
        <span className="text-xs text-slate-500">Total</span>
      </div>
    </div>
  );
}

export function DonutLegend({ data }) {
  return (
    <div className="space-y-2.5">
      {data.map((item, index) => (
        <div key={index} className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-slate-600">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </span>
          <span className="font-medium text-slate-900">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export function BarChart({ data, color = "#2563eb", height = 200 }) {
  const max = Math.max(1, ...data.map((item) => item.value));

  return (
    <div className="flex items-end gap-3" style={{ height }}>
      {data.map((item, index) => (
        <div key={index} className="flex flex-1 flex-col items-center gap-2">
          <span className="text-sm font-semibold text-slate-700">{item.value}</span>
          <div
            className="w-full rounded-t-md transition-all"
            style={{
              height: `${Math.max(4, (item.value / max) * (height - 50))}px`,
              backgroundColor: item.color || color,
              opacity: item.value === 0 ? 0.2 : 1,
            }}
          />
          <span className="text-xs text-slate-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function ProgressBar({ label, value, color, max }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">{value}</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${pct}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

export function CategoryIcon({ category, className = "h-4 w-4" }) {
  const icons = {
    Road: "🛣️",
    Garbage: "🗑️",
    Water: "💧",
    Electricity: "⚡",
    Other: "📋",
  };
  return <span className={className}>{icons[category] || icons.Other}</span>;
}