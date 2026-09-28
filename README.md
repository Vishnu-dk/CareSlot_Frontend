# CareSlot Frontend

A modern React-based frontend application for the CareSlot Healthcare Appointment & Care-Plan Management System. The application provides role-based access for Patients, Clinicians, and Administrators to efficiently manage appointment scheduling, clinician availability, care-plan task tracking, and system-wide analytics through a clean, responsive, and calming user interface.

---

## Features

### Authentication & Onboarding
- JWT-based Authentication with secure token storage
- Role-Based Authorization (Admin, Clinician, Patient)
- Protected Routes with role-based redirection
- Profile Setup flow for new Patients and Clinicians
- Secure Logout & Token Management

### Patient Module
- Personalized Patient Dashboard with upcoming appointments and active care-plan progress
- Browse Clinicians and book appointments with real-time slot availability
- Weekly availability view with dynamic date selection
- Appointment management (view history, cancel with 24-hour policy)
- Care Plan tracking with interactive task completion and weighted progress rings

### Clinician Module
- Clinician Dashboard with daily schedule and appointment workflow
- Create Care Plans with weighted tasks within appointment time windows
- Complete appointments (enforced care-plan requirement)
- Manage weekly availability (set, update, or mark days off)
- View assigned patients with last visit and status tracking

### Administrator Module
- Comprehensive System Overview Dashboard with KPI metrics
- Real-time activity log and user distribution analytics
- User Directory with search and role filtering
- Activate / Deactivate user accounts with confirmation dialogs

---

## Tech Stack

### Frontend

- React 19
- Vite
- React Router DOM (v7)
- Redux Toolkit
- RTK Query
- Chakra UI (v2) with custom theme tokens
- Lucide React (Icons)
- date-fns (Date manipulation)
- React Hook Form (where applicable)

### State Management

- Redux Toolkit (auth slice)
- RTK Query (API caching, automatic refetching, tag-based invalidation)

### Styling

- Chakra UI
- Custom design system (espresso, brand, beige, taupe, cream tokens)
- Fully responsive design (mobile-first)
- Reusable design components (ProgressRing, StatusBadge, Toast, etc.)

---

## Project Structure

```text
src
│
├── app
│   └── store.js
│
├── components
│   ├── admin
│   │   └── StatusChangeDialog.jsx
│   ├── clinician
│   │   └── CarePlanModal.jsx
│   ├── common
│   │   ├── Placeholder.jsx
│   │   ├── ProgressMiniRing.jsx
│   │   ├── ProgressRing.jsx
│   │   ├── StatusBadge.jsx
│   │   └── Toast.jsx
│   ├── layout
│   │   ├── AppLayout.jsx
│   │   └── TopBar.jsx
│   └── patient
│       ├── BookingModal.jsx
│       └── CarePlanDetailModal.jsx
│
├── features
│   ├── api
│   │   ├── adminApi.js
│   │   ├── appointmentApi.js
│   │   ├── authApi.js
│   │   ├── carePlanApi.js
│   │   ├── careSlotApi.js
│   │   ├── clinicianApi.js
│   │   ├── patientApi.js
│   │   └── schedulingApi.js
│   └── auth
│       └── authSlice.js
│
├── pages
│   ├── admin
│   │   ├── DashboardPage.jsx
│   │   └── UserPage.jsx
│   ├── auth
│   │   ├── LoginPage.jsx
│   │   ├── ProfileSetup.jsx
│   │   └── RegisterPage.jsx
│   ├── clinician
│   │   ├── AvailabilityPage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── PatientsPage.jsx
│   └── patient
│       ├── AppointmentsPage.jsx
│       ├── BookVisitPage.jsx
│       ├── CarePlanPage.jsx
│       ├── CarePlansListPage.jsx
│       └── DashboardPage.jsx
│
├── routes
│   ├── ProtectedRoutes.jsx
│   ├── PublicOnlyRoutes.jsx
│   └── roleHome.js
│
├── utils
│   ├── dates.js
│   └── initials.js
│
├── theme.js
├── App.jsx
└── main.jsx
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Vishnu-dk/CareSlot_Frontend.git
cd careslot-frontend
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Application runs at:

```text
http://localhost:5173
```

---

## Environment Variables

Create a `.env` file in the project root.

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## Available Scripts

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## User Roles

### Patient

```text
Dashboard (Upcoming appointments, Active care plan progress)
Book Visit (Browse clinicians, view availability, select slots)
My Appointments (Upcoming & Past with cancel option)
My Care Plans (Task tracking with progress rings)
```

### Clinician

```text
Dashboard (Daily schedule, Create care plans, Complete appointments)
My Availability (Set weekly working hours)
My Patients (View assigned patients with last visit)
```

### Administrator

```text
Dashboard (System overview, KPIs, Activity log, User distribution)
User Directory (Search, filter, activate/deactivate users)
```

---

## Reusable Components

### ProgressRing & ProgressMiniRing

Custom SVG-based circular progress indicators used across dashboards and care-plan cards to visualize completion percentage.

### StatusBadge

Supports multiple status types with color-coded styling:

```text
APPOINTMENT STATUS:
BOOKED
CANCELLED
COMPLETED

