import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { selectCurrentToken } from "../auth/authSlice";

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
  tagTypes: ["Clinician", "Availability", "Appointment", "CarePlan", "Patient"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    register: builder.mutation({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),

    getClinicians: builder.query({
      query: () => "/clinicians",
      providesTags: ["Clinician"],
    }),

    getWeeklyAvailability: builder.query({
      query: (clinicianId) => `/scheduling/clinicians/${clinicianId}/weekly-availability`,
      providesTags: ["Availability"],
    }),
    getAvailableSlots: builder.query({
      query: ({ clinicianId, date }) => `/scheduling/clinicians/${clinicianId}/slots?date=${date}`,
      providesTags: ["Availability"],
    }),

    bookAppointment: builder.mutation({
      query: (body) => ({ url: "/appointments", method: "POST", body }),
      invalidatesTags: ["Appointment"],
    }),
    getMyAppointments: builder.query({
      query: () => "/appointments/my-history",
      providesTags: ["Appointment"],
    }),
    cancelAppointment: builder.mutation({
      query: (appointmentId) => ({
        url: `/appointments/${appointmentId}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["Appointment"],
    }),

    getMyCarePlans: builder.query({
      query: () => "/care-plans/my-plans",
      providesTags: ["CarePlan"],
    }),
    updateTaskStatus: builder.mutation({
      query: ({ taskId, status }) => ({
        url: `/care-plans/tasks/${taskId}/status?status=${status}`,
        method: "PATCH",
      }),
      invalidatesTags: ["CarePlan"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCliniciansQuery,
  useGetWeeklyAvailabilityQuery,
  useGetAvailableSlotsQuery,
  useBookAppointmentMutation,
  useGetMyAppointmentsQuery,
  useCancelAppointmentMutation,
  useGetMyCarePlansQuery,
  useUpdateTaskStatusMutation,
} = careSlotApi;