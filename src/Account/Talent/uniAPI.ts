import axios from "axios";

export const getUniversityInfo = async (university: string) => {
  const response = await axios.get(
    `https://universities.hipolabs.com/search?name=${university}`
  );
  return response.data;
};
