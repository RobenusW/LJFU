import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  CssBaseline,
  ThemeProvider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
} from "@mui/material";
import { Grid2 as Grid } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useForm, useFieldArray } from "react-hook-form";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Alert from "@mui/material/Alert";
import { findResumeByUserId, createResume, updateResume } from "./resumeClient";
import { useParams, useNavigate } from "react-router-dom";
import { FormValues } from "./ResumeFormat";
import { states } from "./States";
import { Education } from "./Interfaces/educationInterface";
import { Skills } from "./Interfaces/skillsInterface";
import { Project } from "./Interfaces/projectInterface";
import { Job } from "./Interfaces/jobInterface";
import { GeneralInfo } from "./Interfaces/generalInterface";
import { editorTheme } from "./editorTheme";

export default function ResumeEditor() {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();

  const MAX_BULLET_POINTS_EMPLOYMENT = 3;
  const [canAddTechnology, setCanAddTechnology] = useState(true);
  const [generalInfo, setGeneralInfo] = useState<GeneralInfo>({
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    state: "",
    email: "",
    github: "",
    portfolio: "",
    additionalLink: "",
  });

  const [educationInfo, setEducationInfo] = useState<Education[]>([]);
  const [programmingLanguages, setProgrammingLanguages] = useState<Skills[]>(
    []
  );
  const [technologies, setTechnologies] = useState<Skills[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [employment, setEmployment] = useState<Job[]>([]);

  const { control, register, handleSubmit, reset, getValues, trigger } =
    useForm<FormValues>({
      defaultValues: {
        generalInfo: generalInfo,
        education: educationInfo,
        programmingLanguages: programmingLanguages,
        technologies: technologies,
        projects: projects,
        employment: employment,
      },
    });

  useEffect(() => {
    const fetchResume = async () => {
      if (!uid) return;
      const resume = await findResumeByUserId(uid);
      if (resume) {
        try {
          setGeneralInfo(resume.generalInfo);
          setEducationInfo(resume.education || []);
          setProgrammingLanguages(resume.programmingLanguages || []);
          setTechnologies(resume.technologies || []);
          setProjects(resume.projects || []);
          setEmployment(resume.employment || []);
          reset({
            generalInfo: resume?.generalInfo,
            education: resume?.education || [],
            programmingLanguages: resume?.programmingLanguages || [],
            technologies: resume?.technologies || [],
            projects: resume?.projects || [],
            employment: resume?.employment || [],
          });
        } catch (error) {
          console.error("Error fetching resume", error);
        }
      }
    };
    fetchResume();
  }, [uid, reset]);

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({ control, name: "education" });

  const {
    fields: programmingLanguagesFields,
    append: appendProgrammingLanguages,
    remove: removeProgrammingLanguages,
  } = useFieldArray({ control, name: "programmingLanguages" });

  const {
    fields: technologiesFields,
    append: appendTechnologies,
    remove: removeTechnologies,
  } = useFieldArray({ control, name: "technologies" });

  const {
    fields: projectsFields,
    update: updateProjects,
    append: appendProjects,
    remove: removeProjects,
  } = useFieldArray({ control, name: "projects" });

  const {
    fields: employmentFields,
    update: updateEmployment,
    append: appendEmployment,
    remove: removeEmployment,
  } = useFieldArray({ control, name: "employment" });

  const onSubmit = async (data: FormValues) => {
    try {
      if (!uid) {
        throw new Error("User ID is required");
      }
      const existingResume = await findResumeByUserId(uid);
      if (existingResume) {
        console.log("existing", existingResume);
        await updateResume(uid as string, data);
        console.log("Resume found, updating...");
      } else {
        console.log("No existing resume found, creating a new one...");
        await createResume(uid as string, data);
      }

      navigate(`/talent/${uid}/dashboard`);
    } catch (error: Error | unknown) {
      console.error("Error during resume submission:", error);

      if (error instanceof Error) {
        if (error.message.includes("fetching")) {
          alert(
            "An error occurred while fetching the resume. Please try again."
          );
        } else if (error.message.includes("saving")) {
          alert("An error occurred while saving the resume. Please try again.");
        } else {
          alert(
            "An unexpected error occurred. Please check the console for details."
          );
        }
      }
    }
  };

  const [expanded, setExpanded] = useState<string | false>("generalInfo");

  const handleAccordionChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const values = getValues();
    const isGeneralInfoFilled = Object.values(values.generalInfo).some(
      (value) => value !== ""
    );

    if (isGeneralInfoFilled) {
      const isValid = await trigger("generalInfo");
      if (isValid) {
        handleSubmit(onSubmit)();
      } else {
        alert("Please fill in all required fields in General Info.");
      }
    } else {
      handleSubmit(onSubmit)();
    }
  };

  const handleAddTechnology = async () => {
    // Check if all existing technology fields are filled before adding a new one
    const technologies = await getValues("technologies");
    const allFilled = technologies.every(
      (technology) => technology.skill !== ""
    );

    if (allFilled) {
      appendTechnologies({ skill: "", skillLevel: "familiar" });
      setCanAddTechnology(true); // Reset for future additions
    } else {
      setCanAddTechnology(false); // Prevent adding if fields are empty
    }
  };

  const alertMessage = (message: string) => (
    <Alert severity="error">{message}</Alert>
  );

  return (
    <ThemeProvider theme={editorTheme}>
      <CssBaseline />
      <Box p={3}>
        <Typography variant="h4" align="center" gutterBottom>
          Resume Editor
        </Typography>
        <form onSubmit={handleFormSubmit} noValidate>
          {/* General Info */}
          <Accordion
            expanded={expanded === "generalInfo"}
            onChange={handleAccordionChange("generalInfo")}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">General Info</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="First Name"
                    fullWidth
                    {...register("generalInfo.firstName", { required: true })}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Last Name"
                    fullWidth
                    {...register("generalInfo.lastName", { required: true })}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Phone Number"
                    fullWidth
                    {...register("generalInfo.phone", { required: true })}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="City"
                    fullWidth
                    {...register("generalInfo.city", { required: true })}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    value={generalInfo.state || ""}
                    label="State"
                    fullWidth
                    {...register("generalInfo.state", { required: true })}
                    onChange={(e) =>
                      setGeneralInfo({ ...generalInfo, state: e.target.value })
                    }
                    required
                  >
                    {states.map((state) => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Email"
                    fullWidth
                    {...register("generalInfo.email", { required: true })}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Github"
                    fullWidth
                    {...register("generalInfo.github")}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Portfolio Website"
                    fullWidth
                    {...register("generalInfo.portfolio")}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Additional Link"
                    fullWidth
                    {...register("generalInfo.additionalLink")}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Education */}
          <Accordion
            expanded={expanded === "education"}
            onChange={handleAccordionChange("education")}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Education</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {educationFields.map((field, index) => (
                <Box key={field.id} mt={2}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label="University"
                        fullWidth
                        {...register(`education.${index}.university`)}
                        required={!!getValues(`education.${index}.university`)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label="Major"
                        fullWidth
                        {...register(`education.${index}.major`)}
                        required={!!getValues(`education.${index}.university`)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label="Concentration"
                        fullWidth
                        {...register(`education.${index}.concentration`)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="GPA"
                        fullWidth
                        {...register(`education.${index}.gpa`)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Relevant Coursework"
                        fullWidth
                        {...register(`education.${index}.relevantCourses`)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label="Awards"
                        fullWidth
                        {...register(`education.${index}.awards`)}
                      />
                    </Grid>
                  </Grid>
                  <IconButton
                    onClick={() => removeEducation(index)}
                    color="error"
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddCircleOutlineIcon />}
                onClick={() =>
                  appendEducation({
                    university: "",
                    major: "",
                    concentration: "",
                    gpa: 0.0,
                    relevantCourses: [],
                    awards: [],
                  })
                }
              >
                Add Education
              </Button>
            </AccordionDetails>
          </Accordion>

          {/* Programming Languages */}
          <Accordion
            expanded={expanded === "programmingLanguages"}
            onChange={handleAccordionChange("programmingLanguages")}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Programming Languages</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {programmingLanguagesFields.map((field, index) => (
                <Box key={field.id} mt={2}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label="Language"
                        fullWidth
                        {...register(`programmingLanguages.${index}.skill`)}
                        required={
                          !!getValues(`programmingLanguages.${index}.skill`)
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        select
                        label="Skill Level"
                        fullWidth
                        defaultValue=""
                        {...register(
                          `programmingLanguages.${index}.skillLevel`
                        )}
                        required={
                          !!getValues(`programmingLanguages.${index}.skill`)
                        }
                      >
                        <MenuItem value="familiar">Familiar</MenuItem>
                        <MenuItem value="well-versed">Well-Versed</MenuItem>
                        <MenuItem value="expert">Expert</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                  <IconButton
                    onClick={() => removeProgrammingLanguages(index)}
                    color="error"
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddCircleOutlineIcon />}
                onClick={() =>
                  appendProgrammingLanguages({
                    skill: "",
                    skillLevel: "familiar",
                  })
                }
              >
                Add Programming Language
              </Button>
            </AccordionDetails>
          </Accordion>

          {/* Technologies */}
          <Accordion
            expanded={expanded === "technologies"}
            onChange={handleAccordionChange("technologies")}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Technologies</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {technologiesFields.map((field, index) => (
                <Box key={field.id} mt={2}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label="Technology"
                        fullWidth
                        {...register(`technologies.${index}.skill`)}
                        required={!!getValues(`technologies.${index}.skill`)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        select
                        label="Skill Level"
                        fullWidth
                        defaultValue=""
                        {...register(`technologies.${index}.skillLevel`)}
                        required={!!getValues(`technologies.${index}.skill`)}
                      >
                        <MenuItem value="familiar">Familiar</MenuItem>
                        <MenuItem value="well-versed">Well-Versed</MenuItem>
                        <MenuItem value="expert">Expert</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                  <IconButton
                    onClick={() => removeTechnologies(index)}
                    color="error"
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                </Box>
              ))}
              {!canAddTechnology &&
                alertMessage(
                  "Check for empty technology names before adding another."
                )}
              <Button
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => {
                  handleAddTechnology();
                }}
              >
                Add Technology
              </Button>
            </AccordionDetails>
          </Accordion>

          {/* Projects */}
          <Accordion
            expanded={expanded === "projects"}
            onChange={handleAccordionChange("projects")}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Projects</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {projectsFields.map((field, index) => (
                <Box key={field.id} mt={2}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label="Project Name"
                        fullWidth
                        {...register(`projects.${index}.name`)}
                        required={!!getValues(`projects.${index}.name`)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label="Links (Separate by commas)"
                        fullWidth
                        {...register(`projects.${index}.links`)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Bullet Points (Max: 3)
                      </Typography>
                      {field.bulletPoints?.map((_, bulletIndex) => (
                        <Box key={bulletIndex} mt={1}>
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 10 }}>
                              <TextField
                                label={`Bullet Point ${bulletIndex + 1}`}
                                fullWidth
                                maxLength={250}
                                {...register(
                                  `projects.${index}.bulletPoints.${bulletIndex}`
                                )}
                              />
                            </Grid>
                            <Grid size={{ xs: 2 }}>
                              <IconButton
                                onClick={() => {
                                  const currentProjects = getValues("projects");
                                  const currentProject = currentProjects[index];
                                  const updatedBulletPoints =
                                    currentProject.bulletPoints.filter(
                                      (_: string, i: number) =>
                                        i !== bulletIndex
                                    );
                                  updateProjects(index, {
                                    ...currentProject,
                                    bulletPoints: updatedBulletPoints,
                                  });
                                }}
                                color="error"
                              >
                                <RemoveCircleOutlineIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Box>
                      ))}
                      <Button
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() => {
                          const currentProjects = getValues("projects"); // Get current form values
                          const currentProject = currentProjects[index];

                          if (
                            (currentProject.bulletPoints?.length || 0) <
                            MAX_BULLET_POINTS_EMPLOYMENT
                          ) {
                            // Update only the bulletPoints using the current form state, not the original `field`
                            updateProjects(index, {
                              ...currentProject,
                              bulletPoints: [
                                ...(currentProject.bulletPoints || []),
                                "",
                              ],
                            });
                          } else {
                            alert(
                              `You can only add up to ${MAX_BULLET_POINTS_EMPLOYMENT} bullet points.`
                            );
                          }
                        }}
                        size="small"
                      >
                        Add Bullet Point
                      </Button>
                    </Grid>
                  </Grid>
                  <IconButton
                    onClick={() => removeProjects(index)}
                    color="error"
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddCircleOutlineIcon />}
                onClick={() =>
                  appendProjects({
                    name: "",
                    links: [],
                    bulletPoints: [],
                  })
                }
              >
                Add Project
              </Button>
            </AccordionDetails>
          </Accordion>

          {/* Employment */}
          <Accordion
            expanded={expanded === "employment"}
            onChange={handleAccordionChange("employment")}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Employment</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {employmentFields.map((field, index) => (
                <Box key={field.id} mt={2}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label="Company Name"
                        fullWidth
                        {...register(`employment.${index}.name`)}
                        required={!!getValues(`employment.${index}.name`)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Dates (e.g., Jan 2020 - Dec 2022)"
                        fullWidth
                        {...register(`employment.${index}.dates`)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Role"
                        fullWidth
                        {...register(`employment.${index}.role`)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label="Location"
                        fullWidth
                        {...register(`employment.${index}.location`)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Bullet Points (Max: 3)
                      </Typography>
                      {field.bulletPoints?.map((_, bulletIndex) => (
                        <Box key={bulletIndex} mt={1}>
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 6, sm: 6 }} offset={2}>
                              <TextField
                                label={`Bullet Point ${bulletIndex + 1}`}
                                fullWidth
                                maxLength={250}
                                {...register(
                                  `employment.${index}.bulletPoints.${bulletIndex}`
                                )}
                              />
                            </Grid>
                            <Grid size={{ xs: 2 }}>
                              <IconButton
                                onClick={() => {
                                  const currentEmployments =
                                    getValues("employment");
                                  const currentEmployment =
                                    currentEmployments[index];
                                  const updatedBulletPoints =
                                    currentEmployment.bulletPoints.filter(
                                      (_: string, i: number) =>
                                        i !== bulletIndex
                                    );
                                  updateEmployment(index, {
                                    ...currentEmployment,
                                    bulletPoints: updatedBulletPoints,
                                  });
                                }}
                                color="error"
                              >
                                <RemoveCircleOutlineIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Box>
                      ))}
                      <Button
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() => {
                          const currentEmployments = getValues("employment"); // Get current form values
                          const currentEmployment = currentEmployments[index];

                          if (
                            (currentEmployment.bulletPoints?.length || 0) <
                            MAX_BULLET_POINTS_EMPLOYMENT
                          ) {
                            // Update only the bulletPoints using the current form state, not the original `field`
                            updateEmployment(index, {
                              ...currentEmployment,
                              bulletPoints: [
                                ...(currentEmployment.bulletPoints || []),
                                "",
                              ],
                            });
                          } else {
                            alert(
                              `You can only add up to ${MAX_BULLET_POINTS_EMPLOYMENT} bullet points.`
                            );
                          }
                        }}
                        size="small"
                      >
                        Add Bullet Point
                      </Button>
                    </Grid>
                  </Grid>
                  <IconButton
                    onClick={() => removeEmployment(index)}
                    color="error"
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddCircleOutlineIcon />}
                onClick={() =>
                  appendEmployment({
                    name: "",
                    dates: "",
                    role: "",
                    location: "",
                    bulletPoints: [],
                  })
                }
              >
                Add Employment
              </Button>
            </AccordionDetails>
          </Accordion>

          {/* Submit */}
          <Box mt={4}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Save Resume
            </Button>
          </Box>
        </form>
      </Box>
    </ThemeProvider>
  );
}