CARE PLAN STATUS:
ACTIVE
PAUSED
COMPLETED
```

### Toast

Global toast notification system for success/error messages across all API mutations.

### BookingModal

Used by patients to confirm appointment bookings with a reason field and real-time error handling (e.g., slot just taken).

### CarePlanModal & CarePlanDetailModal

Used by clinicians to create care plans with weighted tasks, and by patients to view plan details and mark tasks as complete.

### StatusChangeDialog

Admin confirmation dialog for activating/deactivating user accounts.

---

## Dashboard Analytics

### Admin Dashboard

- **KPI Metrics:** Total Patients, Active Clinicians, Booked Appointments, Completion Rate
- **Latest Activity Log:** Real-time feed of completed and booked appointments
- **User Distribution:** Visual breakdown of patients vs. clinicians
- **System Health Indicator**

### Clinician Dashboard

- **Today's Schedule:** Chronological list of appointments with Create Plan / Complete actions
- **Plan Window Validation:** Care plans can only be created within ±5 minutes of appointment time
- **Stats:** Seen Today, Pending Plans (need care plans)

### Patient Dashboard

- **Upcoming Appointment Card:** With quick cancel action
- **Active Care Plan Card:** With animated progress ring
- **Lifetime Stats:** Total Appointments, Completed Visits, Unique Clinicians Seen

---

## Key UX Features

- **Smart Routing:** Users are automatically redirected to role-specific home pages after login
- **Profile Completion Gate:** New patients/clinicians are forced to complete their profile before accessing the dashboard
- **Real-time Slot Validation:** Available slots are filtered to exclude past times and already-booked appointments
- **Weighted Task Progress:** Care-plan progress is calculated based on task weights, not just count
- **24-Hour Cancellation Policy:** Enforced in UI with clear error messaging
- **Responsive Design:** Fully optimized for mobile, tablet, and desktop viewports

---

## Backend Dependency

This frontend application depends on the **CareSlot Backend API**.

Required backend modules:

```text
Authentication (/auth)
Patients (/patients)
Clinicians (/clinicians)
Appointments (/appointments)
Scheduling (/scheduling)
Care Plans (/care-plan)
Admin (/admin)
```

Ensure the backend server is running on `http://localhost:8080` before accessing the frontend application.

---

## Recording

https://github.com/user-attachments/assets/75b4b0f6-e862-40d0-ab4a-abac804a5c9d


---

## Author

**Vishnu Divakar**

CareSlot Frontend developed using:

- React 19
- Redux Toolkit
- RTK Query
- Chakra UI
- Lucide React
- date-fns
- Vite




