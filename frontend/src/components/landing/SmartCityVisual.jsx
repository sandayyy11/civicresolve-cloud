import { Shield, MapPin, Zap, Droplets, Trash2 } from "lucide-react";

export default function SmartCityVisual({ className = "", simplified = false }) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Subtle grid background */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.06]" viewBox="0 0 400 400" preserveAspectRatio="none">
        <defs>
          <pattern id="city-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#city-grid)" />
      </svg>

      {/* Connection lines */}
      <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
        <line x1="80" y1="80" x2="200" y2="140" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4 3" />
        <line x1="200" y1="140" x2="320" y2="200" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4 3" />
        <line x1="80" y1="80" x2="320" y2="80" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4 3" />
        <line x1="320" y1="200" x2="320" y2="300" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4 3" />
        <line x1="80" y1="200" x2="200" y2="280" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3 4" />
        {!simplified && (
          <>
            <line x1="200" y1="140" x2="200" y2="280" stroke="#60a5fa" strokeWidth="0.8" strokeDasharray="3 5" />
            <line x1="80" y1="80" x2="80" y2="200" stroke="#60a5fa" strokeWidth="0.8" strokeDasharray="3 5" />
            <line x1="200" y1="280" x2="320" y2="300" stroke="#60a5fa" strokeWidth="0.8" strokeDasharray="3 5" />
          </>
        )}
      </svg>

      {/* City blocks at bottom */}
      {!simplified && (
        <svg className="absolute bottom-4 left-4 right-4 h-20 opacity-[0.07]" viewBox="0 0 360 80">
          <rect x="10" y="30" width="20" height="50" rx="2" fill="currentColor" />
          <rect x="35" y="15" width="20" height="65" rx="2" fill="currentColor" />
          <rect x="60" y="40" width="15" height="40" rx="2" fill="currentColor" />
          <rect x="90" y="20" width="25" height="60" rx="2" fill="currentColor" />
          <rect x="130" y="10" width="20" height="70" rx="2" fill="currentColor" />
          <rect x="155" y="35" width="18" height="45" rx="2" fill="currentColor" />
          <rect x="190" y="25" width="22" height="55" rx="2" fill="currentColor" />
          <rect x="220" y="5" width="20" height="75" rx="2" fill="currentColor" />
          <rect x="250" y="30" width="15" height="50" rx="2" fill="currentColor" />
          <rect x="275" y="20" width="20" height="60" rx="2" fill="currentColor" />
          <rect x="310" y="10" width="22" height="70" rx="2" fill="currentColor" />
          <rect x="340" y="40" width="15" height="40" rx="2" fill="currentColor" />
        </svg>
      )}

      {/* Location pins */}
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="absolute" style={{ top: simplified ? "45%" : "25%", left: simplified ? "50%" : "22%" }}>
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 shadow-lg shadow-primary-600/40 animate-pulse">
              <MapPin size={14} className="text-white" />
            </div>
            {!simplified && <span className="whitespace-nowrap text-[10px] font-medium text-slate-400">Road Issue</span>}
            {!simplified && <span className="text-[9px] font-medium text-emerald-400">● Active</span>}
          </div>
        </div>

        {!simplified && (
          <>
            <div className="absolute" style={{ top: "48%", right: "18%" }}>
              <div className="flex flex-col items-center gap-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/30">
                  <Droplets size={12} className="text-white" />
                </div>
                <span className="text-[10px] font-medium text-slate-400">Water</span>
                <span className="text-[9px] font-medium text-amber-400">● Reported</span>
              </div>
            </div>

            <div className="absolute" style={{ top: "65%", left: "35%" }}>
              <div className="flex flex-col items-center gap-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 shadow-lg shadow-amber-500/30">
                  <Trash2 size={12} className="text-white" />
                </div>
                <span className="text-[10px] font-medium text-slate-400">Garbage</span>
                <span className="text-[9px] font-medium text-primary-400">● In Progress</span>
              </div>
            </div>

            <div className="absolute" style={{ top: "38%", right: "28%" }}>
              <div className="flex flex-col items-center gap-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/30">
                  <Zap size={12} className="text-white" />
                </div>
                <span className="text-[10px] font-medium text-slate-400">Electricity</span>
                <span className="text-[9px] font-medium text-emerald-400">● Resolved</span>
              </div>
            </div>

            <div className="absolute h-2 w-2 rounded-full bg-primary-400/40" style={{ top: "52%", left: "50%" }} />
            <div className="absolute h-2 w-2 rounded-full bg-primary-400/30" style={{ top: "30%", left: "68%" }} />
          </>
        )}

        {simplified && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary-500/30 bg-primary-600/20 backdrop-blur-sm">
              <Shield size={32} className="text-primary-400" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-white/70">City Monitor</span>
          </div>
        )}
      </div>
    </div>
  );
}