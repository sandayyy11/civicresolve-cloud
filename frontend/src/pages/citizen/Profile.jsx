import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-2xl">

        <h1 className="text-3xl font-bold mb-8">
          My Profile
        </h1>

        <div className="space-y-6">

          <div>
            <p className="text-gray-500">Name</p>
            <h2 className="text-xl font-semibold">
              {user?.name}
            </h2>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <h2 className="text-xl font-semibold">
              {user?.email}
            </h2>
          </div>

          <div>
            <p className="text-gray-500">Role</p>
            <h2 className="text-xl font-semibold capitalize">
              {user?.role}
            </h2>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default Profile;