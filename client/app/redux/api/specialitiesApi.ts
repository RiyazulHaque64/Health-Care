import { tagTypes } from "../tagTypes";
import baseApi from "./baseApi";

const specialitiesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createSpecilities: build.mutation({
      query: (data) => ({
        url: "/specialities",
        method: "POST",
        contentType: "multipart/form-data",
        data,
      }),
      invalidatesTags: [tagTypes.specialities],
    }),
    getAllSpecialities: build.query({
      query: () => ({
        url: "/specialities",
        method: "GET",
      }),
      providesTags: [tagTypes.specialities],
    }),
    deleteSpecialty: build.mutation({
      query: (id) => ({
        url: `/specialities/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.specialities],
    }),
  }),
});

export const {
  useCreateSpecilitiesMutation,
  useGetAllSpecialitiesQuery,
  useDeleteSpecialtyMutation,
} = specialitiesApi;
