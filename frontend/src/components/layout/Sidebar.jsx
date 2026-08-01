import {
  FaHome,
  FaClipboardList,
  FaPlusCircle,
  FaUser,
  FaSignOutAlt,
  FaUsers,
  FaTasks,
  FaChartBar,
  FaCog,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const citizenLinks = [
    { name: "Dashboard", icon: <FaHome />, path: "/citizen/dashboard" },
    { name: "Report Issue", icon: <FaPlusCircle />, path: "/report" },
    { name: "My Issues", icon: <FaClipboardList />, path: "/citizen/issues" },
    { name: "Profile", icon: <FaUser />, path: "/citizen/profile" },
    { name: "Settings", icon: <FaCog />, path: "/citizen/settings" },
  ];

  const workerLinks = [
    { name: "Dashboard", icon: <FaHome />, path: "/worker/dashboard" },
    { name: "Assigned Issues", icon: <FaTasks />, path: "/worker/issues" },
    { name: "Profile", icon: <FaUser />, path: "/worker/profile" },
    { name: "Settings", icon: <FaCog />, path: "/worker/settings" },
  ];

  const adminLinks = [
    { name: "Dashboard", icon: <FaHome />, path: "/admin/dashboard" },
    { name: "All Issues", icon: <FaClipboardList />, path: "/admin/issues" },
    { name: "Users", icon: <FaUsers />, path: "/admin/users" },
    { name: "Analytics", icon: <FaChartBar />, path: "/admin/analytics" },
    { name: "Settings", icon: <FaCog />, path: "/admin/settings" },
  ];

  let links = citizenLinks;

  if (user?.role === "worker") {
    links = workerLinks;
  } else if (user?.role === "admin") {
    links = adminLinks;
  }

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 flex flex-col">

      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-blue-600">
          CivicResolve
        </h1>
      </div>

      <nav className="flex-1 mt-6">

        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            
            className={({ isActive }) =>
             `flex items-center gap-3 px-6 py-4 transition rounded-xl mx-3 ${
              isActive
             ? "bg-blue-100 text-blue-700 font-semibold"
               : "hover:bg-blue-50 hover:text-blue-600"
      }`
}
          >
            {link.icon}
            {link.name}
          </NavLink>
        ))}

      </nav>

      <button
        onClick={handleLogout}
        className="m-6 flex items-center gap-3 text-red-500 hover:text-red-700 transition"
      >
        <FaSignOutAlt />
        Logout
      </button>

    </div>
  );
}

export default Sidebar;