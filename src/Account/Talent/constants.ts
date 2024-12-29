import axios from "axios";

export const axiosWithCredentials = axios.create({ withCredentials: true });
export const REMOTE_SERVER = import.meta.env.REACT_APP_REMOTE_SERVER;
export const SEARCH_API = `${REMOTE_SERVER}/api/search`;
