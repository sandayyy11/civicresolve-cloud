import { Building2, Menu } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Building2 className="text-blue-600" size={30} />
          <h1 className="text-2xl font-bold text-gray-900">
            CivicResolve
          </h1>
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <li className="hover:text-blue-600 cursor-pointer transition">
            Home
          </li>
          <li className="hover:text-blue-600 cursor-pointer transition">
            About
          </li>
          <li className="hover:text-blue-600 cursor-pointer transition">
            Contact
          </li>
        </ul>

        {/* Login Button */}
        <Link
  to="/login"
  className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
>
  Login
</Link>

        {/* Mobile Menu Icon */}
        <button className="md:hidden">
          <Menu size={28} />
        </button>

      </div>
    </nav>
  );
}

export default Navbar;