import axiosInstance from "./AxiosInstance";

export const loginUser = async ({ userEmail, password }) => {
  const res = await axiosInstance.post("/Auth/login", { userEmail, password });
  const raw = res?.data;
  try {
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return raw;
  }
};
