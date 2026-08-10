import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReportIssue from "./pages/ReportIssue";
import Dashboard from "./pages/Dashboard";
import Map from "./pages/citizen/Map";

// Role Dashboards
import AdminDashboard from "./pages/admin/Dashboard";
import CreateWorker from "./pages/admin/CreateWorker";
import AllIssues from "./pages/admin/AllIssues";
import Users from "./pages/admin/Users";
import Analytics from "./pages/admin/Analytics";
import WorkerDashboard from "./pages/worker/Dashboard";
import CitizenDashboard from "./pages/citizen/Dashboard";
import MyIssues from "./pages/citizen/MyIssues";
import CitizenProfile from "./pages/citizen/Profile";
import WorkerProfile from "./pages/worker/Profile";
import WorkerIssues from "./pages/worker/WorkerIssues";
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
      <CitizenProfile />
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
        <Route
  path="/worker/issues"
  element={
    <RoleProtectedRoute role="worker">
      <WorkerIssues />
    </RoleProtectedRoute>
  }
/>

        <Route
  path="/worker/profile"
  element={
    <RoleProtectedRoute role="worker">
      <WorkerProfile />
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
        <Route
          path="/admin/create-worker"
          element={
            <RoleProtectedRoute role="admin">
              <CreateWorker />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/issues"
          element={
            <RoleProtectedRoute role="admin">
              <AllIssues />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RoleProtectedRoute role="admin">
              <Users />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <RoleProtectedRoute role="admin">
              <Analytics />
            </RoleProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
