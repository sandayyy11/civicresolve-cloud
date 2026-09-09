import { Building2, Menu } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-700">
            <Building2 size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-gray-900">
              CivicResolve
            </h1>
            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
              Municipal Services
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <ul className="hidden items-center gap-8 text-sm font-medium text-gray-700 md:flex">
          <li className="cursor-pointer transition hover:text-primary-600">
            Home
          </li>
          <li className="cursor-pointer transition hover:text-primary-600">
            About
          </li>
          <li className="cursor-pointer transition hover:text-primary-600">
            Contact
          </li>
        </ul>

        {/* Login Button */}
        <Link
          to="/login"
          className="btn-primary hidden md:inline-flex"
        >
          Login
        </Link>

        {/* Mobile Menu Icon */}
        <button className="rounded-md p-2 text-gray-500 hover:bg-gray-100 md:hidden">
          <Menu size={22} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;