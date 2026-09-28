export const schedulingApi = {
  injectInto: (api) => {
    api.injectEndpoints({
      endpoints: (builder) => ({
        getWeeklyAvailability: builder.query({
          query: (clinicianId) =>
            `/scheduling/clinicians/${clinicianId}/weekly-availability`,
          providesTags: ["Availability"],
        }),

        getAvailableSlots: builder.query({
          query: ({ clinicianId, date }) =>
            `/scheduling/clinicians/${clinicianId}/slots?date=${date}`,
          providesTags: ["Availability"],
        }),

        updateAvailability: builder.mutation({
          query: (body) => ({
            url: "/scheduling/availability",
            method: "PUT",
            body,
          }),
          invalidatesTags: ["Availability"],
        }),

        setAvailability: builder.mutation({
          query: (body) => ({
            url: "/scheduling/availability",
            method: "POST",
            body,
          }),
          invalidatesTags: ["Availability"],
        }),

        deleteAvailability: builder.mutation({
          query: (dayOfWeek) => ({
            url: `/scheduling/availability/${dayOfWeek}`,
            method: "DELETE",
          }),
          invalidatesTags: ["Availability"],
        }),
      }),
    });
  },
};