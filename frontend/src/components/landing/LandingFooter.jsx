import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingFooter() {
  return (
    <footer className="bg-navy-900 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 shadow-md">
                <Shield size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">CivicResolve</h2>
                <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">Municipal Services</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              An AI-assisted civic grievance management platform connecting citizens, AI, and municipal workers.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              {["Home", "How It Works", "Features", "About"].map((item) => (
                <li key={item}>
                  <a href={`/#${item.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm text-slate-400 transition-colors hover:text-white">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Get Started</h3>
            <ul className="mt-4 space-y-3">
              <li><Link to="/login" className="text-sm text-slate-400 transition-colors hover:text-white">Login</Link></li>
              <li><Link to="/register" className="text-sm text-slate-400 transition-colors hover:text-white">Register</Link></li>
              <li><Link to="/report" className="text-sm text-slate-400 transition-colors hover:text-white">Report an Issue</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-slate-500">
          <p>© 2026 CivicResolve. All Rights Reserved. Built with React · Node.js · MongoDB · AWS</p>
        </div>
      </div>
    </footer>
  );
}