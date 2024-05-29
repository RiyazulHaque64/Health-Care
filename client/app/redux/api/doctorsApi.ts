import { TMeta } from "@/app/types";
import { IDoctor } from "@/app/types/doctor";
import { tagTypes } from "../tagTypes";
import baseApi from "./baseApi";

const doctorsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createDoctor: build.mutation({
      query: (data) => {
        return {
          url: "/user/create-doctor",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data,
        };
      },
      invalidatesTags: [tagTypes.doctors],
    }),
    getAllDoctors: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/doctor",
        method: "GET",
        params: arg,
      }),
      transformResponse: (response: IDoctor[], meta: TMeta) => ({
        doctors: response,
        meta,
      }),
      providesTags: [tagTypes.doctors],
    }),
    getSingleDoctor: build.query({
      query: (id) => ({
        url: `/doctor/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.doctors],
    }),
    updateDoctor: build.mutation({
      query: (payload) => ({
        url: `/doctor/${payload.id}`,
        method: "PATCH",
        data: payload.data,
      }),
      invalidatesTags: [tagTypes.doctors],
    }),
    deleteDoctor: build.mutation({
      query: (id) => ({
        url: `/doctor/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.doctors],
    }),
  }),
});

export const {
  useCreateDoctorMutation,
  useGetAllDoctorsQuery,
  useGetSingleDoctorQuery,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
} = doctorsApi;
