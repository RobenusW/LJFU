import { Skills } from "./skillsInterface";
export interface GeneralInfo {
  firstName: string;
  lastName: string;
  email: string;
  university: string;
  position: string;
  location: {
    city: string;
    state: string;
  };
  yearsOfExperience: number | null;
  technologies: Skills[];
  languages: Skills[];
}
