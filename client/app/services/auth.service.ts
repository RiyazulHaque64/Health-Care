import { jwtDecode } from "jwt-decode";
import { authKey } from "../constants/authKey";
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
