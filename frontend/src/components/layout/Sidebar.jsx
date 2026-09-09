import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  User,
  LogOut,
  Users,
  Briefcase,
  BarChart3,
  MapPin,
  Shield,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar({ isMobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const role = user?.role;

  const sections = [];

  if (role === "citizen") {
    sections.push(
      {
        label: "Overview",
        links: [
          { name: "Dashboard", icon: <LayoutDashboard size={17} />, path: "/citizen/dashboard" },
        ],
      },
      {
        label: "Complaints",
        links: [
          { name: "Report Issue", icon: <PlusCircle size={17} />, path: "/report" },
          { name: "My Issues", icon: <ClipboardList size={17} />, path: "/citizen/issues" },
          { name: "Complaint Map", icon: <MapPin size={17} />, path: "/citizen/map" },
        ],
      }
    );
  } else if (role === "worker") {
    sections.push(
      {
        label: "Overview",
        links: [
          { name: "Dashboard", icon: <LayoutDashboard size={17} />, path: "/worker/dashboard" },
        ],
      },
      {
        label: "Complaints",
        links: [
          { name: "Assigned Issues", icon: <Briefcase size={17} />, path: "/worker/issues" },
        ],
      }
    );
  } else if (role === "admin") {
    sections.push(
      {
        label: "Overview",
        links: [
          { name: "Dashboard", icon: <LayoutDashboard size={17} />, path: "/admin/dashboard" },
        ],
      },
      {
        label: "Complaints",
        links: [
          { name: "All Issues", icon: <ClipboardList size={17} />, path: "/admin/issues" },
        ],
      },
      {
        label: "Management",
        links: [
          { name: "Users", icon: <Users size={17} />, path: "/admin/users" },
          { name: "Create Worker", icon: <PlusCircle size={17} />, path: "/admin/create-worker" },
        ],
      },
      {
        label: "Insights",
        links: [
          { name: "Analytics", icon: <BarChart3 size={17} />, path: "/admin/analytics" },
        ],
      }
    );
  }

  // Lower navigation
  const lowerLinks = [];
  if (role === "citizen") {
    lowerLinks.push({ name: "Profile", icon: <User size={17} />, path: "/citizen/profile" });
  } else if (role === "worker") {
    lowerLinks.push({ name: "Profile", icon: <User size={17} />, path: "/worker/profile" });
  }

  const sidebarContent = (
    <div className="flex h-full flex-col bg-navy-900">
      {/* Brand */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 shadow-lg shadow-primary-600/25">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-white">CivicResolve</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Stronger Communities, Together
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCloseMobile}
          className="rounded-md p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {sections.map((section) => (
          <div key={section.label} className="mb-6">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              {section.label}
            </p>

            <div className="space-y-1">
              {section.links.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                      isActive
                        ? "bg-primary-600 font-medium text-white shadow-md shadow-primary-600/30"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  {link.icon}
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
        ))}

        {lowerLinks.length > 0 && (
          <div className="mb-6">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              Account
            </p>

            <div className="space-y-1">
              {lowerLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                      isActive
                        ? "bg-primary-600 font-medium text-white shadow-md shadow-primary-600/30"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  {link.icon}
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Logout */}
      <div className="border-t border-white/10 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-red-500/15 hover:text-red-300"
        >
          <LogOut size={17} className="text-slate-400" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-navy-900 lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-64 bg-navy-900 shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

export default Sidebar;