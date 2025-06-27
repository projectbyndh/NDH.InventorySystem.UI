import axiosInstance from "./AxiosInstance";

export const loginUser = (credentials) => {
  return axiosInstance.post("Auth/login", credentials);
};