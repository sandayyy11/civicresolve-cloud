import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function RoleProtectedRoute({ children, role }) {
  const { token, user } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleProtectedRoute;