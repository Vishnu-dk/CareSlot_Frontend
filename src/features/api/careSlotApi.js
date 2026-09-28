import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { selectCurrentToken } from "../auth/authSlice";

// Feature modules
import { authApi } from "./authApi";
import { patientApi } from "./patientApi";
import { clinicianApi } from "./clinicianApi";
import { appointmentApi } from "./appointmentApi";
import { schedulingApi } from "./schedulingApi";
import { carePlanApi } from "./carePlanApi";
import { adminApi } from "./adminApi";

export const careSlotApi = createApi({
  reducerPath: "careSlotApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = selectCurrentToken(getState());

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    "Clinician",
    "Availability",
    "Appointment",
    "CarePlan",
    "Patient",
  ],
  endpoints: () => ({}),
});

authApi.injectInto(careSlotApi);
patientApi.injectInto(careSlotApi);
clinicianApi.injectInto(careSlotApi);
appointmentApi.injectInto(careSlotApi);
schedulingApi.injectInto(careSlotApi);
carePlanApi.injectInto(careSlotApi);
adminApi.injectInto(careSlotApi);

export const {
  useLoginMutation,
  useRegisterMutation,

  useGetMyProfileQuery,
  useUpdatePatientProfileMutation,

  useGetClinicianMyProfileQuery,
  useUpdateClinicianProfileMutation,

  useGetCliniciansQuery,
  useGetAllCliniciansQuery,

  useGetWeeklyAvailabilityQuery,
  useGetAvailableSlotsQuery,

  useBookAppointmentMutation,
  useGetMyAppointmentsQuery,
  useCancelAppointmentMutation,

  useGetMyCarePlansQuery,
  useUpdateTaskStatusMutation,
  useGetMyPatientsPlansQuery,

  useGetMyScheduleQuery,
  useCompleteAppointmentMutation,
  useCreateCarePlanMutation,

  useGetMyWeeklyAvailabilityQuery,
  useUpdateAvailabilityMutation,
  useSetAvailabilityMutation,
  useDeleteAvailabilityMutation,

  useGetMyPatientsQuery,

  useGetAllPatientsQuery,
  useGetAllAppointmentsQuery,

  useDeactivateUserMutation,
  useActivateUserMutation,
} = careSlotApi;