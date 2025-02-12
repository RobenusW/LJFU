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
  Autocomplete,
} from "@mui/material";
import { Grid2 as Grid } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
import { programmingLanguages } from "./Collections/ProgrammingLanguages";
import { technologies } from "./Collections/Technologies";
import { UniversitiesList } from "./Collections/Universities";
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

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadPdfToStorage = async (file: File): Promise<string> => {
    const allowedTypes = ["application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Please upload a PDF file");
    }

    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      throw new Error("File size must be less than 2MB");
    }

    try {
      if (!user) {
        throw new Error("User is not logged in to upload resume");
      }

      const fileExt = file.name.split(".").pop();
      const cleanFileName = `resume_${user.id}.${fileExt}`;
      const filePath = `${user.id}/${cleanFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, file, {
          upsert: true,
          contentType: "application/pdf",
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data } = supabase.storage.from("resumes").getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error: Error | unknown) {
      throw new Error(`Error uploading file: ${(error as Error).message}`);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setUploadError(null);
    }
  };

  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<ResumeFormValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
      universities: [],
      position: [],
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
        return;
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
          universities: resume.universities,
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

  function removeSpecialCharacters(str: string) {
    return str.replace(/[^a-zA-Z, ]/g, "");
  }

  const onSubmit = async (data: ResumeFormValues) => {
    try {
      if (!user) {
        throw new Error("User is not logged in");
      }

      let pdfUrl = data.resume_pdf;
      console.log(existingResume?.resume_pdf);

      if (pdfFile) {
        try {
          pdfUrl = await uploadPdfToStorage(pdfFile);
        } catch (error) {
          setUploadError((error as Error).message);
          return;
        }
      } else if (!existingResume?.resume_pdf && !pdfFile) {
        alert("Please upload a resume first!");
        return;
      }

      data.universities = data.universities.map((uni) => ({
        universityname: removeSpecialCharacters(uni.universityname!),
      }));

      const payload = {
        ...data,
        universities: data.universities,
        relocate: data.relocate,
        user_id: user.id,
        resume_pdf: pdfUrl,
      };

      console.log(pdfUrl);

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
        throw new Error("Resume error:" + response.error);
      }
      // Update user t
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          chosen_role: "talent",
        },
      });

      if (authError) {
        throw new Error(`Auth Update Error: ${authError.message}`);
      }

      // Navigate to the dashboard if all operations are successful
      navigate(`/success`, { replace: true });
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
    let values = getValues();
    values = { ...values, relocate: Boolean(values.relocate) };
    console.log(values);

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

    if (isGeneralInfoFilled) {
      const isValid = await trigger(); //Check on this
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
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({ control, name: "universities" });

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
                      error={!!errors.first_name}
                      helperText={errors.first_name && "First name is required"}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Last Name"
                      fullWidth
                      {...register("last_name", { required: true })}
                      required
                      error={!!errors.last_name}
                      helperText={errors.last_name && "Last name is required"}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="position"
                      control={control}
                      rules={{ required: "Position is required" }}
                      render={({ field }) => (
                        <TextField
                          select
                          label="Position (Select Multiple)"
                          fullWidth
                          required
                          {...field}
                          SelectProps={{
                            multiple: true,
                            MenuProps: {
                              PaperProps: {
                                style: {
                                  maxHeight: 224,
                                },
                              },
                            },
                          }}
                          error={!!errors.position}
                          helperText={errors.position && "Position is required"}
                        >
                          {positions.map((position) => (
                            <MenuItem key={position} value={position}>
                              {position}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="metro_area"
                      control={control}
                      rules={{ required: "Metro area is required" }}
                      render={({ field }) => (
                        <TextField
                          select
                          label="Current Metro Area"
                          fullWidth
                          {...field}
                          required
                          error={!!errors.metro_area}
                          helperText={
                            errors.metro_area && "Metro area is required"
                          }
                        >
                          {metroAreas.map((metro_area) => (
                            <MenuItem key={metro_area} value={metro_area}>
                              {metro_area}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="relocate"
                      control={control}
                      render={({ field, fieldState }) => (
                        <TextField
                          select
                          label="Willing to Relocate?"
                          fullWidth
                          required
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          {...field}
                        >
                          <MenuItem value="true">Yes</MenuItem>
                          <MenuItem value="false">No</MenuItem>
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="years_of_experience"
                      control={control}
                      rules={{ required: "Years of experience is necessary" }}
                      render={({ field }) => (
                        <TextField
                          select
                          label="Years of Experience"
                          fullWidth
                          {...field}
                          required
                          error={!!errors.years_of_experience}
                          helperText={
                            errors.years_of_experience &&
                            "Years of experience is necessary"
                          }
                        >
                          <MenuItem key="0" value={0}>
                            Less than 1 year
                          </MenuItem>
                          {[...Array(60).keys()].map((year) => (
                            <MenuItem key={year + 1} value={year + 1}>
                              {year + 1}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
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
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ mb: 2 }}>
                      {educationFields.map((field, index) => (
                        <Box key={field.id} sx={{ mb: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              mb: 1,
                            }}
                          >
                            <Box sx={{ flex: 1 }}>
                              <Controller
                                name={`universities.${index}.universityname`}
                                control={control}
                                rules={{ required: "University is required" }}
                                render={({
                                  field: { onChange, value },
                                  fieldState: { error },
                                }) => (
                                  <Autocomplete
                                    onChange={(_, item) => {
                                      onChange(item);
                                    }}
                                    disablePortal
                                    value={value}
                                    options={UniversitiesList}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="University"
                                        error={!!error}
                                        helperText={error?.message}
                                        required
                                      />
                                    )}
                                  />
                                )}
                              />
                              <Button
                                onClick={() => removeEducation(index)}
                                color="error"
                                startIcon={<RemoveCircleOutlineIcon />}
                                size="small"
                              >
                                Remove University
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      ))}

                      {/* Add University Button */}
                      <Button
                        variant="contained"
                        component="span"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() => appendEducation({ universityname: "" })}
                        sx={{ mt: 2 }}
                      >
                        Add University
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Programming Languages */}
            <Accordion
              expanded={expanded === "languages"}
              onChange={handleAccordionChange("languages")}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  <Typography variant="h6">Programming Languages</Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      ml: "auto",
                      color:
                        languagesFields.length >= 15
                          ? "error.main"
                          : "text.secondary",
                      fontSize: "0.875rem",
                    }}
                  >
                    {languagesFields.length}/15
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {languagesFields.map((field, index) => (
                  <Box key={field.id} mt={2}>
                    <Grid container spacing={2}>
                      {/* Language Skill Field */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                          name={`languages.${index}.skill`}
                          control={control}
                          defaultValue={field.skill || ""}
                          rules={{
                            required: "Programming language is required",
                          }}
                          render={({
                            field: controllerField,
                            fieldState: { error },
                          }) => (
                            <TextField
                              {...controllerField}
                              select
                              label="Programming Language"
                              fullWidth
                              error={!!error}
                              helperText={error ? error.message : null}
                              required
                            >
                              {programmingLanguages.map((lang) => (
                                <MenuItem key={lang} value={lang}>
                                  {lang}
                                </MenuItem>
                              ))}
                            </TextField>
                          )}
                        />
                      </Grid>

                      {/* Language Skill Level Field */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                          name={`languages.${index}.level`}
                          control={control}
                          defaultValue={field.level || ""}
                          rules={{ required: "Skill level is required" }}
                          render={({
                            field: controllerField,
                            fieldState: { error },
                          }) => (
                            <TextField
                              {...controllerField}
                              select
                              label="Skill Level"
                              fullWidth
                              error={!!error}
                              helperText={error ? error.message : null}
                              required
                            >
                              <MenuItem value="familiar">Familiar</MenuItem>
                              <MenuItem value="well-versed">
                                Well-Versed
                              </MenuItem>
                              <MenuItem value="expert">Expert</MenuItem>
                            </TextField>
                          )}
                        />
                      </Grid>
                    </Grid>

                    {/* Remove Language Button */}
                    <IconButton
                      onClick={() => removeLanguage(index)}
                      color="error"
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </Box>
                ))}
                {/* Add Language Button */}
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() =>
                    appendLanguage({
                      skill: "",
                      level: "",
                    })
                  }
                  disabled={languagesFields.length >= 15}
                  sx={{ mt: 2 }}
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
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  <Typography variant="h6">Technologies</Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      ml: "auto",
                      color:
                        technologiesFields.length >= 20
                          ? "error.main"
                          : "text.secondary",
                      fontSize: "0.875rem",
                    }}
                  >
                    {technologiesFields.length}/20
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {technologiesFields.map((field, index) => (
                  <Box key={field.id} mt={2}>
                    <Grid container spacing={2}>
                      {/* Technology Skill Field */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                          name={`technologies.${index}.skill`}
                          control={control}
                          defaultValue={field.skill || ""}
                          rules={{ required: "Technology is required" }}
                          render={({
                            field: controllerField,
                            fieldState: { error },
                          }) => (
                            <TextField
                              {...controllerField}
                              select
                              label="Technology"
                              fullWidth
                              error={!!error}
                              helperText={error ? error.message : null}
                              required
                            >
                              {technologies.map((tech) => (
                                <MenuItem key={tech} value={tech}>
                                  {tech}
                                </MenuItem>
                              ))}
                            </TextField>
                          )}
                        />
                      </Grid>

                      {/* Technology Skill Level Field */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                          name={`technologies.${index}.level`}
                          control={control}
                          defaultValue={field.level || ""}
                          rules={{ required: "Skill level is required" }}
                          render={({
                            field: controllerField,
                            fieldState: { error },
                          }) => (
                            <TextField
                              {...controllerField}
                              select
                              label="Skill Level"
                              fullWidth
                              error={!!error}
                              helperText={error ? error.message : null}
                              required
                            >
                              <MenuItem value="familiar">Familiar</MenuItem>
                              <MenuItem value="well-versed">
                                Well-Versed
                              </MenuItem>
                              <MenuItem value="expert">Expert</MenuItem>
                            </TextField>
                          )}
                        />
                      </Grid>
                    </Grid>

                    {/* Remove Technology Button */}
                    <IconButton
                      onClick={() => removeTechnology(index)}
                      color="error"
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </Box>
                ))}
                {/* Add Technology Button */}
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() =>
                    appendTechnology({
                      skill: "",
                      level: "",
                    })
                  }
                  disabled={technologiesFields.length >= 20}
                  sx={{ mt: 2 }}
                >
                  Add Technology
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
                    <Box sx={{ mt: 2, mb: 2 }}>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        id="pdf-upload"
                        required
                      />
                      <label htmlFor="pdf-upload">
                        <Button
                          variant="contained"
                          component="span"
                          startIcon={<AddCircleOutlineIcon />}
                        >
                          Upload Resume PDF
                        </Button>
                      </label>
                      {pdfFile && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Selected file: {pdfFile.name}
                        </Typography>
                      )}
                      {uploadError && (
                        <Alert severity="error" sx={{ mt: 1 }}>
                          {uploadError}
                        </Alert>
                      )}
                    </Box>
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
