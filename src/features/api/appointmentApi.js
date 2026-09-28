export const appointmentApi = {
  injectInto: (api) => {
    api.injectEndpoints({
      endpoints: (builder) => ({
        bookAppointment: builder.mutation({
          query: (body) => ({
            url: "/appointments",
            method: "POST",
            body,
          }),
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

        getMySchedule: builder.query({
          query: ({ date }) =>
            `/appointments/my-schedule?date=${date}`,
          providesTags: ["Appointment"],
        }),

        completeAppointment: builder.mutation({
          query: (id) => ({
            url: `/appointments/${id}/complete`,
            method: "PATCH",
          }),
          invalidatesTags: ["Appointment"],
        }),

        getAllAppointments: builder.query({
          query: () => "/appointments/all",
          providesTags: ["Appointment"],
        }),
      }),
    });
  },
};