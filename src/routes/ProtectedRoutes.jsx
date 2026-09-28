import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUserRole } from "../features/auth/authSlice";
import { useGetMyProfileQuery, useGetClinicianMyProfileQuery } from "../features/api/careslotApi"; // Ensure this matches your file name
import { Spinner, Center } from "@chakra-ui/react";

export default function ProtectedRoute({ allowedRoles, children }) {
  const role = useSelector(selectCurrentUserRole)?.toUpperCase();
  const location = useLocation();

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const shouldCheckProfile = role === "PATIENT" || role === "CLINICIAN";

  const { data: profile, isLoading, isError } = shouldCheckProfile
    ? role === "CLINICIAN" 
      ? useGetClinicianMyProfileQuery() 
      : useGetMyProfileQuery()
    : { data: null, isLoading: false, isError: false };

  if (isLoading && shouldCheckProfile) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  const isProfileIncomplete = shouldCheckProfile && (
    isError || 
    !profile || 
    !profile.firstName || 
    !profile.lastName ||
    (role === "PATIENT" && (!profile.dateOfBirth || !profile.phoneNumber)) ||
    (role === "CLINICIAN" && (!profile.specialty || !profile.licenseNumber))
  );

  if (isProfileIncomplete && location.pathname !== "/profile-setup") {
    return <Navigate to="/profile-setup" replace />;
  }

  return children ? children : <Outlet />;
}