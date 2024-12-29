import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
export const REMOTE_SERVER = import.meta.env.REACT_APP_REMOTE_SERVER;
import { FormValues as Resume } from "./ResumeFormat";

const RESUME_API = `${REMOTE_SERVER}/api/resumes`;

export const createResume = async (userId: string, resume: Resume) => {
  const response = await axiosWithCredentials.post(
    `${RESUME_API}/${userId}`,
    resume
  );
  return response.data;
};

export const findTotalResumeCount = async () => {
  const response = await axiosWithCredentials.get(
    `${REMOTE_SERVER}/api/resumesCollect/count`
  );
  return response.data;
};

export const findAllResumes = async () => {
  const response = await axiosWithCredentials.get(`${RESUME_API}`);
  return response.data;
};

export const findAllTalent = async () => {
  const response = await axiosWithCredentials.get(
    `${REMOTE_SERVER}/api/alltalent`
  );
  return response.data;
};

export const findResumeByUserId = async (userId: string) => {
  const response = await axiosWithCredentials.get(`${RESUME_API}/${userId}`);
  return response.data;
};

export const updateResume = async (userId: string, resume: Resume) => {
  const response = await axiosWithCredentials.put(
    `${RESUME_API}/${userId}`,
    resume
  );
  return response.data;
};

export const findResumeByEmailAddress = async (email: string) => {
  const response = await axiosWithCredentials.get(
    `${REMOTE_SERVER}/api/resumesUser/email/${email}`
  );
  return response.data;
};
