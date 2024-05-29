import { authKey } from "@/app/constants/authKey";
import { getNewAccessToken } from "@/app/services/auth.service";
import { TGenericErrorResponse, TResponseSuccess } from "@/app/types";
import {
  getToLocalStorage,
  setToLocalStorage,
} from "@/app/utils/local-storage";
import axios from "axios";

const instance = axios.create();

instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";
instance.defaults.timeout = 60000;

instance.interceptors.request.use(
  function (config) {
    const accessToken = getToLocalStorage(authKey);
    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  //@ts-ignore
  function (response) {
    const responseObject: TResponseSuccess = {
      data: response?.data?.data,
      meta: response?.data?.meta,
    };
    return responseObject;
  },
  async function (error) {
    const { config } = error;
    if (error?.response?.data?.message === "jwt expired" && !config.sent) {
      config.sent = true;
      const res = await getNewAccessToken();
      const accessToken = res?.data?.accessToken;
      setToLocalStorage(authKey, accessToken);
      config.headers["Authorization"] = accessToken;

      return instance(config);
    }
    const responseObject: TGenericErrorResponse = {
      statusCode: error?.response?.data?.statusCode || 500,
      message: error?.response?.data?.message || "Something went wrong!",
      errorMessages: error?.response?.data?.message,
    };
    return responseObject;
    // return Promise.reject(error);
  }
);

export { instance };
