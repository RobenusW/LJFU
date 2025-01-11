interface SkillObj {
  skill: string | null;
  level: string | null;
}

export type ResumeFormValues = {
  first_name: string;
  last_name: string;
  email: string;
  university: string;
  position: string[];
  metro_area: string;
  relocate: boolean;
  years_of_experience: number;
  technologies: SkillObj[];
  languages: SkillObj[];
  resume_pdf: string;
  user_id: string;
};
