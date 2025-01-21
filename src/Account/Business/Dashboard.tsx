import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Chip,
  InputAdornment,
  Autocomplete,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  CardActions,
  Switch,
  FormControlLabel,
  IconButton,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import EmailIcon from "@mui/icons-material/Email";
import { Grid2 as Grid } from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "../supabase";
import NavBar from "../../NavBar";
import SearchIcon from "@mui/icons-material/Search";
import { ResumeFormValues } from "../Talent/FormValues";

export default function Dashboard() {
  const [resumes, setResumes] = useState<ResumeFormValues[]>([]);
  const [filteredResumes, setFilteredResumes] = useState<ResumeFormValues[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    university: "",
    position: "",
    metro_area: "",
    relocate: null as boolean | null,
    minYearsOfExperience: 0,
    technologies: [] as string[],
    languages: [] as string[],
  });

  // Available options for filters
  const [availableOptions, setAvailableOptions] = useState({
    universities: new Set<string>(),
    positions: new Set<string>(),
    locations: new Set<string>(),
    technologies: new Set<string>(),
    languages: new Set<string>(),
  });

  useEffect(() => {
    fetchResumes();
  }, []);

  const seeResume = async (user_id: string): Promise<string> => {
    const { data, error } = await supabase.storage
      .from("resumes")
      .createSignedUrl(`${user_id}/resume_${user_id}.pdf`, 60);

    if (error) {
      throw new Error(`Error creating signed URL, ${error}`);
    }

    return data.signedUrl;
  };

  const fetchResumes = async () => {
    try {
      const { data, error } = await supabase.from("resumes").select("*");
      if (error) throw error;
      setResumes(data || []);

      // Update available options
      const options = {
        universities: new Set<string>(),
        positions: new Set<string>(),
        locations: new Set<string>(),
        technologies: new Set<string>(),
        languages: new Set<string>(),
      };

      data?.forEach((resume) => {
        if (resume.university) options.universities.add(resume.university);
        resume.position.forEach((pos) => options.positions.add(pos));
        if (resume.metro_area) options.locations.add(resume.metro_area);
        resume.technologies.forEach((tech) => {
          if (tech.skill) options.technologies.add(tech.skill);
        });
        resume.languages.forEach((lang) => {
          if (lang.skill) options.languages.add(lang.skill);
        });
      });

      setAvailableOptions(options);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  };

  useEffect(() => {
    let filtered = [...resumes];

    // Apply name search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (resume) =>
          resume.first_name.toLowerCase().includes(query) ||
          resume.last_name.toLowerCase().includes(query)
      );
    }

    // Only apply university filter if a university is selected
    if (filters.university) {
      filtered = filtered.filter(
        (resume) => resume.university === filters.university
      );
    }

    // Only apply position filter if a position is selected
    if (filters.position) {
      filtered = filtered.filter((resume) =>
        resume.position.includes(filters.position)
      );
    }

    if (filters.metro_area && !filters.relocate) {
      filtered = filtered.filter(
        (resume) => resume.metro_area === filters.metro_area
      );
    }

    if (filters.relocate !== null) {
      filtered = filtered.filter(
        (resume) => resume.relocate === filters.relocate
      );
    }

    if (filters.minYearsOfExperience > 0) {
      filtered = filtered.filter(
        (resume) => resume.years_of_experience >= filters.minYearsOfExperience
      );
    }

    if (filters.technologies.length > 0) {
      filtered = filtered.filter((resume) =>
        filters.technologies.every((tech) =>
          resume.technologies.some((t) => t.skill === tech)
        )
      );
    }

    if (filters.languages.length > 0) {
      filtered = filtered.filter((resume) =>
        filters.languages.every((lang) =>
          resume.languages.some((l) => l.skill === lang)
        )
      );
    }

    setFilteredResumes(filtered);
  }, [filters, searchQuery, resumes]);

  const ClearFilters = () => {
    setFilters({
      university: "",
      position: "",
      metro_area: "",
      relocate: null,
      minYearsOfExperience: 0,
      technologies: [],
      languages: [],
    });
  };

  const toggleFavorite = (userId: string) => {
    setFavorites(
      favorites.includes(userId)
        ? favorites.filter((id) => id !== userId)
        : [...favorites, userId]
    );
  };

  const displayedResumes = useMemo(() => {
    let results = filteredResumes;
    if (showFavoritesOnly) {
      results = results.filter((resume) => favorites.includes(resume.user_id));
    }
    return results;
  }, [filteredResumes, favorites, showFavoritesOnly]);

  const fetchUserEmail = async (userId: string): Promise<string> => {
    const { data, error } = await supabase.rpc("get_user_email", {
      user_id: userId,
    });
    console.log(data, error);
    if (error) throw error;
    return data;
  };

  const ResumeDashboardTheme = createTheme({
    palette: {
      primary: {
        main: "#000000",
      },
    },
  });

  return (
    <ThemeProvider theme={ResumeDashboardTheme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <div style={{ marginTop: "80px" }}>
          <NavBar />
        </div>
        <Container maxWidth="xl" sx={{ pt: 10, pb: 4 }}>
          <Paper sx={{ p: 3, mb: 4 }}>
            {/* Search Bar */}
            <TextField
              fullWidth
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            {/* Filters */}
            <Box sx={{ mb: 3, display: "flex", gap: 2, alignItems: "center" }}>
              <Grid container spacing={2}>
                {/* University Filter */}
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <Autocomplete
                    options={Array.from(availableOptions.universities)}
                    value={filters.university}
                    onChange={(_, newValue) =>
                      setFilters({ ...filters, university: newValue || "" })
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="University" fullWidth />
                    )}
                  />
                </Grid>

                {/* Position Filter */}
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <Autocomplete
                    options={Array.from(availableOptions.positions)}
                    value={filters.position}
                    onChange={(_, newValue) =>
                      setFilters({ ...filters, position: newValue || "" })
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Position" fullWidth />
                    )}
                  />
                </Grid>

                {/* Location/Relocation Filter */}
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Location Preference</InputLabel>
                    <Select
                      value={filters.relocate === null ? "" : filters.relocate}
                      label="Location Preference"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "relocate") {
                          setFilters({
                            ...filters,
                            relocate: true,
                            metro_area: "",
                          });
                        } else {
                          setFilters({
                            ...filters,
                            relocate: false,
                            metro_area: "",
                          });
                        }
                      }}
                    >
                      <MenuItem value="relocate">Open to Relocation</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Metro Area (only shown when Location Specific is selected) */}
                {filters.relocate === false && (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <Autocomplete
                      options={Array.from(availableOptions.locations)}
                      value={filters.metro_area}
                      onChange={(_, newValue) =>
                        setFilters({ ...filters, metro_area: newValue || "" })
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Metro Area" fullWidth />
                      )}
                    />
                  </Grid>
                )}

                {/* Years of Experience Filter */}
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Years of Experience</InputLabel>
                    <Select
                      value={filters.minYearsOfExperience || ""}
                      label="Years of Experience"
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          minYearsOfExperience: e.target.value as number,
                        })
                      }
                    >
                      <MenuItem value={0}>Any</MenuItem>
                      {[1, 2, 3, 5, 7, 10].map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}+ years
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Languages Filter */}
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <Autocomplete
                    multiple
                    options={Array.from(availableOptions.languages)}
                    value={filters.languages}
                    onChange={(_, newValue) => {
                      setFilters({
                        ...filters,
                        languages: newValue,
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Programming Languages"
                        placeholder="Select languages"
                      />
                    )}
                  />
                </Grid>

                {/* Technologies Filter */}
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <Autocomplete
                    multiple
                    options={Array.from(availableOptions.technologies)}
                    value={filters.technologies}
                    onChange={(_, newValue) => {
                      setFilters({
                        ...filters,
                        technologies: newValue,
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Technologies"
                        placeholder="Select technologies"
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  {/* Clear Filters Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={ClearFilters}
                    sx={{ mt: 2 }}
                  >
                    Clear Filters
                  </Button>
                </Grid>

                <FormControlLabel
                  control={
                    <Switch
                      checked={showFavoritesOnly}
                      onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                    />
                  }
                  label="Show Favorites Only"
                />
              </Grid>
            </Box>
          </Paper>

          {/* Results Display */}
          <Grid container spacing={3}>
            {displayedResumes.map((resume) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={resume.user_id}>
                <Card>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography variant="h6" component="div">
                        {resume.first_name} {resume.last_name}
                      </Typography>
                      <IconButton
                        onClick={() => toggleFavorite(resume.user_id)}
                        sx={{
                          color: favorites.includes(resume.user_id)
                            ? "#FFD700"
                            : "inherit",
                        }}
                      >
                        {favorites.includes(resume.user_id) ? (
                          <StarIcon />
                        ) : (
                          <StarBorderIcon />
                        )}
                      </IconButton>
                    </Box>
                    <Typography color="textSecondary" gutterBottom>
                      {resume.position.join(", ")}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {resume.university}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {resume.metro_area}
                      {resume.relocate && " (Open to Relocation)"}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Experience: {resume.years_of_experience} years
                    </Typography>

                    <Typography variant="subtitle2" gutterBottom>
                      Technologies:
                    </Typography>
                    <Box sx={{ mb: 1 }}>
                      {resume.technologies.map((tech, index) => (
                        <Chip
                          key={index}
                          label={`${tech.skill} (${tech.level})`}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>

                    <Typography variant="subtitle2" gutterBottom>
                      Languages:
                    </Typography>
                    <Box>
                      {resume.languages.map((lang, index) => (
                        <Chip
                          key={index}
                          label={`${lang.skill} (${lang.level})`}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "space-between" }}>
                    <Button
                      size="small"
                      color="primary"
                      onClick={async () => {
                        seeResume(resume.user_id).then((signedUrlPDF) => {
                          if (signedUrlPDF) {
                            window.open(signedUrlPDF);
                          }
                        });
                      }}
                    >
                      View Resume
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="inherit"
                      sx={{
                        bgcolor: "black",
                        color: "white",
                        "&:hover": {
                          bgcolor: "rgba(0, 0, 0, 0.8)",
                        },
                      }}
                      startIcon={<EmailIcon />}
                      onClick={() => {
                        fetchUserEmail(resume.user_id).then((email) => {
                          window.location.href = `mailto:${email}`;
                        });
                      }}
                    >
                      Email
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
