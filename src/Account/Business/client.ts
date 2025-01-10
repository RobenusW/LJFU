import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
export const REMOTE_SERVER = import.meta.env.REACT_APP_REMOTE_SERVER;
import { Business } from "./businessInterface";

export const BUSINESSES_API = `${REMOTE_SERVER}/api/businesses`;

export const createBusiness = async ({
  name,
  logo,
  description,
}: {
  name: string;
  logo: File;
  description: string;
}) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("logo", logo);
  formData.append("description", description);

  const response = await axiosWithCredentials.post(BUSINESSES_API, formData);

  return response.data;
};

export const findAllBusinesses = async () => {
  const response = await axiosWithCredentials.get(BUSINESSES_API);
  return response.data;
};

export const findBusinessById = async (id: string) => {
  const response = await axiosWithCredentials.get(`${BUSINESSES_API}/${id}`);
  return response.data;
};

export const findBusinessByName = async (name: string) => {
  const response = await axiosWithCredentials.get(
    `${BUSINESSES_API}/name/${name}`
  );
  return response.data;
};

export const updateBusiness = async (id: string, business: Business) => {
  const response = await axiosWithCredentials.put(
    `${BUSINESSES_API}/${id}`,
    business
  );
  return response.data;
};

export const deleteBusiness = async (id: string) => {
  const response = await axiosWithCredentials.delete(`${BUSINESSES_API}/${id}`);
  return response.data;
};
