// Start of Selection
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
  Alert,
  AlertTitle,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Grid2 as Grid } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useForm, useFieldArray } from "react-hook-form";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useNavigate } from "react-router-dom";
import { Database } from "../Interfaces-types/database.types";
import { editorTheme } from "./editorTheme";
import NavBar from "../../NavBar";
import { positions } from "./Collections/Positions";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../supabase";
import { ResumeFormValues } from "./FormValues";
import { metroAreas } from "./Collections/MetroAreas";
export default function ResumeEditor() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [existingResume, setExistingResume] = useState<
    Database["public"]["Tables"]["resumes"]["Row"] | null
  >(null);
  const [expanded, setExpanded] = useState<string | false>("generalInfo");

  const handleAccordionChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const [generalInfo, setGeneralInfo] = useState<ResumeFormValues>({
    first_name: "",
    last_name: "",
    email: "",
    university: "",
    position: "",
    metro_area: "",
    years_of_experience: 0,
    technologies: [],
    languages: [],
    resume_pdf: "",
    user_id: "",
    relocate: false,
  });

  const { control, register, handleSubmit, reset, getValues, trigger } =
    useForm<ResumeFormValues>({
      defaultValues: {
        first_name: "",
        last_name: "",
        email: "",
        university: "",
        position: "",
        metro_area: "",
        years_of_experience: 0,
        technologies: [],
        languages: [],
        resume_pdf: "",
        user_id: "",
        relocate: false,
      },
    });

  useEffect(() => {
    const fetchResume = async () => {
      if (!user) {
        throw new Error("User is not logged in");
      } else if (user.user_metadata.chosen_role === undefined) {
        return;
      } else if (user.user_metadata.chosen_role === "talent") {
        const { data, error } = await supabase
          .from("resumes")
          .select("*")
          .eq("user_id", user.id);

        setExistingResume(data?.[0] || null);
        if (error) {
          throw new Error("Error fetching resume");
        }
        const resume = data[0];
        reset({
          first_name: resume.first_name,
          last_name: resume.last_name,
          email: resume.email,
          university: resume.university,
          position: resume.position,
          metro_area: resume.metro_area,
          years_of_experience: resume.years_of_experience,
          technologies: resume.technologies,
          languages: resume.languages,
          resume_pdf: resume.resume_pdf,
          relocate: resume.relocate,
        });
      }
    };
    fetchResume();
  }, [reset, user]);

  const onSubmit = async (data: ResumeFormValues) => {
    try {
      if (!user) {
        throw new Error("User is not logged in");
      }

      const payload = { ...data, user_id: user.id };

      let response;
      if (existingResume) {
        response = await supabase
          .from("resumes")
          .update(payload)
          .eq("user_id", existingResume.user_id);
      } else {
        response = await supabase.from("resumes").insert(payload);
      }

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Update user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          chosen_role: "talent",
        },
      });

      if (authError) {
        throw new Error(`Auth Update Error: ${authError.message}`);
      }

      // Navigate to the dashboard if all operations are successful
      navigate(`/talent/dashboard`, { replace: true });
    } catch (error: Error | unknown) {
      console.error("Error during resume submission:", error);
      alert(
        `An error occurred while saving the resume: ${
          (error as Error).message || "Unknown error"
        }`
      );
    }
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const values = getValues();

    // Helper function to check if a value is non-empty
    const isNonEmpty = (value: unknown): boolean => {
      if (value === null || value === undefined || value === "") return false;
      if (Array.isArray(value)) return value.some(isNonEmpty); // Check arrays
      if (typeof value === "object") {
        return Object.values(value).some(isNonEmpty); // Check nested objects
      }
      return true; // For non-empty primitives (e.g., numbers, booleans)
    };

    const isGeneralInfoFilled = isNonEmpty(values);

    if (!isGeneralInfoFilled) {
      console.log("Please fill out at least one field.");
      return;
    }

    if (isGeneralInfoFilled) {
      const isValid = await trigger();
      if (isValid) {
        handleSubmit(onSubmit)();
      } else {
        alert("Please fill in all required fields and upload a resume.");
      }
    } else {
      handleSubmit(onSubmit)();
    }
  };

  const {
    fields: technologiesFields,
    append: appendTechnology,
    remove: removeTechnology,
  } = useFieldArray({ control, name: "technologies" });

  const {
    fields: languagesFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({ control, name: "languages" });

  return (
    <>
      <div style={{ marginTop: "80px" }}>
        <NavBar />
      </div>

      <ThemeProvider theme={editorTheme}>
        <CssBaseline />
        <Box p={3}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            color="secondary"
          >
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
                      {...register("first_name", { required: true })}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Last Name"
                      fullWidth
                      {...register("last_name", { required: true })}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Email"
                      fullWidth
                      {...register("email", { required: true })}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="University"
                      fullWidth
                      {...register("university", {
                        required: true,
                      })}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      select
                      label="Position"
                      fullWidth
                      {...register("position", { required: true })}
                      required
                      value={generalInfo.position}
                      onChange={(e) => {
                        setGeneralInfo({
                          ...generalInfo,
                          position: e.target.value,
                        });
                      }}
                    >
                      {positions.map((position) => (
                        <MenuItem key={position} value={position}>
                          {position}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      select
                      label="Metro Area"
                      fullWidth
                      {...register("metro_area", {
                        required: true,
                      })}
                      required
                      value={generalInfo.metro_area}
                      onChange={(e) => {
                        setGeneralInfo({
                          ...generalInfo,
                          metro_area: e.target.value,
                        });
                      }}
                    >
                      {metroAreas.map((metro_area) => (
                        <MenuItem key={metro_area} value={metro_area}>
                          {metro_area}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...register("relocate", {
                            required: true,
                          })}
                        />
                      }
                      label="Willing to Relocate?"
                    />
                  </FormGroup>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Years of Experience"
                      type="number"
                      fullWidth
                      {...register("years_of_experience", {
                        valueAsNumber: true,
                        required: true,
                      })}
                      required
                    />
                  </Grid>
                </Grid>
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
                          {...register(`technologies.${index}.skill` as const)}
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          select
                          label="Skill Level"
                          fullWidth
                          defaultValue="familiar"
                          {...register(`technologies.${index}.level` as const)}
                          required
                        >
                          <MenuItem value="familiar">Familiar</MenuItem>
                          <MenuItem value="well-versed">Well-Versed</MenuItem>
                          <MenuItem value="expert">Expert</MenuItem>
                        </TextField>
                      </Grid>
                    </Grid>
                    <IconButton
                      onClick={() => removeTechnology(index)}
                      color="error"
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() =>
                    appendTechnology({
                      skill: "",
                      level: "familiar",
                    })
                  }
                >
                  Add Technology
                </Button>
              </AccordionDetails>
            </Accordion>

            {/* Languages */}
            <Accordion
              expanded={expanded === "languages"}
              onChange={handleAccordionChange("languages")}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Languages</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {languagesFields.map((field, index) => (
                  <Box key={field.id} mt={2}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          label="Language"
                          fullWidth
                          {...register(`languages.${index}.skill` as const)}
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          select
                          label="Skill Level"
                          fullWidth
                          defaultValue="familiar"
                          {...register(`languages.${index}.level` as const)}
                          required
                        >
                          <MenuItem value="familiar">Familiar</MenuItem>
                          <MenuItem value="well-versed">Well-Versed</MenuItem>
                          <MenuItem value="expert">Expert</MenuItem>
                        </TextField>
                      </Grid>
                    </Grid>
                    <IconButton
                      onClick={() => removeLanguage(index)}
                      color="error"
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() =>
                    appendLanguage({
                      skill: "",
                      level: "familiar",
                    })
                  }
                >
                  Add Language
                </Button>
              </AccordionDetails>
            </Accordion>

            {/* PDF Upload */}
            <Accordion
              expanded={expanded === "pdfUpload"}
              onChange={handleAccordionChange("pdfUpload")}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Upload PDF Resume</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <input
                      type="file"
                      accept="application/pdf"
                      {...register("resume_pdf", { required: true })}
                      required
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Box mt={2}>
              <Alert severity="info">
                <AlertTitle>Why can't I save my progress?</AlertTitle>
                This application is designed to be simple and fast. To avoid
                uncompleted resumes, we recommend completing it in one sitting.
              </Alert>
            </Box>

            {/* Submit */}
            <Box mt={4}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
              >
                Submit Resume
              </Button>
            </Box>
          </form>
        </Box>
      </ThemeProvider>
    </>
  );
}
