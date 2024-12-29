import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
import { User } from "./userInterface";
import { Credentials } from "./credientialsInterface";

export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;

export const USERS_API = `${REMOTE_SERVER}/api/users`;

export const signup = async (user: User) => {
  console.log(import.meta.env.VITE_REMOTE_SERVER);

  const response = await axiosWithCredentials.post(`${USERS_API}/signup`, user);
  return response.data;
};

export const signin = async (credentials: Credentials) => {
  const response = await axiosWithCredentials.post(
    `${USERS_API}/signin`,
    credentials
  );
  return response.data;
};

export const signout = async () => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signout`);
  return response.data;
};

export const findAllBusinesses = async () => {
  const response = await axiosWithCredentials.get(
    `${REMOTE_SERVER}/api/dashboard/businesses`
  );
  return response.data;
};

export const profile = async () => {
  const response = await axiosWithCredentials.get(`${USERS_API}/profile`);
  return response.data;
};
