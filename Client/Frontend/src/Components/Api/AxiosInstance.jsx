import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://ghargharko.com/api/",
  timeout: 10000,
});

export default axiosInstance;
