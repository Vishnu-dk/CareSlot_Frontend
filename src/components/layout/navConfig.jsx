import {
  LayoutDashboard,
  CalendarPlus,
  CalendarDays,
  ClipboardList,
  Clock,
  Users,
  BarChart3,
  Stethoscope,
  LogOut,
} from "lucide-react";

export const NAV_ITEMS = {
  PATIENT: [
    { label: "Dashboard",    path: "/patient",              icon: LayoutDashboard, end: true },
    { label: "Book a Visit", path: "/patient/book",         icon: CalendarPlus },
    { label: "Appointments", path: "/patient/appointments", icon: CalendarDays },
    { label: "Care Plans",   path: "/patient/care-plans",   icon: ClipboardList },
    { label: "Logout",       path: "/login",                icon: LogOut,        isLogout: true },
  ],
  CLINICIAN: [
    { label: "Today's Schedule", path: "/clinician",              icon: CalendarDays, end: true },
    { label: "Availability",     path: "/clinician/availability", icon: Clock },
    { label: "My Patients",      path: "/clinician/patients",     icon: Users },
    { label: "Care Plans",       path: "/clinician/care-plans",   icon: ClipboardList },
    { label: "Logout",           path: "/login",                icon: LogOut,        isLogout: true },
  ],
  ADMIN: [
    { label: "Overview",   path: "/admin",            icon: BarChart3, end: true },
    { label: "Clinicians", path: "/admin/clinicians", icon: Stethoscope },
    { label: "Patients",   path: "/admin/patients",   icon: Users },
    { label: "Logout",     path: "/login",            icon: LogOut,        isLogout: true },
  ],
};
