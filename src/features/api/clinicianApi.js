export const clinicianApi = {
  injectInto: (api) => {
    api.injectEndpoints({
      endpoints: (builder) => ({
        getClinicians: builder.query({
          query: () => "/clinicians",
          providesTags: ["Clinician"],
        }),

        getAllClinicians: builder.query({
          query: () => "/clinicians",
          providesTags: ["Clinician"],
        }),

        getClinicianMyProfile: builder.query({
          query: () => "/clinicians/my-profile",
          providesTags: ["Clinician"],
        }),

        updateClinicianProfile: builder.mutation({
          query: (body) => ({
            url: "/clinicians/profile",
            method: "POST",
            body,
          }),
          invalidatesTags: ["Clinician"],
        }),

        getMyPatients: builder.query({
          query: () => "/clinicians/my-patients",
          providesTags: ["Patient"],
        }),

        getMyWeeklyAvailability: builder.query({
          query: () => "/clinicians/weekly-availability/me",
          providesTags: ["Availability"],
        }),
      }),
    });
  },
};