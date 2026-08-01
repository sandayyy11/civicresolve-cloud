import { FaBell, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user } = useAuth();

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
  }

  return (
    <header className="bg-white shadow-sm px-8 py-5 flex justify-between items-center">

      <div>
        <h2 className="text-2xl font-bold">
          {greeting}, {user?.name} 👋
        </h2>

        <p className="text-gray-500">
          Welcome back to CivicResolve
        </p>
      </div>

      <div className="flex items-center gap-6">

        <button className="relative text-2xl text-gray-600 hover:text-blue-600 transition">
  <FaBell />

  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
    3
  </span>
</button>

        <div className="flex items-center gap-3">
          <FaUserCircle
            size={36}
            className="text-blue-600"
          />

          <div>
            <p className="font-semibold">
              {user?.name}
            </p>

            <p className="text-sm text-gray-500 capitalize">
              {user?.role}
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}

export default Navbar;