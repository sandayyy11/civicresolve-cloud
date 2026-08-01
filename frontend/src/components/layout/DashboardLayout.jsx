import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout({ children }) {
  return (
    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="ml-64 flex-1">

        <Navbar />

        <main className="p-8">
          {children}
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;