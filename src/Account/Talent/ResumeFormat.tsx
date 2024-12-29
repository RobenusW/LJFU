// types.ts
import { Job } from "./Interfaces/jobInterface";
import { GeneralInfo } from "./Interfaces/generalInterface";
import { Education } from "./Interfaces/educationInterface";
import { Skills } from "./Interfaces/skillsInterface";
import { Project } from "./Interfaces/projectInterface";

export type FormValues = {
  generalInfo: GeneralInfo;
  education: Education[];
  programmingLanguages: Skills[];
  technologies: Skills[];
  projects: Project[];
  employment: Job[];
};
