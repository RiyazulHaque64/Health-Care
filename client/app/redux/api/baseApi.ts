import { axiosBaseQuery } from "@/app/helpers/axios/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import tagTypesList from "../tagTypes";

const baseApi = createApi({
  reducerPath: "path",
  baseQuery: axiosBaseQuery({ baseUrl: "http://localhost:5001/api/v1" }),
  endpoints: () => ({}),
  tagTypes: tagTypesList,
});

export default baseApi;
