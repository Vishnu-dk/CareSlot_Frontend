export const adminApi = {
  injectInto: (api) => {
    api.injectEndpoints({
      endpoints: (builder) => ({
        deactivateUser: builder.mutation({
          query: (userId) => ({
            url: `/admin/users/${userId}/deactivate`,
            method: "PATCH",
          }),
          invalidatesTags: ["Clinician", "Patient"],
        }),

        activateUser: builder.mutation({
          query: (userId) => ({
            url: `/admin/users/${userId}/activate`,
            method: "PATCH",
          }),
          invalidatesTags: [
            "Clinician",
            "Patient",
            "Appointment",
          ],
        }),
      }),
    });
  },
};