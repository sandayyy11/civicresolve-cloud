import { useState } from "react";
import { Shield, Menu, X, ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function LandingNavbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Features", href: "/#features" },
    { name: "About", href: "/#about" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 shadow-md">
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-navy-900">CivicResolve</h1>
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">Municipal Services</p>
          </div>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  location.pathname + location.hash === link.href ||
                  (link.href === "/" && location.pathname === "/")
                    ? "text-primary-600"
                    : "text-slate-600 hover:text-navy-900"
                }`}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="btn-secondary text-sm">Login</Link>
          <Link to="/register" className="btn-primary text-sm shadow-lg shadow-primary-600/20">
            Report an Issue <ArrowRight size={16} />
          </Link>
        </div>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isMobileOpen && (
        <div className="border-t border-slate-100 bg-white px-6 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={() => setIsMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-navy-900">
                {link.name}
              </a>
            ))}
            <hr className="my-2 border-slate-100" />
            <Link to="/login" onClick={() => setIsMobileOpen(false)} className="btn-secondary w-full justify-center">Login</Link>
            <Link to="/register" onClick={() => setIsMobileOpen(false)} className="btn-primary w-full justify-center">Report an Issue</Link>
          </div>
        </div>
      )}
    </nav>
  );
}