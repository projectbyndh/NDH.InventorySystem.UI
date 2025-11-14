// src/Api/Dropdown.jsx  (or .js)
import axiosInstance from "./AxiosInstance";

const unwrap = (res) => {
  console.log("[Dropdown API raw response]", res);
  console.log("[Dropdown API data wrapper]", res?.data);

  const dataWrapper = res?.data ?? res;

  // your actual list is inside _data
  if (Array.isArray(dataWrapper?._data)) {
    console.log("[Dropdown API _data array]", dataWrapper._data);
    return dataWrapper._data; // <- return plain array
  }

  return dataWrapper;
};

const DropdownService = {
  getDistricts: () =>
    axiosInstance.get("/Dropdown/getAll-districts").then(unwrap),

  getMunicipalities: () =>
    axiosInstance.get("/Dropdown/getAll-municipalities").then(unwrap),

  getStateProvinces: () =>
    axiosInstance.get("/Dropdown/getAll-stateProvince").then(unwrap),
};

export default DropdownService;
