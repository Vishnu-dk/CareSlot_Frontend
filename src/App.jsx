import { Routes, Route, Navigate } from "react-router-dom";
import PublicOnlyRoute from "./routes/PublicOnlyRoutes";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProtectedRoute from "./routes/ProtectedRoutes";
import Placeholder from "./components/common/Placeholder";
import AppLayout from "./components/layout/AppLayout";
import PatientDashboard from "./pages/patient/DashboardPage";
import BookVisitPage from "./pages/patient/BookVisitPage";
import AppointmentsPage from "./pages/patient/AppointmentsPage";
import CarePlansPage from "./pages/patient/CarePlanPage";
import ClinicianDashboard from "./pages/clinician/DashboardPage";
import AvailabilityPage from "./pages/clinician/AvailabiltyPage";
import PatientsPage from "./pages/clinician/PatientsPage";
import AdminDashboard from "./pages/admin/DashboardPage";
import UsersPage from "./pages/admin/UserPage";
import CarePlansListPage from "./pages/patient/CarePlansListPage";
import ProfileSetup from "./pages/auth/ProfileSetup";

// ... other imports remain the same

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public Routes */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Profile Setup - Accessible to authenticated users with incomplete profiles */}
      <Route 
        path="/profile-setup" 
        element={
          <ProtectedRoute allowedRoles={["PATIENT", "CLINICIAN"]}>
            <ProfileSetup />
          </ProtectedRoute>
        } 
      />

      {/* Patient Routes */}
      <Route element={<ProtectedRoute allowedRoles={["PATIENT"]} />}>
        <Route path="/patient" element={<AppLayout />}>
          <Route index element={<PatientDashboard />} />
          <Route path="book" element={<BookVisitPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="care-plans" element={<CarePlansListPage />} />
        </Route>
      </Route>

      {/* Clinician Routes */}
      <Route element={<ProtectedRoute allowedRoles={["CLINICIAN"]} />}>
        <Route path="/clinician" element={<AppLayout />}>
          <Route index element={<ClinicianDashboard />} />
          <Route path="availability" element={<AvailabilityPage />} />
          <Route path="patients" element={<PatientsPage />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin" element={<AppLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}