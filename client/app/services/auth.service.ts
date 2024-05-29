import { jwtDecode } from "jwt-decode";
import { authKey } from "../constants/authKey";
import { instance as axiosInstance } from "../helpers/axios/axiosInstance";
import {
  getToLocalStorage,
  removeToLocalStorage,
  setToLocalStorage,
} from "../utils/local-storage";

export const storeUserInfo = (info: string) => {
  setToLocalStorage(authKey, info);
};

export const getUserInfo = () => {
  const token = getToLocalStorage(authKey);
  if (token) {
    const decodedInfo: any = jwtDecode(token);
    return {
      ...decodedInfo,
      role: decodedInfo.role.toLowerCase(),
    };
  }
};

export const removeUserInfo = () => {
  removeToLocalStorage(authKey);
};

export const isLoggedIn = () => {
  const token = getToLocalStorage(authKey);
  if (token) {
    return !!token;
  }
};

export const getNewAccessToken = async () => {
  const res = await axiosInstance({
    url: "http://localhost:5001/api/v1/auth/access-token",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  return res;
};
