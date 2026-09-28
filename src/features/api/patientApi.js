export const patientApi = {
  injectInto: (api) => {
    api.injectEndpoints({
      endpoints: (builder) => ({
        getMyProfile: builder.query({
          query: () => "/patients/my-profile",
          providesTags: ["Patient"],
        }),

        updatePatientProfile: builder.mutation({
          query: (body) => ({
            url: "/patients/profile",
            method: "POST",
            body,
          }),
          invalidatesTags: ["Patient"],
        }),

        getAllPatients: builder.query({
          query: () => "/patients",
          providesTags: ["Patient"],
        }),
      }),
    });
  },
};