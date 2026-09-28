export const authApi = {
  injectInto: (api) => {
    api.injectEndpoints({
      endpoints: (builder) => ({
        login: builder.mutation({
          query: (body) => ({
            url: "/auth/login",
            method: "POST",
            body,
          }),
        }),

        register: builder.mutation({
          query: (body) => ({
            url: "/auth/register",
            method: "POST",
            body,
          }),
        }),
      }),
    });
  },
};