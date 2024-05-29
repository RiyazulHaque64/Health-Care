import { TMeta } from "@/app/types";
import { tagTypes } from "../tagTypes";
import baseApi from "./baseApi";

const doctorsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createSchedules: build.mutation({
      query: (data) => {
        return {
          url: "/schedule",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data,
        };
      },
      invalidatesTags: [tagTypes.schedule],
    }),
    getAllSchedules: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/schedule",
        method: "GET",
        params: arg,
      }),
      transformResponse: (response: [], meta: TMeta) => ({
        schedules: response,
        meta,
      }),
      providesTags: [tagTypes.schedule],
    }),
    deleteSchedule: build.mutation({
      query: (id) => ({
        url: `/schedule/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.schedule],
    }),
  }),
});

export const {
  useCreateSchedulesMutation,
  useGetAllSchedulesQuery,
  useDeleteScheduleMutation,
} = doctorsApi;
