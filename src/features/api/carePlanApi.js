export const carePlanApi = {
  injectInto: (api) => {
    api.injectEndpoints({
      endpoints: (builder) => ({
        getMyCarePlans: builder.query({
          query: () => "/care-plan/my-plans",
          providesTags: ["CarePlan"],
        }),

        getMyPatientsPlans: builder.query({
          query: () => "/care-plan/my-issued-plans",
          providesTags: ["CarePlan"],
        }),

        updateTaskStatus: builder.mutation({
          query: ({ taskId, status }) => ({
            url: `/care-plan/tasks/${taskId}/status?status=${status}`,
            method: "PATCH",
          }),
          invalidatesTags: ["CarePlan"],
        }),

        createCarePlan: builder.mutation({
          query: (payload) => ({
            url: "/care-plan",
            method: "POST",
            body: payload,
          }),
          invalidatesTags: ["CarePlan"],
        }),
      }),
    });
  },
};