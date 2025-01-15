import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Chip,
  Stack,
} from "@mui/material";
import { ResumeFormValues as FormValues } from "../Talent/FormValues";
import { useNavigate } from "react-router-dom";
import NavBar from "../../NavBar";

export default function DashboardResumes({
  resumes,
}: {
  resumes: FormValues[];
}) {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <NavBar />
      <Typography variant="h4" sx={{ mt: 12, mb: 4, color: "#1E1E1E" }}>
        Available Resumes
      </Typography>
      <Grid container spacing={3}>
        {resumes.map((resume, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                backgroundColor: "#1E1E1E",
                color: "white",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: 2,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "primary.light" }}
                >
                  {resume.first_name} {resume.last_name}
                </Typography>
                <Typography variant="body2" sx={{ color: "white", mb: 2 }}>
                  {resume.university}
                </Typography>
                <Typography variant="body2" sx={{ color: "white", mb: 1 }}>
                  Experience: {resume.years_of_experience} years
                </Typography>
                <Typography variant="body2" sx={{ color: "white", mb: 2 }}>
                  Location: {resume.metro_area}
                  {resume.relocate && " (Open to relocation)"}
                </Typography>

                {/* Technologies */}
                <Typography variant="body2" sx={{ color: "white", mb: 1 }}>
                  <strong>Technologies:</strong>
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ flexWrap: "wrap", gap: 1, mb: 2 }}
                >
                  {resume.technologies.slice(0, 3).map((tech, idx) => (
                    <Chip
                      key={idx}
                      label={tech.skill}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        color: "white",
                      }}
                    />
                  ))}
                  {resume.technologies.length > 3 && (
                    <Chip
                      label={`+${resume.technologies.length - 3}`}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        color: "white",
                      }}
                    />
                  )}
                </Stack>

                {/* Languages */}
                <Typography variant="body2" sx={{ color: "white", mb: 1 }}>
                  <strong>Languages:</strong>
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ flexWrap: "wrap", gap: 1 }}
                >
                  {resume.languages.map((lang, idx) => (
                    <Chip
                      key={idx}
                      label={`${lang.skill} (${lang.level})`}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        color: "white",
                      }}
                    />
                  ))}
                </Stack>
              </CardContent>
              <CardActions sx={{ p: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  fullWidth
                  onClick={() => {
                    navigate(`business/resume/details/${resume.user_id}`);
                  }}
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                  }}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
