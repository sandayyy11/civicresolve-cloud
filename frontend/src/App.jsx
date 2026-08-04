import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReportIssue from "./pages/ReportIssue";
import Dashboard from "./pages/Dashboard";
import Map from "./pages/citizen/Map";

// Role Dashboards
import AdminDashboard from "./pages/admin/Dashboard";
import WorkerDashboard from "./pages/worker/Dashboard";
import CitizenDashboard from "./pages/citizen/Dashboard";
import MyIssues from "./pages/citizen/MyIssues";
import Profile from "./pages/citizen/Profile";

// Protected Routes
import ProtectedRoute from "./components/protected/ProtectedRoute";
import RoleProtectedRoute from "./components/protected/RoleProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Route */}
        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <ReportIssue />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Citizen Routes */}
        <Route
          path="/citizen/dashboard"
          element={
            <RoleProtectedRoute role="citizen">
              <CitizenDashboard />
            </RoleProtectedRoute>
          }
        />

        <Route
  path="/citizen/issues"
  element={
    <RoleProtectedRoute role="citizen">
      <MyIssues />
    </RoleProtectedRoute>
  }
/>

<Route
  path="/citizen/profile"
  element={
    <RoleProtectedRoute role="citizen">
      <Profile />
    </RoleProtectedRoute>
  }
/>
<Route
  path="/citizen/map"
  element={
    <RoleProtectedRoute role="citizen">
      <Map />
    </RoleProtectedRoute>
  }
/>



        {/* Worker Routes */}
        <Route
          path="/worker/dashboard"
          element={
            <RoleProtectedRoute role="worker">
              <WorkerDashboard />
            </RoleProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <RoleProtectedRoute role="admin">
              <AdminDashboard />
            </RoleProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;