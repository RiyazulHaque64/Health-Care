export const setToLocalStorage = (key: string, value: string) => {
  if (!key || typeof window === "undefined") {
    return "";
  } else {
    localStorage.setItem(key, value);
  }
};

export const getToLocalStorage = (key: string) => {
  if (!key || typeof window === "undefined") {
    return "";
  }
  return localStorage.getItem(key);
};

export const removeToLocalStorage = (key: string) => {
  if (!key || typeof window === "undefined") {
    return "";
  }
  localStorage.removeItem(key);
};
