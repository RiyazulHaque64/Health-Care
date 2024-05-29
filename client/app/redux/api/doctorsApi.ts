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
  useDeleteDoctorMutation,
} = doctorsApi;
