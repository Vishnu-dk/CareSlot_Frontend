import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectCurrentUserRole } from "../features/auth/authSlice";
import { ROLE_HOME } from "./roleHome";

export default function PublicOnlyRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectCurrentUserRole);

  if (isAuthenticated) return <Navigate to={ROLE_HOME[role] || "/"} replace />;
  return <Outlet />;
}
