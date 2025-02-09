import { Database } from "../Interfaces-types/database.types";

export interface ResumeFormValues {
  first_name: string;
  last_name: string;
  universities: Database["public"]["CompositeTypes"]["universities"][];
  position: string[];
  metro_area: string;
  relocate: boolean;
  years_of_experience: number;
  technologies: Database["public"]["CompositeTypes"]["skill_obj"][];
  languages: Database["public"]["CompositeTypes"]["skill_obj"][];
  resume_pdf: string;
  user_id: string;
}
