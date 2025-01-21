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
  Paper,
} from "@mui/material";
import { Grid2 as Grid } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Unstable_NumberInput as NumberInput } from "@mui/base/Unstable_NumberInput";
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
import { useUniversitySearch } from "../../hooks/useUniversitySearch";
import { countries } from "./Collections/Countries";
import { programmingLanguages } from "./Collections/ProgrammingLanguages";
import { technologies } from "./Collections/Technologies";
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

  const [universityQuery, setUniversityQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const { universities, error } = useUniversitySearch(
    universityQuery,
    selectedCountry
  );

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
      university: "",
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

      let pdfUrl = data.resume_pdf;
      if (pdfFile) {
        try {
          pdfUrl = await uploadPdfToStorage(pdfFile);
        } catch (error) {
          setUploadError((error as Error).message);
          return;
        }
      }

      const payload = {
        ...data,
        relocate: data.relocate,
        user_id: user.id,
        resume_pdf: pdfUrl,
      };

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
      navigate(`/resources`, { replace: true });
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
                    <TextField
                      select
                      fullWidth
                      label="Country of Study"
                      value={selectedCountry}
                      onChange={(e) => {
                        setSelectedCountry(e.target.value);
                      }}
                    >
                      {countries.map((country) => (
                        <MenuItem key={country} value={country}>
                          {country}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="university"
                      control={control}
                      rules={{ required: "University is required" }}
                      render={({ field }) => (
                        <TextField
                          fullWidth
                          required
                          label="University"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setUniversityQuery(e.target.value);
                          }}
                          error={!!errors.university || !!error}
                          helperText={errors.university?.message || error || ""}
                        />
                      )}
                    />
                    {universities.length > 0 && (
                      <Paper
                        sx={{
                          mt: 1,
                          maxHeight: 200,
                          overflowY: "auto",
                          position: "absolute",
                          zIndex: 1000,
                          width: "calc(100% - 32px)",
                        }}
                      >
                        {universities.map((uni, index) => (
                          <MenuItem
                            key={index}
                            onClick={() => {
                              reset({
                                ...getValues(),
                                university: uni.name,
                              });
                              setUniversityQuery("");
                            }}
                          >
                            {uni.name}
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              sx={{ ml: 1 }}
                            >
                              {uni.country}
                            </Typography>
                          </MenuItem>
                        ))}
                      </Paper>
                    )}
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
                      rules={{ required: "Relocation question is necessary" }}
                      render={({ field }) => (
                        <TextField
                          select
                          label="Willing to Relocate?"
                          fullWidth
                          {...field}
                          required
                          error={!!errors.relocate}
                          helperText={
                            errors.relocate &&
                            "Relocation question is necessary"
                          }
                        >
                          <MenuItem key="Yes" value={"true"}>
                            Yes
                          </MenuItem>
                          <MenuItem key="No" value={"false"}>
                            No
                          </MenuItem>
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="years_of_experience"
                      control={control}
                      rules={{
                        required: "Years of experience is required",
                      }}
                      render={({ field }) => (
                        <NumberInput
                          {...field}
                          error={!!errors.years_of_experience}
                          id="years_of_experience"
                          aria-label="Years of Relevant Experience"
                          min={0}
                          max={100}
                          step={1}
                          style={{
                            width: "100%",
                            padding: "16.5px 14px",
                            borderRadius: "4px",
                            border: errors.years_of_experience
                              ? "1px solid red"
                              : "1px solid #c4c4c4",
                          }}
                        />
                      )}
                    />
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
