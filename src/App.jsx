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


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth pages — logged-in users get bounced out */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* PATIENT portal */}
      <Route element={<ProtectedRoute allowedRoles={["PATIENT"]} />}>
        <Route path="/patient" element={<AppLayout />}>
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/patient/book" element={<BookVisitPage />} />
          <Route path="/patient/appointments" element={<AppointmentsPage />} />
          <Route path="/patient/care-plans" element={<CarePlansPage />} />
        </Route>
      </Route>

      {/* CLINICIAN portal */}
      <Route element={<ProtectedRoute allowedRoles={["CLINICIAN"]} />}>
        <Route path="/clinician" element={<AppLayout />}>
          <Route index element={<Placeholder name="Today's Schedule" />} />
          <Route path="availability" element={<Placeholder name="Manage Availability" />} />
          <Route path="patients" element={<Placeholder name="My Patients" />} />
          <Route path="care-plans" element={<Placeholder name="Care Plans Issued" />} />
        </Route>
      </Route>

      {/* ADMIN portal */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin" element={<AppLayout />}>
          <Route index element={<Placeholder name="System Overview" />} />
          <Route path="clinicians" element={<Placeholder name="All Clinicians" />} />
          <Route path="patients" element={<Placeholder name="All Patients" />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}